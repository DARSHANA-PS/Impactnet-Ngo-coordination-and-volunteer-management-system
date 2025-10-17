import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "ImpactNet helped us find skilled volunteers faster than ever. The platform's matching system is revolutionary!",
      author: "Priya Sharma",
      role: "Director, Green Earth Foundation",
      avatar: "👩‍💼"
    },
    {
      quote: "I discovered causes that match my passion—it feels amazing to make a real difference in my community.",
      author: "Rahul Verma",
      role: "Volunteer & Software Developer",
      avatar: "👨‍💻"
    },
    {
      quote: "The transparency in fund utilization and real-time impact tracking convinced us to increase our donations.",
      author: "Anita Desai",
      role: "Corporate CSR Head",
      avatar: "👩‍💼"
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-background">
        <div className="gradient-mesh"></div>
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
            TESTIMONIALS
          </span>
          <h2 
            className="section-title" 
            data-aos="fade-up" 
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            What People <span className="text-gradient">Say</span>
          </h2>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay={300 + index * 200}
            >
              <div className="quote-icon">❝</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
              <div className="testimonial-decoration"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
