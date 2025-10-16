const Volunteer = require('../models/Volunteer');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register volunteer
// @route   POST /api/auth/volunteer/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      occupation,
      skills,
      interests,
      availability,
      preferredVolunteerType,
      experience,
      languages,
      address,
      emergencyContact,
      hasVehicle,
      willingToTravel,
      criminalRecord,
      healthConditions,
      newsletter,
      backgroundCheck
    } = req.body;

    // Check if volunteer exists
    const volunteerExists = await Volunteer.findOne({ email });
    if (volunteerExists) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer already exists'
      });
    }

    // Create volunteer
    const volunteer = await Volunteer.create({
      fullName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      occupation,
      skills,
      interests,
      availability,
      preferredVolunteerType,
      experience,
      languages,
      address,
      emergencyContact,
      hasVehicle,
      willingToTravel,
      criminalRecord,
      healthConditions,
      newsletter,
      backgroundCheck
    });

    // Create token
    const token = generateToken(volunteer._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: volunteer._id,
        fullName: volunteer.fullName,
        email: volunteer.email,
        role: volunteer.role
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

// @desc    Login volunteer
// @route   POST /api/auth/volunteer/login
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

    // Check for volunteer
    const volunteer = await Volunteer.findOne({ email }).select('+password');

    if (!volunteer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await volunteer.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = generateToken(volunteer._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: volunteer._id,
        fullName: volunteer.fullName,
        email: volunteer.email,
        role: volunteer.role
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

// @desc    Get volunteer profile
// @route   GET /api/auth/volunteer/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: volunteer
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
