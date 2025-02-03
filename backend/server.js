const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://192.168.107.140:5173',
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'lostandfound',
    password: process.env.DB_PASSWORD || 'blank@0104',
    port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Successfully connected to database');
    }
});

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Lost Items Routes
app.post('/lost-items', async (req, res) => {
    try {
      const { item_name, person_name, lost_date, location, contact_number, email, description } = req.body;
      const query = `
        INSERT INTO lost_items (item_name, person_name, lost_date, location, contact_number, email, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [item_name, person_name, lost_date, location, contact_number, email, description];
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error creating lost item:', err.message);
      res.status(500).json({ error: err.message });
    }
  });
  

app.get('/lost-items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lost_items WHERE is_found = FALSE ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving lost items:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Found Items Routes
app.post('/found-items', upload.single('image'), async (req, res) => {
    try {
        const { item_name, description, found_date, location } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const query = `
            INSERT INTO found_items (item_name, description, found_date, location, image_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [item_name, description, found_date, location, image_url];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating found item:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/found-items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM found_items ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving found items:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Mark item as found
app.put('/lost-items/:id/mark-found', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'UPDATE lost_items SET is_found = TRUE WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error marking item as found:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.put('/found-items/:id/mark-claimed', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'UPDATE found_items SET is_claimed = true WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error marking item as claimed:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

// Report Generation Route
app.post('/generate-report', async (req, res) => {
    try {
        const { fromDate, toDate } = req.body;
        
        // Get statistics
        const lostItemsQuery = `
            SELECT COUNT(*) as total,
                   COUNT(CASE WHEN is_found = true THEN 1 END) as found
            FROM lost_items 
            WHERE created_at BETWEEN $1 AND $2
        `;
        
        const foundItemsQuery = `
            SELECT COUNT(*) as total
            FROM found_items 
            WHERE created_at BETWEEN $1 AND $2
        `;

        const [lostItems, foundItems] = await Promise.all([
            pool.query(lostItemsQuery, [fromDate, toDate]),
            pool.query(foundItemsQuery, [fromDate, toDate])
        ]);

        // Create PDF
        const doc = new PDFDocument();
        const filename = `report-${Date.now()}.pdf`;
        const stream = fs.createWriteStream(path.join(__dirname, 'reports', filename));

        doc.pipe(stream);

        // Add content to PDF
        doc.fontSize(20).text('Lost and Found Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Period: ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}`);
        doc.moveDown();
        
        doc.text(`Total Lost Items: ${lostItems.rows[0].total}`);
        doc.text(`Items Found: ${lostItems.rows[0].found}`);
        doc.text(`Total Found Items Reported: ${foundItems.rows[0].total}`);
        
        doc.end();

        stream.on('finish', () => {
            res.download(path.join(__dirname, 'reports', filename), filename, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                }
                // Delete file after download
                fs.unlink(path.join(__dirname, 'reports', filename), (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        });
    } catch (err) {
        console.error('Error generating report:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle process termination
process.on('SIGTERM', () => {
    pool.end();
    process.exit();
});