import React, { useEffect } from 'react';
import Hero from './Hero';
import About from './About';
import HowItWorks from './HowItWorks';
import Features from './Features';
import ImpactStats from './ImpactStats';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';
import '../styles/Home.css';

const Home = () => {
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to it
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    // Initialize any home page specific effects
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.observe');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      <Hero />
      <section id="about">
        <About />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="impact">
        <ImpactStats />
      </section>
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;
