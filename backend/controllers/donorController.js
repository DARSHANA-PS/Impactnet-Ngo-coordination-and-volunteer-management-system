const Donor = require('../models/Donor');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register donor
// @route   POST /api/auth/donor/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      donationType,
      preferredCauses,
      donationFrequency,
      budgetRange,
      howDidYouHear,
      newsletter,
      anonymousDonation,
      taxReceipt
    } = req.body;

    // Check if donor exists
    const donorExists = await Donor.findOne({ email });
    if (donorExists) {
      return res.status(400).json({
        success: false,
        message: 'Donor already exists'
      });
    }

    // Create donor
    const donor = await Donor.create({
      fullName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      donationType,
      preferredCauses,
      donationFrequency,
      budgetRange,
      howDidYouHear,
      newsletter,
      anonymousDonation,
      taxReceipt
    });

    // Create token
    const token = generateToken(donor._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        role: donor.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Login donor
// @route   POST /api/auth/donor/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for donor
    const donor = await Donor.findOne({ email }).select('+password');

    if (!donor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await donor.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = generateToken(donor._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: donor._id,
        fullName: donor.fullName,
        email: donor.email,
        role: donor.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get donor profile
// @route   GET /api/auth/donor/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const donor = await Donor.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe
};
