const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Swap = require('../models/swapModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
});

// @desc    Ban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot ban an admin user');
  }

  user.isBanned = true;
  await user.save();

  res.json({ message: 'User banned successfully' });
});

// @desc    Unban a user
// @route   PUT /api/admin/users/:id/unban
// @access  Private/Admin
const unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isBanned = false;
  await user.save();

  res.json({ message: 'User unbanned successfully' });
});

// @desc    Get all swaps
// @route   GET /api/admin/swaps
// @access  Private/Admin
const getSwaps = asyncHandler(async (req, res) => {
  const swaps = await Swap.find()
    .populate('requestor', 'name email')
    .populate('recipient', 'name email')
    .sort('-createdAt');
  res.json(swaps);
});

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const bannedUsers = await User.countDocuments({ isBanned: true });
  const totalSwaps = await Swap.countDocuments();
  
  const swapStats = await Swap.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const averageRating = await User.aggregate([
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const topSkills = await User.aggregate([
    { $unwind: '$skillsOffered' },
    {
      $group: {
        _id: '$skillsOffered',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    users: {
      total: totalUsers,
      banned: bannedUsers,
    },
    swaps: {
      total: totalSwaps,
      byStatus: swapStats,
    },
    platform: {
      averageRating: averageRating[0]?.avgRating || 0,
      topSkills,
    }
  });
});

// @desc    Send platform-wide message
// @route   POST /api/admin/message
// @access  Private/Admin
const sendMessage = asyncHandler(async (req, res) => {
  const { title, message, type } = req.body;

  if (!title || !message || !type) {
    res.status(400);
    throw new Error('Please provide title, message and type');
  }

  // In a real application, this would integrate with a notification system
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Message sent successfully',
    notification: {
      title,
      message,
      type,
      sentAt: new Date(),
      sentBy: req.user.id
    }
  });
});

module.exports = {
  getUsers,
  banUser,
  unbanUser,
  getSwaps,
  getStats,
  sendMessage,
}; 