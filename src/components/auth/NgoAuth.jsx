import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signup, login } from '../../services/authService';
import localStorageService from '../../services/localStorageService';
import '../../styles/AuthForm.css';
import DemoCredentials from '../DemoCredentials';

const NgoAuth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    organizationName: '',
    registrationNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Organization Details
    organizationType: '',
    foundedYear: '',
    website: '',
    address: '',
    city: '',
    country: '',
    
    // Step 3: Contact & Mission
    contactPerson: '',
    contactPhone: '',
    missionStatement: '',
    focusAreas: [],
    
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Add this useEffect to handle mode changes
  useEffect(() => {
    setIsLogin(mode === 'login');
    if (mode === 'login') {
      setCurrentStep(1); // Reset to first step when switching to login
    }
  }, [mode]);

  const organizationTypes = [
    'Charity',
    'Non-Profit',
    'Foundation',
    'Trust',
    'Religious Organization',
    'Social Enterprise'
  ];

  const focusAreaOptions = [
    'Education', 'Healthcare', 'Environment', 'Poverty Alleviation',
    'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Women Empowerment',
    'Child Welfare', 'Elderly Care'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'focusAreas') {
      const updatedAreas = checked 
        ? [...formData.focusAreas, value]
        : formData.focusAreas.filter(area => area !== value);
      
      setFormData(prev => ({
        ...prev,
        focusAreas: updatedAreas
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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (!isLogin) {
      if (step === 1) {
        if (!formData.organizationName.trim()) {
          newErrors.organizationName = 'Organization name is required';
        }
        if (!formData.registrationNumber.trim()) {
          newErrors.registrationNumber = 'Registration number is required';
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
      } else if (step === 2) {
        if (!formData.organizationType) {
          newErrors.organizationType = 'Organization type is required';
        }
        if (!formData.foundedYear) {
          newErrors.foundedYear = 'Founded year is required';
        }
        if (!formData.address.trim()) {
          newErrors.address = 'Address is required';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'City is required';
        }
        if (!formData.country.trim()) {
          newErrors.country = 'Country is required';
        }
      } else if (step === 3) {
        if (!formData.contactPerson.trim()) {
          newErrors.contactPerson = 'Contact person is required';
        }
        if (!formData.contactPhone.trim()) {
          newErrors.contactPhone = 'Contact phone is required';
        }
        if (!formData.missionStatement.trim()) {
          newErrors.missionStatement = 'Mission statement is required';
        }
        if (formData.focusAreas.length === 0) {
          newErrors.focusAreas = 'Select at least one focus area';
        }
        if (!formData.agreeTerms) {
          newErrors.agreeTerms = 'You must agree to the terms';
        }
      }
    }
    
    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = validateStep(currentStep);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setCurrentStep(prev => prev + 1);
    setErrors({});
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
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
      const validationErrors = validateStep(currentStep);
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
        // Check if NGO is verified before login
        const verificationStatus = localStorageService.checkNgoVerification(formData.email);
        
        if (verificationStatus.exists) {
          if (verificationStatus.verified === false) {
            setErrors({ 
              general: `Your registration was rejected. Reason: ${verificationStatus.rejectionReason}` 
            });
            setIsLoading(false);
            return;
          } else if (verificationStatus.verified === 'pending' || verificationStatus.verified === undefined) {
            setErrors({ 
              general: 'Your account is awaiting admin approval. Please check back later.' 
            });
            setIsLoading(false);
            return;
          }
        }
        
        // Login
        console.log('Attempting NGO login with:', { email: formData.email });
        response = await login({
          email: formData.email,
          password: formData.password,
          role: 'ngo'
        });
        console.log('NGO login response:', response);
        
        // Store token
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', 'ngo');
        
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/ngo/dashboard'), 1500);
      } else {
        // Signup - Create NGO registration with pending status
        const signupData = {
          organizationName: formData.organizationName,
          registrationNumber: formData.registrationNumber,
          email: formData.email,
          password: formData.password,
          organizationType: formData.organizationType,
          foundedYear: parseInt(formData.foundedYear),
          website: formData.website,
          address: {
            street: formData.address,
            city: formData.city,
            country: formData.country
          },
          city: formData.city,
          country: formData.country,
          phoneNumber: formData.contactPhone,
          contactPerson: formData.contactPerson,
          contactPhone: formData.contactPhone,
          missionStatement: formData.missionStatement,
          focusAreas: formData.focusAreas,
          operationalAreas: [formData.city],
          teamSize: 'Small (1-10)',
          newsletter: true,
          role: 'ngo'
        };
        
        console.log('Attempting NGO signup with:', signupData);
        
        // Create NGO registration with pending verification
        localStorageService.createNgoRegistration(signupData);
        
        setSuccessMessage('NGO registration successful! Your account is pending admin approval. You will be notified once approved.');
        setTimeout(() => {
          navigate('/auth/ngo?mode=login');
        }, 3000);
      }
    } catch (error) {
      console.error('NGO auth error:', error);
      setErrors({ general: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    if (isLogin) return null;
    
    return (
      <div className="step-indicator" data-aos="fade-down">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`step-item ${currentStep >= step ? 'active' : ''}`}>
            <div className="step-circle">
              <span>{step}</span>
            </div>
            <div className="step-label">
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Organization'}
              {step === 3 && 'Contact & Mission'}
            </div>
          </div>
        ))}
        <div className="step-line">
          <div 
            className="step-line-progress" 
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderFormContent = () => {
    if (isLogin) {
      return (
        <>
          <div className="form-group" data-aos="fade-up" data-aos-delay="300">
            <label htmlFor="email">Organization Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter organization email"
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
                onChange={handleChange}
              />
              <span className="checkbox-custom"></span>
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
          </div>
        </>
      );
    }

    // Signup form steps
    if (currentStep === 1) {
      return (
        <>
          <div className="form-group" data-aos="fade-up" data-aos-delay="300">
            <label htmlFor="organizationName">Organization Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Enter organization name"
                className={errors.organizationName ? 'error' : ''}
              />
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M19 21V19C19 17.9391 18.5786 16.9217 18.8284 16.1716C19.0783 15.4214 20 14.9391 20 14V9C20 8.06087 19.5786 7.42143 18.8284 6.67157C18.0783 5.92172 17.0609 5 16 5H8C6.93913 5 5.92172 5.92172 5.17157 6.67157C4.42143 7.42143 4 8.06087 4 9V14C4 14.9391 4.92172 15.4214 5.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 13H15" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 9V17" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </div>
            {errors.organizationName && <span className="error-message">{errors.organizationName}</span>}
          </div>

          <div className="form-group" data-aos="fade-up" data-aos-delay="350">
            <label htmlFor="registrationNumber">Registration Number</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="NGO registration number"
                className={errors.registrationNumber ? 'error' : ''}
              />
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 11H3V21H9V11Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 3H9V11H15V3Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 7H15V21H21V7Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </div>
            {errors.registrationNumber && <span className="error-message">{errors.registrationNumber}</span>}
          </div>

          <div className="form-group" data-aos="fade-up" data-aos-delay="400">
            <label htmlFor="email">Official Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="official@organization.org"
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

          <div className="form-row" data-aos="fade-up" data-aos-delay="450">
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
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <div className="form-row" data-aos="fade-up" data-aos-delay="300">
            <div className="form-group">
              <label htmlFor="organizationType">Organization Type</label>
              <div className="input-wrapper">
                <select
                  id="organizationType"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className={errors.organizationType ? 'error' : ''}
                >
                  <option value="">Select type</option>
                  {organizationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 21H21M5 21V7L12 3L19 7V21M9 9H9.01M15 9H15.01M9 15H15" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
              </div>
              {errors.organizationType && <span className="error-message">{errors.organizationType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="foundedYear">Founded Year</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="foundedYear"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  placeholder="e.g., 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                  className={errors.foundedYear ? 'error' : ''}
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
              </div>
              {errors.foundedYear && <span className="error-message">{errors.foundedYear}</span>}
            </div>
          </div>

          <div className="form-group" data-aos="fade-up" data-aos-delay="350">
            <label htmlFor="website">Website (Optional)</label>
            <div className="input-wrapper">
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.organization.org"
              />
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="form-group" data-aos="fade-up" data-aos-delay="400">
            <label htmlFor="address">Address</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className={errors.address ? 'error' : ''}
              />
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17.657 16.657L13.414 20.9C13.0389 21.2751 12.5303 21.4872 12 21.4872C11.4697 21.4872 10.9611 21.2751 10.586 20.9L6.343 16.657C5.22422 15.5382 4.46234 14.1126 4.15369 12.5608C3.84504 11.009 4.00349 9.40046 4.60901 7.93867C5.21452 6.47688 6.23985 5.22729 7.55544 4.34823C8.87103 3.46917 10.4178 3 12 3C13.5822 3 15.129 3.46917 16.4446 4.34823C17.7602 5.22729 18.7855 6.47688 19.391 7.93867C19.9965 9.40046 20.155 11.009 19.8463 12.5608C19.5377 14.1126 18.7758 15.5382 17.657 16.657Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </div>
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-row" data-aos="fade-up" data-aos-delay="450">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={errors.city ? 'error' : ''}
                />
              </div>
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className={errors.country ? 'error' : ''}
                />
              </div>
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
          </div>
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <div className="form-row" data-aos="fade-up" data-aos-delay="300">
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={errors.contactPerson ? 'error' : ''}
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
              </div>
              {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Contact Phone</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className={errors.contactPhone ? 'error' : ''}
                />
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09501 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.89402 7.65088C9.81437 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1856 16.3491 14.106C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
              </div>
              {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
            </div>
          </div>

          <div className="form-group" data-aos="fade-up" data-aos-delay="350">
            <label htmlFor="missionStatement">Mission Statement</label>
            <div className="input-wrapper">
              <textarea
                id="missionStatement"
                name="missionStatement"
                value={formData.missionStatement}
                onChange={handleChange}
                placeholder="Describe your organization's mission..."
                rows={4}
                className={errors.missionStatement ? 'error' : ''}
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>
            {errors.missionStatement && <span className="error-message">{errors.missionStatement}</span>}
          </div>

          <div className="form-group" data-aos="fade-up" data-aos-delay="400">
            <label>Focus Areas</label>
            <div className="checkbox-grid">
              {focusAreaOptions.map((area, index) => (
                <label key={area} className="checkbox-label" data-aos="fade-right" data-aos-delay={400 + (index * 20)}>
                  <input
                    type="checkbox"
                    name="focusAreas"
                    value={area}
                    checked={formData.focusAreas.includes(area)}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  <span>{area}</span>
                </label>
              ))}
            </div>
            {errors.focusAreas && <span className="error-message">{errors.focusAreas}</span>}
          </div>

          <div className="form-options" data-aos="fade-up" data-aos-delay="600">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span className="checkbox-custom"></span>
              <span>I agree to the Terms and Conditions and verify that all information provided is accurate</span>
            </label>
            {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
          </div>
        </>
      );
    }
  };

  return (
    <div className="auth-form-page ngo-auth">
      {/* Ultra-advanced animated background */}
      <div className="form-bg-wrapper">
        <div className="form-gradient-mesh ngo-gradient"></div>
        <div className="form-flow-field">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flow-particle ngo-particle" style={{ '--flow-delay': `${i * 0.5}s` }}></div>
          ))}
        </div>
        <div className="form-glow-orbs">
          <div className="glow-orb glow-orb-1 ngo-glow"></div>
          <div className="glow-orb glow-orb-2 ngo-glow"></div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="form-card ngo-card" data-aos="zoom-in" data-aos-duration="800">
          {/* Form Header */}
          <div className="form-header">
            <div className="form-icon-wrapper" data-aos="rotate-in" data-aos-delay="200">
              <div className="form-icon-bg ngo-icon-bg"></div>
              <div className="form-icon">🏛️</div>
              <div className="icon-ripple ngo-ripple"></div>
            </div>
            
            <h1 className="form-title" data-aos="fade-up" data-aos-delay="100">
              {isLogin ? 'NGO Portal' : 'Register Your'} 
              <span className="form-title-gradient ngo-gradient-text"> {isLogin ? 'Login' : 'NGO'}</span>
            </h1>
            
            <p className="form-subtitle" data-aos="fade-up" data-aos-delay="200">
              {isLogin 
                ? 'Access your organization dashboard'
                : 'Join our network of change-makers'}
            </p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

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
            {renderFormContent()}

            {/* Form Actions */}
            <div className="form-actions">
              {!isLogin && currentStep > 1 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handlePrevStep}
                  data-aos="fade-right"
                >
                  <span className="button-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                  <span>Previous</span>
                </button>
              )}

              {!isLogin && currentStep < 3 ? (
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleNextStep}
                  data-aos="zoom-in"
                  data-aos-delay="700"
                >
                  <span className="button-text">Next Step</span>
                  <span className="button-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                  <div className="button-glow"></div>
                </button>
                            ) : (
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
                      <span className="button-text">{isLogin ? 'Login' : 'Complete Registration'}</span>
                      <span className="button-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </span>
                    </>
                  )}
                  <div className="button-glow"></div>
                </button>
              )}
            </div>
          </form>

          {/* Form Footer */}
          <div className="form-footer" data-aos="fade-up" data-aos-delay="800">
            <p className="switch-mode">
              {isLogin ? "Don't have an NGO account?" : 'Already registered?'}
              <button 
                type="button"
                className="switch-link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setCurrentStep(1);
                  setErrors({});
                  setSuccessMessage('');
                  // Update URL
                  const newMode = isLogin ? 'signup' : 'login';
                  window.history.pushState({}, '', `/auth/ngo?mode=${newMode}`);
                }}
              >
                {isLogin ? 'Register NGO' : 'Login'}
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

                {/* Decorative Elements */}
        <div className="form-decoration">
          <div className="decoration-circle decoration-circle-1 ngo-decoration"></div>
          <div className="decoration-circle decoration-circle-2 ngo-decoration"></div>
          <div className="decoration-dots ngo-dots"></div>
        </div>
      </div>
      
      {/* Remove or comment out this line */}
      {/* <DemoCredentials /> */}
    </div>
  );
};

export default NgoAuth;
