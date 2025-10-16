const NGO = require('../models/NGO');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register NGO
// @route   POST /api/auth/ngo/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const {
      organizationName,
      email,
      password,
      registrationNumber,
      phoneNumber,
      website,
      foundedYear,
      missionStatement,
      organizationType,
      focusAreas,
      address,
      socialMedia,
      operationalAreas,
      teamSize,
      beneficiariesServed,
      newsletter
    } = req.body;

    // Check if NGO exists
    const ngoExists = await NGO.findOne({ email });
    if (ngoExists) {
      return res.status(400).json({
        success: false,
        message: 'NGO already exists with this email'
      });
    }

    // Check if registration number exists
    const regNumberExists = await NGO.findOne({ registrationNumber });
    if (regNumberExists) {
      return res.status(400).json({
        success: false,
        message: 'NGO already exists with this registration number'
      });
    }

    // Create NGO
    const ngo = await NGO.create({
      organizationName,
      email,
      password,
      registrationNumber,
      phoneNumber,
      website,
      foundedYear,
      missionStatement,
      organizationType,
      focusAreas,
      address,
      socialMedia,
      operationalAreas,
      teamSize,
      beneficiariesServed,
      newsletter
    });

    // Create token
    const token = generateToken(ngo._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: ngo._id,
        organizationName: ngo.organizationName,
        email: ngo.email,
        role: ngo.role
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

// @desc    Login NGO
// @route   POST /api/auth/ngo/login
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

    // Check for NGO
    const ngo = await NGO.findOne({ email }).select('+password');

    if (!ngo) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await ngo.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = generateToken(ngo._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: ngo._id,
        organizationName: ngo.organizationName,
        email: ngo.email,
        role: ngo.role
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

// @desc    Get NGO profile
// @route   GET /api/auth/ngo/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: ngo
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
