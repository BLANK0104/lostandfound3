const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'lostandfound',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || 5432,
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

// 📌 GET All Found Items
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM found_items ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving found items:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// 📌 POST a New Found Item
router.post('/', upload.single('image'), async (req, res) => {
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

// 📌 Mark an Item as Claimed
router.put('/:id/mark-claimed', async (req, res) => {
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

module.exports = router;
