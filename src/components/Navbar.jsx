import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    
    // Handle hash navigation
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      // If we're on the home page
      if (location.pathname === '/') {
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 80; // Adjust this based on your navbar height
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Navigate to home page with hash
        navigate(path + '#' + hash);
      }
    } else {
      // Regular navigation
      navigate(href);
    }
    
    // Close mobile menu
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'About', path: '/#about', icon: '🎯' },
    { name: 'How It Works', path: '/#how-it-works', icon: '🔄' },
    { name: 'Features', path: '/#features', icon: '✨' },
    { name: 'Impact', path: '/#impact', icon: '📊' },
    { name: 'Contact', path: '/contact', icon: '📞' },
  ];

  // Check if current nav item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (path.includes('#')) {
      const [, hash] = path.split('#');
      return location.pathname === '/' && location.hash === '#' + hash;
    }
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-wrapper">
        <div className="nav-container">
          <div className="nav-logo" data-aos="fade-down" data-aos-delay="100">
            <div className="logo-animation">
              <svg className="logo-icon" viewBox="0 0 50 50" fill="none">
                <circle cx="25" cy="25" r="20" stroke="url(#gradient1)" strokeWidth="3"/>
                <path d="M25 15 L35 25 L25 35 L15 25 Z" fill="url(#gradient2)"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0077b6" />
                    <stop offset="100%" stopColor="#00b894" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00b894" />
                    <stop offset="100%" stopColor="#0077b6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">ImpactNet</span>
          </div>
          
          <div className={`nav-menu ${mobileMenuOpen ? 'nav-menu-active' : ''}`}>
            <ul className="nav-links">
              {navLinks.map((link, index) => (
                <li key={link.name} data-aos="fade-down" data-aos-delay={200 + index * 100}>
                  <Link 
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, link.path)}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-text">{link.name}</span>
                    <span className="nav-hover-effect"></span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="nav-buttons">
              <button 
                className="nav-btn nav-btn-secondary" 
                data-aos="fade-down" 
                data-aos-delay="700"
                onClick={() => navigate('/signup')}
              >
                <span className="btn-text">Sign Up</span>
                <span className="btn-hover-bg"></span>
              </button>
              
              <button 
                className="nav-cta" 
                data-aos="fade-down" 
                data-aos-delay="800"
                onClick={() => navigate('/login')}
              >
                <span className="cta-text">Login</span>
                <span className="cta-glow"></span>
              </button>
            </div>
          </div>

          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="menu-icon">
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
