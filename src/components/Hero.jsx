import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = (e) => {
    console.error('Video loading error:', e);
    setVideoError(true);
  };

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        {/* Video Background */}
        <div className="video-container">
          {!videoError ? (
            <>
              <video 
                className="hero-video" 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="metadata"
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
              >
                <source src="/videos/hero-bg.mp4" type="video/mp4" />
                <source src="/videos/hero-bg.webm" type="video/webm" />
              </video>
              
              {!videoLoaded && (
                <div className="video-loading">
                  <div className="video-loading-spinner"></div>
                </div>
              )}
            </>
          ) : (
            <div className="video-fallback-background" />
          )}
          
          <div className="video-overlay" />
        </div>

        {/* Animated particles */}
        <div className="hero-particles"></div>
        
        {/* Floating shapes */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-badge"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <span className="badge-text">🌟 Empowering Change Together</span>
        </motion.div>
        
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="title-line" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="400">
            <span className="title-word">Unite NGOs, Volunteers &</span>
          </span>
          <span className="title-line" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="600">
            <span className="title-word title-gradient">
              Donors for a Better Tomorrow
            </span>
          </span>
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          data-aos="fade-up" 
          data-aos-duration="1000" 
          data-aos-delay="800"
        >
          ImpactNet is a unified collaboration platform empowering organizations
          <br />
          and individuals to create real-world social impact together.
        </motion.p>
        
        <motion.div 
          className="hero-cta-group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          data-aos="zoom-in-up" 
          data-aos-duration="1500" 
          data-aos-delay="1200"
          data-aos-easing="ease-out-back"
        >
          <button className="hero-cta-primary" onClick={() => navigate('/signup')}>
            <span className="cta-inner">
              <span className="cta-text">Join as NGO</span>
              <svg className="cta-arrow" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          
          <button className="hero-cta-secondary" onClick={() => navigate('/signup')}>
            <span className="cta-text">Become a Volunteer</span>
            <span className="cta-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
          </button>
          
          <button className="hero-cta-tertiary" onClick={scrollToAbout}>
            <span className="cta-text">Explore Projects</span>
            <span className="cta-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </span>
          </button>
        </motion.div>
        
        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          data-aos="fade-up" 
          data-aos-duration="1500" 
          data-aos-delay="1400"
        >
          <div 
            className="stat-card" 
            data-aos="flip-left" 
            data-aos-duration="1000" 
            data-aos-delay="1600"
          >
            <div className="stat-icon">🤝</div>
            <div className="stat-content">
              <div className="stat-number">120+</div>
              <div className="stat-label">NGOs Registered</div>
            </div>
          </div>
          
          <div 
            className="stat-card" 
            data-aos="flip-left" 
            data-aos-duration="1000" 
            data-aos-delay="1800"
          >
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-number">850+</div>
              <div className="stat-label">Active Volunteers</div>
            </div>
          </div>
          
          <div 
            className="stat-card" 
            data-aos="flip-left" 
            data-aos-duration="1000" 
            data-aos-delay="2000"
          >
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">300+</div>
              <div className="stat-label">Projects Completed</div>
            </div>
          </div>
          
          <div 
            className="stat-card" 
            data-aos="flip-left" 
            data-aos-duration="1000" 
            data-aos-delay="2200"
          >
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">₹25L+</div>
              <div className="stat-label">Funds Raised</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div 
        className="hero-scroll-indicator"
        data-aos="fade-in"
        data-aos-delay="2400"
        data-aos-duration="1000"
        onClick={scrollToAbout}
      >
        <div className="scroll-animation">
          <div className="scroll-wheel"></div>
        </div>
        <span className="scroll-text">Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;
