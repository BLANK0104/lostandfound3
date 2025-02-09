const express = require('express');
const corsConfig = require('./middleware/corsConfig');
const errorHandler = require('./middleware/errorHandler');
const lostItemsRoutes = require('./routes/lostItemsRoutes');
const foundItemsRoutes = require('./routes/foundItemsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pool = require('./db');
const { initializeDatabase } = require('./db/init');

const app = express();

const startServer = async () => {
    try {
        // Initialize database and create tables
        await initializeDatabase();
        console.log('Database initialized successfully');

        // Test database connection
        await pool.connect();
        console.log('Connected to database');

        app.use(corsConfig);
        app.use(express.json());
        app.use('/uploads', express.static('uploads'));

        // Routes
        app.use('/auth', authRoutes);
        app.use('/users', userRoutes);
        app.use('/lost-items', lostItemsRoutes);
        app.use('/found-items', foundItemsRoutes);
        app.use('/generate-report', reportRoutes);

        app.use(errorHandler);

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();