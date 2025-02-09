const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createFoundItem } = require('../controllers/foundItemsController');
const pool = require('../config/db');

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
        cb(null, false);
        return cb(new Error('Only image files are allowed!'));
    }
});

// Get all found items
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM found_items ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving found items:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Create new found item - using the controller
router.post('/', upload.single('image'), createFoundItem);

// Get a specific found item
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM found_items WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving found item:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Mark an item as claimed
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

// Mark an item as returned
router.put('/:id/mark-returned', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'UPDATE found_items SET is_returned = true WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error marking item as returned:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Delete a found item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM found_items WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting found item:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;