// src/components/auth/AdminAuth.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../styles/AuthForm.css';

const AdminAuth = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fixed admin credentials
  const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'admin@impactnet.org';
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin@2024secure';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate API call delay
    setTimeout(() => {
      // Check credentials
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        // Store admin session
        localStorage.setItem('adminToken', 'admin-token-' + Date.now());
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        
        if (formData.rememberMe) {
          localStorage.setItem('adminEmail', formData.email);
        }
        
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setErrors({ general: 'Invalid credentials. Please try again.' });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="auth-form-page admin-auth">
      {/* Background */}
      <div className="form-bg-wrapper">
        <div className="form-gradient-mesh admin-gradient"></div>
        <div className="form-flow-field">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="flow-particle admin-particle" 
              style={{ '--flow-delay': `${i * 0.5}s` }}
            ></div>
          ))}
        </div>
        <div className="form-glow-orbs">
          <div className="glow-orb glow-orb-1 admin-glow"></div>
          <div className="glow-orb glow-orb-2 admin-glow"></div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="form-card admin-card" data-aos="zoom-in" data-aos-duration="800">
          {/* Header */}
          <div className="form-header">
            <div className="form-icon-wrapper" data-aos="rotate-in" data-aos-delay="200">
              <div className="form-icon-bg admin-icon-bg"></div>
              <div className="form-icon">👨‍💼</div>
              <div className="icon-ripple admin-ripple"></div>
            </div>
            
            <h1 className="form-title" data-aos="fade-up" data-aos-delay="100">
              Admin <span className="form-title-gradient admin-gradient-text">Portal</span>
            </h1>
            
            <p className="form-subtitle" data-aos="fade-up" data-aos-delay="200">
              Manage NGO verifications and platform administration
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
            <div className="form-group" data-aos="fade-up" data-aos-delay="300">
              <label htmlFor="email">Admin Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  className={errors.email ? 'error' : ''}
                  autoComplete="email"
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
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
                  autoComplete="current-password"
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
            </div>

            <button 
              type="submit" 
              className={`submit-button admin-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              data-aos="zoom-in"
              data-aos-delay="500"
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span className="button-text">Verifying...</span>
                </>
              ) : (
                <>
                  <span className="button-text">Login to Admin Panel</span>
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

          {/* Footer */}
          <div className="form-footer" data-aos="fade-up" data-aos-delay="600">
            <button 
              className="back-button"
              onClick={() => navigate('/login')}
            >
              ← Back to login options
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="form-decoration">
          <div className="decoration-circle decoration-circle-1 admin-decoration"></div>
          <div className="decoration-circle decoration-circle-2 admin-decoration"></div>
          <div className="decoration-dots admin-dots"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
