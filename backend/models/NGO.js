const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ngoSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: [true, 'Please add organization name'],
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
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: String,
  website: String,
  foundedYear: Number,
  missionStatement: String,
  organizationType: {
    type: String,
    enum: ['Charity', 'Non-Profit', 'Foundation', 'Trust', 'Religious Organization', 'Social Enterprise']
  },
  focusAreas: [{
    type: String
  }],
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  documents: {
    registrationCertificate: String,
    taxExemption: String,
    annualReport: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    swiftCode: String
  },
  operationalAreas: [{
    type: String
  }],
  teamSize: String,
  beneficiariesServed: Number,
  totalFundsReceived: {
    type: Number,
    default: 0
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'ngo'
  }
}, {
  timestamps: true
});

// Encrypt password before saving
ngoSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
ngoSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('NGO', ngoSchema);
