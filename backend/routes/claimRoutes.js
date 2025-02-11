const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

// Ensure all routes have corresponding controller methods
router.post('/:itemId', claimController.createClaim);
router.get('/item/:itemId', claimController.getClaimByItemId);
router.get('/', claimController.getAllClaims);

module.exports = router;