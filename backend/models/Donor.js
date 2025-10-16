const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  donationType: {
    type: String,
    enum: ['Individual Donor', 'Corporate Donor', 'Foundation', 'Family Trust', 'Anonymous Benefactor']
  },
  preferredCauses: [{
    type: String
  }],
  donationFrequency: {
    type: String,
    enum: ['One-time', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually']
  },
  budgetRange: {
    type: String,
    enum: ['Under $100', '$100 - $500', '$500 - $1,000', '$1,000 - $5,000', '$5,000 - $10,000', 'Above $10,000']
  },
  howDidYouHear: String,
  newsletter: {
    type: Boolean,
    default: false
  },
  anonymousDonation: {
    type: Boolean,
    default: false
  },
  taxReceipt: {
    type: Boolean,
    default: true
  },
  totalDonated: {
    type: Number,
    default: 0
  },
  donationHistory: [{
    amount: Number,
    cause: String,
    date: {
      type: Date,
      default: Date.now
    },
    ngoId: {
      type: mongoose.Schema.ObjectId,
      ref: 'NGO'
    }
  }],
  role: {
    type: String,
    default: 'donor'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
donorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
donorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Donor', donorSchema);
