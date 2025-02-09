const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// Register new user (no authentication required)
router.post('/register', registerUser);

module.exports = router;