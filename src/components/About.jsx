import React from 'react';
import { motion } from 'framer-motion';
import { FaHandshake, FaLightbulb, FaDonate, FaChartLine } from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  const highlights = [
    {
      icon: <FaHandshake />,
      title: "Empower NGOs",
      description: "Through shared resources and collaborative tools",
      color: "#0077b6"
    },
    {
      icon: <FaLightbulb />,
      title: "Match Volunteers",
      description: "By skills and passion for maximum impact",
      color: "#00b894"
    },
    {
      icon: <FaDonate />,
      title: "Simplify Donations",
      description: "With transparency and real-time tracking",
      color: "#0077b6"
    },
    {
      icon: <FaChartLine />,
      title: "Measure Impact",
      description: "Showcase real-world changes with data",
      color: "#00b894"
    }
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="pattern-overlay"></div>
      </div>

      <div className="container">
        <motion.div 
          className="section-header"
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
            OUR MISSION
          </span>
          <h2 
            className="section-title" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            Building Bridges for <span className="text-gradient">Social Impact</span>
          </h2>
          <p 
            className="section-subtitle" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            We believe collaboration is the key to meaningful change. ImpactNet bridges the gap between NGOs, 
            volunteers, donors, and communities—turning isolated efforts into collective progress.
          </p>
        </motion.div>

        <div className="highlights-grid">
          {highlights.map((highlight, index) => (
            <motion.div 
              key={index}
              className="highlight-card"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              data-aos="zoom-in-up"
              data-aos-duration="800"
              data-aos-delay={300 + index * 150}
              style={{ '--highlight-color': highlight.color }}
            >
              <div className="highlight-icon-wrapper">
                <div className="highlight-icon">{highlight.icon}</div>
                <div className="icon-glow"></div>
              </div>
              <h3 className="highlight-title">{highlight.title}</h3>
              <p className="highlight-description">{highlight.description}</p>
              <div className="highlight-decoration">
                <div className="decoration-line"></div>
                <div className="decoration-dot"></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="about-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="600"
        >
          <button className="btn-learn-more">
            <span>Learn More About Us</span>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
