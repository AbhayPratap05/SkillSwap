const express = require('express');
const router = express.Router();
const {
  getUsers,
  banUser,
  unbanUser,
  getSwaps,
  getStats,
  sendMessage,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.get('/swaps', getSwaps);
router.get('/stats', getStats);
router.post('/message', sendMessage);

module.exports = router; 