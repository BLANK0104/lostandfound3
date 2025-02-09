const pool = require('../db');
const PDFDocument = require('pdfkit');

const generateReport = async (req, res) => {
    try {
        const { fromDate, toDate } = req.body;

        // Fetch distinct lost item names and their counts within date range
        const lostItemsQuery = await pool.query(
            `SELECT item_name, COUNT(item_name) AS count FROM lost_items 
             WHERE created_at BETWEEN $1 AND $2
             GROUP BY item_name`,
            [fromDate, toDate]
        );

        // Fetch distinct found item names and their counts within date range
        const foundItemsQuery = await pool.query(
            `SELECT item_name, COUNT(item_name) AS count FROM found_items 
             WHERE created_at BETWEEN $1 AND $2
             GROUP BY item_name`,
            [fromDate, toDate]
        );

        // Calculate cash status
        const lostCashQuery = await pool.query(
            `SELECT AMOUNT AS count FROM lost_items 
             WHERE item_name = 'cash' AND created_at BETWEEN $1 AND $2`,
            [fromDate, toDate]
        );

        const foundCashQuery = await pool.query(
            `SELECT AMOUNT AS count FROM found_items 
             WHERE item_name = 'cash' AND created_at BETWEEN $1 AND $2`,
            [fromDate, toDate]
        );

        const cashStatus = foundCashQuery.rows[0].count - lostCashQuery.rows[0].count;

        // Create PDF document
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=report-${Date.now()}.pdf`);

        // Pipe PDF document to response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('Lost and Found Report', { align: 'center' });
        doc.moveDown();
        
        // Lost Items Section
        doc.fontSize(16).text('Lost Items:', { underline: true });
        doc.moveDown();
        lostItemsQuery.rows.forEach(item => {
            doc.fontSize(12).text(`Item: ${item.item_name}, Count: ${item.count}`);
            doc.moveDown();
        });

        // Found Items Section
        doc.fontSize(16).text('Found Items:', { underline: true });
        doc.moveDown();
        foundItemsQuery.rows.forEach(item => {
            doc.fontSize(12).text(`Item: ${item.item_name}, Count: ${item.count}`);
            doc.moveDown();
        });

        // Cash Status Section
        doc.fontSize(16).text('Cash Status:', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Current status of cash: ${cashStatus}`);
        doc.moveDown();

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

module.exports = { generateReport };