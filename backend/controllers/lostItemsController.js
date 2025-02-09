const pool = require('../config/db');

exports.createLostItem = async (req, res) => {
    try {
        const { item_name, person_name, lost_date, location, contact_number, email, description, amount } = req.body;
        const query = `
            INSERT INTO lost_items (item_name, person_name, lost_date, location, contact_number, email, description, amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [item_name, person_name, lost_date, location, contact_number, email, description, amount];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating lost item:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getLostItems = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM lost_items WHERE is_found = FALSE ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving lost items:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.markLostItemAsFound = async (req, res) => {
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
};