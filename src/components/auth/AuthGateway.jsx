import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../styles/AuthGateway.css';

const AuthGateway = ({ type = 'signup' }) => {
  const navigate = useNavigate();
  const isSignup = type === 'signup';

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const authOptions = [
    {
      role: 'Volunteer',
      icon: '🤝',
      title: isSignup ? 'Join as Volunteer' : 'Volunteer Login',
      description: isSignup 
        ? 'Make a difference by contributing your time and skills'
        : 'Access your volunteer dashboard and activities',
      gradient: '135deg, #0077b6 0%, #0096c7 100%',
      shadowColor: 'rgba(0, 119, 182, 0.4)',
      path: `/auth/volunteer?mode=${type}`,
      features: ['Track volunteer hours', 'Join NGO projects', 'Impact certificates'],
      delay: 0,
      animation: 'fade-right'
    },
    {
      role: 'NGO',
      icon: '🏛️',
      title: isSignup ? 'Register NGO' : 'NGO Login',
      description: isSignup
        ? 'Connect with volunteers and expand your impact'
        : 'Manage your organization and volunteer programs',
      gradient: '135deg, #00b894 0%, #00cec9 100%',
      shadowColor: 'rgba(0, 184, 148, 0.4)',
      path: `/auth/ngo?mode=${type}`,
      features: ['Volunteer management', 'Project creation', 'Impact analytics'],
      delay: 100,
      animation: 'fade-up'
    },
    {
      role: 'Donor',
      icon: '💎',
      title: isSignup ? 'Become a Donor' : 'Donor Login',
      description: isSignup
        ? 'Support causes that matter to you'
        : 'Track your donations and see your impact',
      gradient: '135deg, #764ba2 0%, #667eea 100%',
      shadowColor: 'rgba(118, 75, 162, 0.4)',
      path: `/auth/donor?mode=${type}`,
      features: ['Donation tracking', 'Tax receipts', 'Impact reports'],
      delay: 200,
      animation: 'fade-left'
    },
    // Only add Admin option for login, not signup
    ...(!isSignup ? [{
      role: 'Admin',
      icon: '👨‍💼',
      title: 'Admin Login',
      description: 'Access admin panel for NGO verification',
      gradient: '135deg, #ff6b6b 0%, #ee5a24 100%',
      shadowColor: 'rgba(255, 107, 107, 0.4)',
      path: `/auth/admin`,
      features: ['NGO Verification', 'Platform Management', 'User Oversight'],
      delay: 300,
      animation: 'fade-up'
    }] : [])
  ];

  const handleCardClick = (option) => {
    if (option.path) {
      navigate(option.path);
    }
  };

  return (
    <div className="auth-gateway">
      {/* Ultra-advanced background */}
      <div className="auth-bg-container">
        <div className="auth-gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
        <div className="auth-grid-pattern"></div>
        <div className="auth-particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" style={{ '--particle-index': i }}></div>
          ))}
        </div>
        <div className="auth-glow-lines">
          <div className="glow-line glow-line-1"></div>
          <div className="glow-line glow-line-2"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="auth-container">
        <div className="auth-header" data-aos="fade-down" data-aos-duration="1000">
          <div className="auth-badge" data-aos="zoom-in" data-aos-delay="200">
            <span className="badge-icon">✨</span>
            <span className="badge-text">IMPACTNET PLATFORM</span>
          </div>
          
          <h1 className="auth-title">
            <span className="title-line" data-aos="fade-up" data-aos-delay="300">
              {isSignup ? 'Join the' : 'Welcome Back to'}
            </span>
            <span className="title-gradient" data-aos="fade-up" data-aos-delay="400">
              Impact Movement
            </span>
          </h1>
          
          <p className="auth-subtitle" data-aos="fade-up" data-aos-delay="500">
            {isSignup 
              ? 'Choose how you want to make a difference in the world'
              : 'Select your role to access your dashboard'}
          </p>
        </div>

        <div className="auth-options">
          {authOptions.map((option, index) => (
            <div
              key={option.role}
              className="auth-card"
              style={{ 
                '--card-gradient': `linear-gradient(${option.gradient})`,
                '--shadow-color': option.shadowColor,
                '--card-index': index
              }}
              data-aos={option.animation}
              data-aos-delay={option.delay}
              data-aos-duration="800"
              onClick={() => handleCardClick(option)}
            >
              <div className="card-background">
                <div className="card-gradient"></div>
                <div className="card-pattern"></div>
                <div className="card-shimmer"></div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon-wrapper">
                    <div className="icon-glow"></div>
                    <div className="card-icon" data-aos="zoom-in" data-aos-delay={option.delay + 100}>
                      {option.icon}
                    </div>
                    <div className="icon-ring"></div>
                  </div>
                  
                  <h2 className="card-title">{option.title}</h2>
                  <p className="card-description">{option.description}</p>
                </div>

                <div className="card-features">
                  {option.features.map((feature, idx) => (
                    <div key={idx} className="feature-item" data-aos="fade-right" data-aos-delay={option.delay + 150 + (idx * 50)}>
                      <span className="feature-icon">✓</span>
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="card-button">
                  <span className="button-text">{isSignup ? 'Get Started' : 'Login'} as {option.role}</span>
                  <span className="button-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                  <div className="button-glow"></div>
                </button>
              </div>

              <div className="card-hover-effects">
                <div className="hover-gradient"></div>
                <div className="hover-particles">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="auth-footer" data-aos="fade-up" data-aos-delay="600">
          <p className="footer-text">
            {isSignup
              ? 'Already have an account?' 
              : "Don't have an account?"}
            <a href={isSignup ? '/login' : '/signup'} className="auth-link">
              {isSignup ? 'Login here' : 'Sign up here'}
            </a>
          </p>
          
          <div className="security-badges" data-aos="zoom-in" data-aos-delay="700">
            <div className="security-item">
              <span className="security-icon">🔒</span>
              <span className="security-text">SSL Secured</span>
            </div>
            <div className="security-item">
              <span className="security-icon">🛡️</span>
              <span className="security-text">Data Protected</span>
            </div>
            <div className="security-item">
              <span className="security-icon">✅</span>
              <span className="security-text">Verified Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthGateway;
