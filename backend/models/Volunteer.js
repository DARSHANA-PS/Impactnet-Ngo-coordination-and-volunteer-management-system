const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const volunteerSchema = new mongoose.Schema({
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
  phoneNumber: String,
  dateOfBirth: Date,
  occupation: String,
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Evenings', 'Flexible', 'Full-time']
  },
  preferredVolunteerType: {
    type: String,
    enum: ['On-site', 'Remote', 'Both']
  },
  experience: String,
  languages: [{
    type: String
  }],
  address: {
    city: String,
    state: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  hasVehicle: Boolean,
  willingToTravel: Boolean,
  criminalRecord: Boolean,
  healthConditions: String,
  volunteerHours: {
    type: Number,
    default: 0
  },
  volunteerHistory: [{
    ngoId: {
      type: mongoose.Schema.ObjectId,
      ref: 'NGO'
    },
    project: String,
    hours: Number,
    date: {
      type: Date,
      default: Date.now
    },
    feedback: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  newsletter: {
    type: Boolean,
    default: false
  },
  backgroundCheck: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'volunteer'
  }
}, {
  timestamps: true
});

// Encrypt password before saving
volunteerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
volunteerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Volunteer', volunteerSchema);
