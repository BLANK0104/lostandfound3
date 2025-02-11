const pool = require('../db');

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS lost_items (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                item_name VARCHAR(100) NOT NULL,
                person_name VARCHAR(100) NOT NULL,
                lost_date TIMESTAMP NOT NULL,
                location VARCHAR(200),
                contact_number VARCHAR(20),
                email VARCHAR(100),
                description TEXT,
                amount NUMERIC,
                status VARCHAR(20) DEFAULT 'lost',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS found_items (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                item_name VARCHAR(100) NOT NULL,
                found_date TIMESTAMP NOT NULL,
                location VARCHAR(200),
                description TEXT,
                amount NUMERIC,
                image_url VARCHAR(255),
                status VARCHAR(20) DEFAULT 'found',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS claim_records (
                id SERIAL PRIMARY KEY,
                item_id INTEGER REFERENCES found_items(id),
                claimer_name VARCHAR(100) NOT NULL,
                claim_date TIMESTAMP NOT NULL,
                contact_number VARCHAR(20) NOT NULL,
                signature_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error.message);
        throw error;
    }
};

module.exports = { initializeDatabase };