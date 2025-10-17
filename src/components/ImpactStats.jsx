import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import '../styles/ImpactStats.css';

const ImpactStats = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const stats = [
    {
      number: 120,
      suffix: "+",
      label: "NGOs Registered",
      icon: "🏢"
    },
    {
      number: 850,
      suffix: "+",
      label: "Volunteers Engaged",
      icon: "👥"
    },
    {
      number: 300,
      suffix: "+",
      label: "Projects Completed",
      icon: "✅"
    },
    {
      number: 25,
      prefix: "₹",
      suffix: "L+",
      label: "Funds Raised",
      icon: "💰"
    }
  ];

  return (
    <section className="impact-stats" id="impact">
      <div className="impact-background">
        <div className="animated-bg"></div>
        <div className="particles-bg"></div>
      </div>

      <div className="container" ref={ref}>
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
            IMPACT
          </span>
          <h2 
            className="section-title" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            Together, We're Making a <span className="text-gradient">Difference</span>
          </h2>
          <p 
            className="section-subtitle" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            Numbers that represent lives changed and communities empowered
          </p>
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay={300 + index * 150}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">
                {inView && (
                  <>
                    {stat.prefix}
                    <CountUp
                      start={0}
                      end={stat.number}
                      duration={2.5}
                      separator=","
                      decimals={0}
                    />
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-decoration">
                <div className="decoration-circle"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
