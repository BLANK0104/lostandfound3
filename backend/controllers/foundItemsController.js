const pool = require('../config/db');
const path = require('path');

exports.createFoundItem = async (req, res) => {
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
};
