import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/CallToAction.css';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-background">
        <div className="gradient-animation"></div>
        <div className="stars-animation"></div>
      </div>

      <div className="container">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 
            className="cta-title" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            Ready to Create <span className="text-gradient">Impact?</span>
          </h2>
          <p 
            className="cta-subtitle" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            Join ImpactNet today and be part of a connected community transforming lives
          </p>
          
          <div 
            className="cta-buttons"
            data-aos="zoom-in"
            data-aos-duration="1000"
                        data-aos-delay="600"
          >
            <button 
              className="cta-btn cta-btn-primary"
              onClick={() => navigate('/signup')}
            >
              <span>Sign Up Now</span>
              <div className="btn-glow"></div>
            </button>
            
            <button 
              className="cta-btn cta-btn-secondary"
              onClick={() => navigate('/projects')}
            >
              <span>Discover Projects</span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
