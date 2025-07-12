const express = require('express');
const router = express.Router();
const {
  createSwapRequest,
  getSwapRequests,
  updateSwapStatus,
  addFeedback,
  deleteSwapRequest,
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSwapRequest);
router.get('/', protect, getSwapRequests);
router.put('/:id/status', protect, updateSwapStatus);
router.post('/:id/feedback', protect, addFeedback);
router.delete('/:id', protect, deleteSwapRequest);

module.exports = router; 