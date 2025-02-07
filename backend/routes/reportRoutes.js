const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'lostandfound',
    password: process.env.DB_PASSWORD || 'blank@0104',
    port: process.env.DB_PORT || 5432,
});

// Ensure 'reports' directory exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
}

// Generate Lost and Found Report
router.post('/generate-report', async (req, res) => {
    try {
        const { fromDate, toDate } = req.body;

        // Fetch lost and found item statistics
        const lostItemsQuery = `
            SELECT COUNT(*) AS total,
                   COUNT(CASE WHEN is_found = TRUE THEN 1 END) AS found
            FROM lost_items 
            WHERE created_at BETWEEN $1 AND $2
        `;

        const foundItemsQuery = `
            SELECT COUNT(*) AS total
            FROM found_items 
            WHERE created_at BETWEEN $1 AND $2
        `;

        const [lostItems, foundItems] = await Promise.all([
            pool.query(lostItemsQuery, [fromDate, toDate]),
            pool.query(foundItemsQuery, [fromDate, toDate])
        ]);

        // Create PDF report
        const doc = new PDFDocument();
        const filename = `report-${Date.now()}.pdf`;
        const filepath = path.join(reportsDir, filename);
        const stream = fs.createWriteStream(filepath);

        doc.pipe(stream);

        // Add report title
        doc.fontSize(20).text('Lost and Found Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Period: ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}`);
        doc.moveDown();

        // Report data
        doc.fontSize(14).text(`📌 Total Lost Items: ${lostItems.rows[0].total}`);
        doc.fontSize(14).text(`✔️ Items Found: ${lostItems.rows[0].found}`);
        doc.fontSize(14).text(`📌 Total Found Items Reported: ${foundItems.rows[0].total}`);
        
        doc.end();

        // Send the generated PDF
        stream.on('finish', () => {
            res.download(filepath, filename, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                }
                // Delete file after sending
                fs.unlink(filepath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        });
    } catch (err) {
        console.error('Error generating report:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
