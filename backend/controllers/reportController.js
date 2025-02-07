const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.body;

        const query = 'SELECT COUNT(*) as total FROM lost_items WHERE created_at BETWEEN $1 AND $2';
        const result = await pool.query(query, [fromDate, toDate]);

        const doc = new PDFDocument();
        const filename = `report-${Date.now()}.pdf`;
        const stream = fs.createWriteStream(path.join(__dirname, '../reports', filename));
        doc.pipe(stream);

        doc.fontSize(20).text('Lost and Found Report', { align: 'center' });
        doc.moveDown();
        doc.text(`Total Lost Items: ${result.rows[0].total}`);

        doc.end();

        stream.on('finish', () => {
            res.download(path.join(__dirname, '../reports', filename));
        });
    } catch (err) {
        console.error('Error generating report:', err.message);
        res.status(500).json({ error: err.message });
    }
};
