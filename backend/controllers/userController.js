const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    skillsOffered: [],
    skillsWanted: [],
    availability: 'Not specified',
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      availability: user.availability,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      availability: user.availability,
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  console.log('updateProfile req.body:', req.body);
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name !== undefined ? req.body.name : user.name,
      location: req.body.location !== undefined ? req.body.location : user.location,
      profilePhoto: req.body.profilePhoto !== undefined ? req.body.profilePhoto : user.profilePhoto,
      skillsOffered: req.body.skillsOffered !== undefined ? req.body.skillsOffered : user.skillsOffered,
      skillsWanted: req.body.skillsWanted !== undefined ? req.body.skillsWanted : user.skillsWanted,
      availability: req.body.availability !== undefined ? req.body.availability : user.availability,
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic : user.isPublic,
    },
    { new: true }
  ).select('-password');

  res.json(updatedUser);
});

// @desc    Search users by skills
// @route   GET /api/users/search
// @access  Public
const searchUsers = asyncHandler(async (req, res) => {
  const { skill, type } = req.query;
  let query = { isPublic: true, isBanned: false };

  if (skill) {
    if (type === 'offered') {
      query.skillsOffered = { $regex: skill, $options: 'i' };
    } else if (type === 'wanted') {
      query.skillsWanted = { $regex: skill, $options: 'i' };
    } else {
      query.$or = [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } },
      ];
    }
  }

  const users = await User.find(query).select('-password');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.isPublic) {
    res.status(403);
    throw new Error('This profile is private');
  }

  res.json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  searchUsers,
  getUserById,
}; 