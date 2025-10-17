import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signup, login } from '../../services/authService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../styles/AuthForm.css';
import DemoCredentials from '../DemoCredentials';

const DonorAuth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    
    // Donation Preferences
    donationType: '',
    preferredCauses: [],
    donationFrequency: '',
    budgetRange: '',
    
    // Additional Info
    howDidYouHear: '',
    newsletter: false,
    anonymousDonation: false,
    taxReceipt: true,
    agreeTerms: false,
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  // Handle mode changes
  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  const donationTypes = [
    'Individual Donor',
    'Corporate Donor',
    'Foundation',
    'Family Trust',
    'Anonymous Benefactor'
  ];

  const causes = [
    'Education', 'Healthcare', 'Environment', 'Poverty Alleviation',
    'Disaster Relief', 'Animal Welfare', 'Arts & Culture', 'Human Rights',
    'Child Welfare', 'Elderly Care', 'Mental Health', 'Technology for Good'
  ];

  const donationFrequencies = [
    'One-time', 'Monthly', 'Quarterly', 'Bi-annually', 'Annually'
  ];

  const budgetRanges = [
    'Under ₹5,000', '₹5,000 - ₹25,000', '₹25,000 - ₹50,000', 
    '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹5,00,000', 'Above ₹5,00,000'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'preferredCauses') {
      const updatedCauses = checked 
        ? [...formData.preferredCauses, value]
        : formData.preferredCauses.filter(cause => cause !== value);
      
      setFormData(prev => ({
        ...prev,
        preferredCauses: updatedCauses
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.donationType) {
        newErrors.donationType = 'Please select donor type';
      }
      
      if (formData.preferredCauses.length === 0) {
        newErrors.preferredCauses = 'Select at least one cause';
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms';
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const newErrors = {};
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      let response;
      
      if (isLogin) {
        // Login
        console.log('Attempting donor login with:', { email: formData.email });
        response = await login({
          email: formData.email,
          password: formData.password,
          role: 'donor'
        });
        console.log('Donor login response:', response);
        
        // Store token
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', 'donor');
        
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/donor/dashboard'), 1500);
      } else {
        // Signup
        const signupData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          donationType: formData.donationType,
          preferredCauses: formData.preferredCauses,
          donationFrequency: formData.donationFrequency,
          budgetRange: formData.budgetRange,
          howHeardAboutUs: formData.howDidYouHear,
          newsletter: formData.newsletter,
          anonymousDonation: formData.anonymousDonation,
          taxReceipt: formData.taxReceipt,
          role: 'donor'
        };
        
        console.log('Attempting donor signup with:', signupData);
        response = await signup(signupData);
        console.log('Donor signup response:', response);
        
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/auth/donor?mode=login');
        }, 1500);
      }
    } catch (error) {
      console.error('Donor auth error:', error);
      setErrors({ general: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-page donor-auth">
      {/* Ultra-advanced animated background */}
      <div className="form-bg-wrapper">
        <div className="form-gradient-mesh donor-gradient"></div>
        <div className="form-flow-field">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="flow-particle donor-particle" 
              style={{ '--flow-delay': `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
        <div className="form-glow-orbs">
          <div className="glow-orb glow-orb-1 donor-glow"></div>
          <div className="glow-orb glow-orb-2 donor-glow"></div>
          <div className="glow-orb glow-orb-3 donor-glow"></div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="form-card donor-card" data-aos="zoom-in" data-aos-duration="800">
          {/* Form Header */}
          <div className="form-header">
            <div className="form-icon-wrapper" data-aos="rotate-in" data-aos-delay="200">
              <div className="form-icon-bg donor-icon-bg"></div>
              <div className="form-icon">💎</div>
              <div className="icon-ripple donor-ripple"></div>
            </div>
            
            <h1 className="form-title" data-aos="fade-up" data-aos-delay="100">
              {isLogin ? 'Donor' : 'Become a'} 
              <span className="form-title-gradient donor-gradient-text"> {isLogin ? 'Login' : 'Changemaker'}</span>
            </h1>
            
            <p className="form-subtitle" data-aos="fade-up" data-aos-delay="200">
              {isLogin 
                ? 'Access your donation dashboard'
                : 'Support causes that matter to you'}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="success-banner" data-aos="fade-down">
              <span className="success-icon">✨</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="error-banner" data-aos="shake">
              <span className="error-icon">⚠️</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {isLogin ? (
              // Login Form
              <>
                <div className="form-group" data-aos="fade-up" data-aos-delay="300">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={errors.email ? 'error' : ''}
                    />
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </span>
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group" data-aos="fade-up" data-aos-delay="400">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={errors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-options" data-aos="fade-up" data-aos-delay="450">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span>Remember me</span>
                  </label>
                  <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
                </div>
              </>
            ) : (
              // Signup Form
              <>
                {/* Personal Information */}
                <div className="form-section">
                  <h3 className="form-section-title" data-aos="fade-up" data-aos-delay="250">
                    Personal Information
                  </h3>

                  <div className="form-group" data-aos="fade-up" data-aos-delay="300">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={errors.fullName ? 'error' : ''}
                      />
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </span>
                    </div>
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-row" data-aos="fade-up" data-aos-delay="350">
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className={errors.email ? 'error' : ''}
                        />
                        <span className="input-icon">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="input-wrapper">
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Your contact number"
                        />
                        <span className="input-icon">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09501 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.89402 7.65088C9.81437 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1856 16.3491 14.106C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-row" data-aos="fade-up" data-aos-delay="400">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create password"
                          className={errors.password ? 'error' : ''}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          className={errors.confirmPassword ? 'error' : ''}
                        />
                      </div>
                      {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                  </div>

                  <div className="form-group" data-aos="fade-up" data-aos-delay="425">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <div className="input-wrapper">
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Donation Preferences */}
                <div className="form-section">
                  <h3 className="form-section-title" data-aos="fade-up" data-aos-delay="450">
                    Donation Preferences
                  </h3>

                  <div className="form-row" data-aos="fade-up" data-aos-delay="500">
                    <div className="form-group">
                      <label htmlFor="donationType">Donor Type</label>
                      <div className="input-wrapper">
                        <select
                          id="donationType"
                          name="donationType"
                          value={formData.donationType}
                          onChange={handleChange}
                          className={errors.donationType ? 'error' : ''}
                        >
                          <option value="">Select donor type</option>
                          {donationTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <span className="input-icon">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                      {errors.donationType && <span className="error-message">{errors.donationType}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="donationFrequency">Donation Frequency</label>
                      <div className="input-wrapper">
                        <select
                          id="donationFrequency"
                          name="donationFrequency"
                          value={formData.donationFrequency}
                          onChange={handleChange}
                        >
                          <option value="">Select frequency</option>
                          {donationFrequencies.map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                          ))}
                        </select>
                        <span className="input-icon">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-row" data-aos="fade-up" data-aos-delay="550">
                    <div className="form-group">
                      <label htmlFor="budgetRange">Donation Budget Range</label>
                      <div className="input-wrapper">
                        <select
                          id="budgetRange"
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleChange}
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map(range => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </select>
                        <span className="input-icon">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="howDidYouHear">How did you hear about us?</label>
                      <div className="input-wrapper">
                        <select
                          id="howDidYouHear"
                          name="howDidYouHear"
                          value={formData.howDidYouHear}
                          onChange={handleChange}
                        >
                          <option value="">Select source</option>
                          <option value="social-media">Social Media</option>
                          <option value="friend-referral">Friend Referral</option>
                          <option value="google-search">Google Search</option>
                          <option value="news-article">News Article</option>
                          <option value="event">Event</option>
                          <option value="other">Other</option>
                        </select>
                        <span className="input-icon">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M13 10H20M20 10V3M20 10L13 17L9 13L3 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" data-aos="fade-up" data-aos-delay="600">
                    <label>Preferred Causes</label>
                    <div className="checkbox-grid donor-causes">
                      {causes.map((cause, index) => (
                        <label 
                          key={cause} 
                          className="checkbox-label cause-label"
                          data-aos="fade-right"
                          data-aos-delay={600 + (index * 20)}
                        >
                          <input
                            type="checkbox"
                            name="preferredCauses"
                            value={cause}
                            checked={formData.preferredCauses.includes(cause)}
                            onChange={handleChange}
                          />
                          <span className="checkbox-custom"></span>
                          <span>{cause}</span>
                        </label>
                      ))}
                    </div>
                    {errors.preferredCauses && <span className="error-message">{errors.preferredCauses}</span>}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="form-section">
                  <h3 className="form-section-title" data-aos="fade-up" data-aos-delay="650">
                    Additional Options
                  </h3>

                  <div className="form-options-grid" data-aos="fade-up" data-aos-delay="700">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleChange}
                      />
                      <span className="checkbox-custom"></span>
                      <span>Subscribe to impact newsletter</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="anonymousDonation"
                        checked={formData.anonymousDonation}
                        onChange={handleChange}
                      />
                      <span className="checkbox-custom"></span>
                      <span>Prefer anonymous donations</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="taxReceipt"
                        checked={formData.taxReceipt}
                        onChange={handleChange}
                      />
                      <span className="checkbox-custom"></span>
                      <span>Require tax receipts</span>
                    </label>
                  </div>

                  <div className="form-options" data-aos="fade-up" data-aos-delay="750">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                      />
                      <span className="checkbox-custom"></span>
                      <span>I agree to the Terms and Conditions and Privacy Policy</span>
                    </label>
                    {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              className={`submit-button donor-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              data-aos="zoom-in"
              data-aos-delay="800"
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span className="button-text">Processing...</span>
                </>
              ) : (
                <>
                  <span className="button-text">{isLogin ? 'Login' : 'Start Making Impact'}</span>
                  <span className="button-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                </>
              )}
              <div className="button-glow"></div>
            </button>
          </form>

          {/* Form Footer */}
          <div className="form-footer" data-aos="fade-up" data-aos-delay="900">
            <p className="switch-mode">
              {isLogin ? "New to ImpactNet?" : 'Already have an account?'}
              <button 
                type="button"
                className="switch-link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setSuccessMessage('');
                  // Update URL
                  const newMode = isLogin ? 'signup' : 'login';
                  window.history.pushState({}, '', `/auth/donor?mode=${newMode}`);
                }}
              >
                {isLogin ? 'Create donor account' : 'Login'}
              </button>
            </p>
            
            <button 
              className="back-button"
              onClick={() => navigate(isLogin ? '/login' : '/signup')}
            >
              ← Back to options
            </button>
          </div>
        </div>

        // ... existing code ...

        {/* Decorative Elements */}
        <div className="form-decoration">
          <div className="decoration-circle decoration-circle-1 donor-decoration"></div>
          <div className="decoration-circle decoration-circle-2 donor-decoration"></div>
          <div className="decoration-circle decoration-circle-3 donor-decoration"></div>
          <div className="decoration-dots donor-dots"></div>
        </div>
      </div>
      
      
    </div>
  );
};


export default DonorAuth;
