import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signup, login } from '../../services/authService';
import '../../styles/AuthForm.css';
import DemoCredentials from '../DemoCredentials';
const VolunteerAuth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    skills: [],
    availability: '',
    interests: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Add this useEffect to handle mode changes
  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  const skillsOptions = [
    'Teaching', 'Healthcare', 'Technology', 'Marketing', 
    'Fundraising', 'Event Management', 'Social Media', 'Graphic Design',
    'Writing', 'Translation', 'Legal', 'Finance', 'Photography', 'Videography'
  ];

  const availabilityOptions = [
    'Weekdays', 'Weekends', 'Evenings', 'Flexible'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'skills') {
      const updatedSkills = checked 
        ? [...formData.skills, value]
        : formData.skills.filter(skill => skill !== value);
      
      setFormData(prev => ({
        ...prev,
        skills: updatedSkills
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
    
    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!isLogin && formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }
    
    if (!isLogin && !formData.availability) {
      newErrors.availability = 'Please select your availability';
    }
    
    if (!isLogin && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      let response;
      
      if (isLogin) {
        // Login
        console.log('Attempting volunteer login with:', { email: formData.email });
        response = await login({
          email: formData.email,
          password: formData.password,
          role: 'volunteer'
        });
        console.log('Volunteer login response:', response);
        
        // Store token
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', 'volunteer');
        
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/volunteer/dashboard'), 1500);
      } else {
        // Signup
        const signupData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          skills: formData.skills,
          availability: formData.availability,
          interests: formData.interests,
          preferredVolunteerType: 'Both',
          newsletter: true,
          role: 'volunteer'
        };
        
        console.log('Attempting volunteer signup with:', signupData);
        response = await signup(signupData);
        console.log('Volunteer signup response:', response);
        
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/auth/volunteer?mode=login');
        }, 1500);
      }
    } catch (error) {
      console.error('Volunteer auth error:', error);
      setErrors({ general: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-page">
      {/* Ultra-advanced animated background */}
      <div className="form-bg-wrapper">
        <div className="form-gradient-mesh"></div>
        <div className="form-flow-field">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flow-particle" style={{ '--flow-delay': `${i * 0.5}s` }}></div>
          ))}
        </div>
        <div className="form-glow-orbs">
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-2"></div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="form-card" data-aos="zoom-in" data-aos-duration="800">
          {/* Form Header */}
          <div className="form-header">
            <div className="form-icon-wrapper" data-aos="rotate-in" data-aos-delay="200">
              <div className="form-icon-bg"></div>
              <div className="form-icon">🤝</div>
              <div className="icon-ripple"></div>
            </div>
            
            <h1 className="form-title" data-aos="fade-up" data-aos-delay="100">
              {isLogin ? 'Welcome Back' : 'Join as'} 
              <span className="form-title-gradient"> Volunteer</span>
            </h1>
            
            <p className="form-subtitle" data-aos="fade-up" data-aos-delay="200">
              {isLogin 
                ? 'Login to access your volunteer dashboard'
                : 'Start making a difference in communities worldwide'}
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
            {!isLogin && (
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
            )}

            <div className="form-group" data-aos="fade-up" data-aos-delay="350">
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

            {!isLogin && (
              <>
                <div className="form-group" data-aos="fade-up" data-aos-delay="450">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <div className="form-row" data-aos="fade-up" data-aos-delay="500">
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

                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <div className="input-wrapper">
                      <select
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className={errors.availability ? 'error' : ''}
                      >
                        <option value="">Select availability</option>
                        {availabilityOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </span>
                    </div>
                    {errors.availability && <span className="error-message">{errors.availability}</span>}
                  </div>
                </div>

                <div className="form-group" data-aos="fade-up" data-aos-delay="550">
                  <label>Skills (Select all that apply)</label>
                  <div className="checkbox-grid">
                    {skillsOptions.map(skill => (
                      <label key={skill} className="checkbox-label">
                        <input
                          type="checkbox"
                          name="skills"
                          value={skill}
                          checked={formData.skills.includes(skill)}
                          onChange={handleChange}
                        />
                        <span className="checkbox-custom"></span>
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                  {errors.skills && <span className="error-message">{errors.skills}</span>}
                </div>

                <div className="form-group" data-aos="fade-up" data-aos-delay="600">
                  <label htmlFor="interests">Areas of Interest (Optional)</label>
                  <div className="input-wrapper">
                    <textarea
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="Tell us about your interests and what causes you're passionate about..."
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div className="form-options" data-aos="fade-up" data-aos-delay="450">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
              </div>
            )}

            {!isLogin && (
              <div className="form-options" data-aos="fade-up" data-aos-delay="650">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className={errors.agreeTerms ? 'error' : ''}
                  />
                  <span className="checkbox-custom"></span>
                  <span>I agree to the Terms and Conditions and Privacy Policy</span>
                </label>
                {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
              </div>
            )}

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              data-aos="zoom-in"
              data-aos-delay="700"
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span className="button-text">Processing...</span>
                </>
              ) : (
                <>
                  <span className="button-text">{isLogin ? 'Login' : 'Start Volunteering'}</span>
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
          <div className="form-footer" data-aos="fade-up" data-aos-delay="800">
            <p className="switch-mode">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button 
                type="button"
                className="switch-link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setSuccessMessage('');
                }}
              >
                {isLogin ? 'Sign up' : 'Login'}
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
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-dots"></div>
        </div>
      </div>
      
      
    </div>
  );
};


export default VolunteerAuth;
