const pool = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

exports.createClaim = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { itemId } = req.params;
        const { claimer_name, claim_date, contact_number, signature } = req.body;

        console.log('Processing claim request:', {
            itemId,
            claimer_name,
            claim_date,
            contact_number,
            hasSignature: !!signature
        });

        // Validate required fields
        const missingFields = [];
        if (!claimer_name) missingFields.push('claimer_name');
        if (!claim_date) missingFields.push('claim_date');
        if (!contact_number) missingFields.push('contact_number');
        if (!signature) missingFields.push('signature');
        if (!itemId) missingFields.push('itemId');

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '../uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        // Save signature
        const signatureFileName = `signature_${Date.now()}.png`;
        const signaturePath = path.join(uploadsDir, signatureFileName);
        const base64Data = signature.replace(/^data:image\/png;base64,/, '');
        
        await fs.writeFile(signaturePath, base64Data, 'base64');

        // Create claim record
        const claimResult = await client.query(
            `INSERT INTO claim_records 
            (item_id, claimer_name, claim_date, contact_number, signature_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [itemId, claimer_name, claim_date, contact_number, `/uploads/${signatureFileName}`]
        );

        // Update found item status
        await client.query(
            'UPDATE found_items SET is_claimed = true WHERE id = $1',
            [itemId]
        );

        await client.query('COMMIT');
        
        console.log('Claim created successfully:', claimResult.rows[0]);
        res.json(claimResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating claim:', err);
        res.status(400).json({ 
            error: err.message,
            details: 'Please ensure all required fields are provided'
        });
    } finally {
        client.release();
    }
};

exports.getClaimByItemId = async (req, res) => {
    try {
        const { itemId } = req.params;
        const result = await pool.query(
            'SELECT * FROM claim_records WHERE item_id = $1',
            [itemId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching claim:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllClaims = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT cr.*, fi.item_name 
            FROM claim_records cr
            JOIN found_items fi ON cr.item_id = fi.id
            ORDER BY cr.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching all claims:', err);
        res.status(500).json({ error: err.message });
    }
};