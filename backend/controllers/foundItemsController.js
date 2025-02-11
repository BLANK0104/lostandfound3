const pool = require('../config/db'); 

exports.createFoundItem = async (req, res) => {
    try {
        const { item_name, description, found_date, location, amount, sub_category } = req.body;
        
        if (!item_name || !found_date || !location) {
            return res.status(400).json({ 
                error: 'Item name, found date, and location are required' 
            });
        }

        // Initialize parsedAmount
        let parsedAmount = null;
        
        // Handle amount for cash items
        if (item_name.toLowerCase() === 'cash') {
            console.log('Processing cash item...');
            
            // Strict amount validation
            if (amount === undefined || amount === '') {
                return res.status(400).json({ 
                    error: 'Amount is required for cash items' 
                });
            }
            
            // Convert to number and validate
            parsedAmount = Number(amount);
            console.log('Parsed amount:', parsedAmount);
            
            if (isNaN(parsedAmount)) {
                return res.status(400).json({ 
                    error: 'Amount must be a valid number' 
                });
            }
        }

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        // Modified query to include sub_category
        const query = `
            INSERT INTO found_items 
            (item_name, description, found_date, location, amount, image_url, sub_category)
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            item_name,
            description || null,
            found_date,
            location,
            parsedAmount, // Should be a number or null
            image_url,
            sub_category || null
        ];

        // Log final values before database insertion
        console.log('Final values for database:', {
            item_name,
            description: description || null,
            found_date,
            location,
            parsedAmount,
            image_url,
            sub_category: sub_category || null
        });

        const result = await pool.query(query, values);
        console.log('Database response:', result.rows[0]);
        console.log('=== DEBUG END ===');

        res.json(result.rows[0]);
    } catch (err) {
        console.error('=== ERROR ===');
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        res.status(500).json({ error: err.message });
    }
};