import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaShareAlt, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import '../styles/Features.css';

const Features = () => {
  const features = [
    {
      icon: <FaUsers />,
      title: "Skill-Based Volunteer Matching",
      description: "Connect volunteers to causes they care about based on their expertise",
      gradient: "linear-gradient(135deg, #0077b6 0%, #0096c7 100%)",
      delay: 0
    },
    {
      icon: <FaShareAlt />,
      title: "Resource Sharing Marketplace",
      description: "Share equipment, venues, or expertise across organizations",
      gradient: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
      delay: 100
    },
    {
      icon: <FaChartBar />,
      title: "Impact Analytics Dashboard",
      description: "Track projects, hours, and beneficiaries with visual insights",
      gradient: "linear-gradient(135deg, #0077b6 0%, #0096c7 100%)",
      delay: 200
    },
    {
      icon: <FaCalendarAlt />,
      title: "Event Coordination System",
      description: "Plan drives, fundraisers, and community events seamlessly",
      gradient: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
      delay: 300
    }
  ];

  return (
    <section className="features" id="features">
      <div className="features-background">
        <div className="features-pattern"></div>
        <div className="features-glow glow-1"></div>
        <div className="features-glow glow-2"></div>
      </div>
      
      <div className="features-container">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span 
            className="section-badge" 
            data-aos="zoom-in" 
            data-aos-duration="800"
            data-aos-delay="100"
          >
            ✨ FEATURES
          </span>
          <h2 
            className="section-title" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            All-in-One
            <span className="title-gradient"> Collaboration Hub</span>
          </h2>
          <p 
            className="section-subtitle" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            Everything you need to amplify your social impact
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="feature-card"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              data-aos="zoom-in-up"
              data-aos-duration="1000"
              data-aos-delay={100 + index * 150}
              style={{'--feature-gradient': feature.gradient}}
            >
              <div className="card-background"></div>
              <div className="card-content">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="icon-glow"></div>
                </div>
                
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                
                <button className="feature-cta">
                  <span>Learn More</span>
                  <svg className="cta-arrow" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              
              <div className="card-shine"></div>
              <div className="card-particles">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="particle-item" 
                    style={{
                      left: Math.random() * 100 + '%',
                      animationDelay: Math.random() * 3 + 's'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
