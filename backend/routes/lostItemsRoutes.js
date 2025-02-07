const express = require('express');
const { createLostItem, getLostItems, markLostItemAsFound } = require('../controllers/lostItemsController');

const router = express.Router();

router.post('/', createLostItem);
router.get('/', getLostItems);
router.put('/:id/mark-found', markLostItemAsFound);

module.exports = router;
