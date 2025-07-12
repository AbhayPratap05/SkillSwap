const asyncHandler = require('express-async-handler');
const Swap = require('../models/swapModel');
const User = require('../models/userModel');

// @desc    Create new swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = asyncHandler(async (req, res) => {
  const { recipientId, skillOffered, skillWanted, message } = req.body;

  if (!recipientId || !skillOffered || !skillWanted) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  const swap = await Swap.create({
    requestor: req.user.id,
    recipient: recipientId,
    skillOffered,
    skillWanted,
    message,
  });

  res.status(201).json(swap);
});

// @desc    Get user's swap requests
// @route   GET /api/swaps
// @access  Private
const getSwapRequests = asyncHandler(async (req, res) => {
  const swaps = await Swap.find({
    $or: [{ requestor: req.user.id }, { recipient: req.user.id }],
  })
    .populate('requestor', 'name profilePhoto')
    .populate('recipient', 'name profilePhoto')
    .sort('-createdAt');

  res.json(swaps);
});

// @desc    Update swap request status
// @route   PUT /api/swaps/:id/status
// @access  Private
const updateSwapStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const swap = await Swap.findById(req.params.id);

  if (!swap) {
    res.status(404);
    throw new Error('Swap request not found');
  }

  // Check if user is authorized to update status
  if (swap.recipient.toString() !== req.user.id && swap.requestor.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Only recipient can accept/reject
  if ((status === 'accepted' || status === 'rejected') && swap.recipient.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Only the recipient can accept or reject requests');
  }

  // Only requestor can cancel
  if (status === 'cancelled' && swap.requestor.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Only the requestor can cancel requests');
  }

  swap.status = status;
  await swap.save();

  res.json(swap);
});

// @desc    Add feedback to swap
// @route   POST /api/swaps/:id/feedback
// @access  Private
const addFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const swap = await Swap.findById(req.params.id);

  if (!swap) {
    res.status(404);
    throw new Error('Swap request not found');
  }

  if (swap.status !== 'accepted') {
    res.status(400);
    throw new Error('Can only add feedback to accepted swaps');
  }

  const isRequestor = swap.requestor.toString() === req.user.id;
  const isRecipient = swap.recipient.toString() === req.user.id;

  if (!isRequestor && !isRecipient) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Update swap feedback
  if (isRequestor) {
    swap.feedback.fromRequestor = { rating, comment };
  } else {
    swap.feedback.fromRecipient = { rating, comment };
  }

  await swap.save();

  // Update user ratings
  const targetUser = isRequestor ? swap.recipient : swap.requestor;
  const user = await User.findById(targetUser);
  
  const newTotalRatings = user.totalRatings + 1;
  const newRating = ((user.rating * user.totalRatings) + rating) / newTotalRatings;
  
  await User.findByIdAndUpdate(targetUser, {
    rating: newRating,
    totalRatings: newTotalRatings,
  });

  res.json(swap);
});

// @desc    Delete swap request
// @route   DELETE /api/swaps/:id
// @access  Private
const deleteSwapRequest = asyncHandler(async (req, res) => {
  const swap = await Swap.findById(req.params.id);

  if (!swap) {
    res.status(404);
    throw new Error('Swap request not found');
  }

  if (swap.requestor.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (swap.status !== 'pending') {
    res.status(400);
    throw new Error('Can only delete pending swap requests');
  }

  await swap.deleteOne();

  res.json({ id: req.params.id });
});

module.exports = {
  createSwapRequest,
  getSwapRequests,
  updateSwapStatus,
  addFeedback,
  deleteSwapRequest,
}; 