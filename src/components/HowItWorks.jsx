import React from 'react';
import { motion } from 'framer-motion';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "NGOs Register",
      description: "Organizations sign up and list their projects, needs, and goals",
      icon: "🏢",
      color: "#0077b6"
    },
    {
      number: "02",
      title: "Volunteers Connect",
      description: "Individuals find projects matching their skills and availability",
      icon: "🤝",
      color: "#00b894"
    },
    {
      number: "03",
      title: "Impact Happens",
      description: "Donors contribute and everyone tracks real progress together",
      icon: "🎯",
      color: "#0077b6"
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="hiw-background">
        <div className="wave-animation"></div>
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
            PROCESS
          </span>
          <h2 
            className="section-title" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            How <span className="text-gradient">ImpactNet</span> Works
          </h2>
          <p 
            className="section-subtitle" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            Three simple steps to create lasting social change
          </p>
        </motion.div>

        <div className="steps-container">
          <div className="connection-line"></div>
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="step-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-duration="1000"
              data-aos-delay={300 + index * 200}
              style={{ '--step-color': step.color }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              <div className="step-decoration">
                <div className="decoration-circle"></div>
                <div className="decoration-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
