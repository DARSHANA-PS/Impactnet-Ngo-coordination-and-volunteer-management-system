// DonorDashboardIntegrated.jsx - Donor Dashboard with Local Storage Integration

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDonorDashboard, useRealTimeUpdates } from '../../hooks/useDashboardData';
import localStorageService from '../../services/localStorageService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './DonorDashboard.css';
import { logout } from '../../services/authService';

// Icons
import { 
  FaSearch, FaFilter, FaHeart, FaDonate, FaChartLine, FaBell,
  FaCalendarAlt, FaGift, FaHandsHelping, FaTrophy, FaShare,
  FaUsers, FaArrowRight, FaCheckCircle, FaClock, FaMapMarkerAlt,
  FaStar, FaDownload, FaShieldAlt, FaAward, FaHome, FaSignOutAlt,
  FaQuestionCircle, FaCog, FaEnvelope, FaGlobe, FaMedkit,
  FaBook, FaTree, FaChild, FaUtensils, FaBoxOpen, FaLaptopCode,
  FaStethoscope, FaChalkboardTeacher, FaTools, FaCertificate
} from 'react-icons/fa';
import { 
  MdDashboard, MdVerified, MdTrendingUp, MdEventAvailable,
  MdVolunteerActivism, MdCampaign, MdNotifications, MdReport
} from 'react-icons/md';
import { 
  BsGraphUp, BsBarChartFill, BsPieChartFill, BsShare,
  BsBookmarkStar, BsCashStack, BsGiftFill, BsPersonBadgeFill
} from 'react-icons/bs';

const DonorDashboardIntegrated = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [donationType, setDonationType] = useState('monetary');

  // Get donor ID from auth/session (mock for now)
  const donorId = localStorage.getItem('currentUserId') || 'DON001';
  const donorName = localStorage.getItem('currentUserName') || 'Rajesh Kumar';

  // Use custom hooks
  const {
    campaigns,
    donations,
    impactReports,
    partnerNgos,
    events,
    achievements,
    notifications,
    analytics,
    loading,
    makeDonation,
    searchCampaigns,
    registerForEvent,
    markNotificationRead,
    refreshData
  } = useDonorDashboard(donorId);

  const realTimeUpdates = useRealTimeUpdates(donorId, 'donor');

  // Filter campaigns
  const filteredCampaigns = searchCampaigns(searchQuery, {
    category: selectedCategory === 'all' ? null : selectedCategory
  });

  // Handle donation
  const handleDonate = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const confirmDonation = () => {
    if (selectedCampaign && donationAmount) {
      makeDonation(selectedCampaign.id, parseInt(donationAmount), 'online');
      setShowDonationModal(false);
      setSelectedCampaign(null);
      setDonationAmount('');
    }
  };

  // Handle event registration
  const handleEventRegister = (eventId) => {
    registerForEvent(eventId);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'education': return <FaBook />;
      case 'healthcare': return <FaMedkit />;
      case 'environment': return <FaTree />;
      case 'hunger': return <FaUtensils />;
      case 'water': return <FaGlobe />;
      case 'children': return <FaChild />;
      default: return <FaHeart />;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="donor-dashboard">
      {/* Ultra Advanced Background */}
      <div className="dashboard-background">
        <div className="bg-gradient-mesh"></div>
        <div className="bg-flow-field">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="flow-line" 
              style={{ 
                left: `${i * 5}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${15 + i % 3}s`
              }}
            ></div>
          ))}
        </div>
        <div className="bg-particles">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${20 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
        <div className="bg-glow-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="dashboard-container">
        {/* Sidebar with real data */}
        <aside className="dashboard-sidebar" data-aos="fade-right">
          <div className="sidebar-header">
            <div className="donor-profile">
              <div className="donor-avatar">
                <span>👤</span>
                <div className="avatar-badge">
                  <FaHeart />
                </div>
              </div>
              <div className="donor-info">
                <h3>{donorName}</h3>
                <span className="donor-level">Impact Champion</span>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSectionChange('dashboard')}
            >
              <MdDashboard />
              <span>Dashboard</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'campaigns' ? 'active' : ''}`}
              onClick={() => handleSectionChange('campaigns')}
            >
              <FaHeart />
              <span>Campaigns</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'donations' ? 'active' : ''}`}
              onClick={() => handleSectionChange('donations')}
            >
              <FaDonate />
              <span>My Donations</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'impact' ? 'active' : ''}`}
              onClick={() => handleSectionChange('impact')}
            >
              <FaChartLine />
              <span>Impact Reports</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'ngos' ? 'active' : ''}`}
              onClick={() => handleSectionChange('ngos')}
            >
              <MdVolunteerActivism />
              <span>Partner NGOs</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'events' ? 'active' : ''}`}
              onClick={() => handleSectionChange('events')}
            >
              <MdEventAvailable />
              <span>Events</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'achievements' ? 'active' : ''}`}
              onClick={() => handleSectionChange('achievements')}
            >
              <FaTrophy />
              <span>Achievements</span>
              <div className="nav-indicator"></div>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="nav-item settings">
              <FaCog />
              <span>Settings</span>
            </button>
            <button className="nav-item help">
              <FaQuestionCircle />
              <span>Help Center</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Header with real notifications */}
          <header className="dashboard-header" data-aos="fade-down">
            <div className="header-left">
              <h1 className="page-title">
                {activeSection === 'dashboard' && `Welcome back, ${donorName}! 🙌`}
                {activeSection === 'campaigns' && 'Fundraising Campaigns'}
                {activeSection === 'donations' && 'Your Donations'}
                {activeSection === 'impact' && 'Impact Reports'}
                {activeSection === 'ngos' && 'Partnered NGOs'}
                {activeSection === 'events' && 'Fundraising Events'}
                {activeSection === 'achievements' && 'Your Achievements'}
              </h1>
              <p className="page-subtitle">
                {activeSection === 'dashboard' && 'Your kindness keeps communities alive. Let\'s make a difference today.'}
                {activeSection === 'campaigns' && 'Discover campaigns that need your support'}
                {activeSection === 'donations' && 'Track your donation history and recurring contributions'}
                {activeSection === 'impact' && 'See the real-world impact of your donations'}
                {activeSection === 'ngos' && 'Verified NGOs you support and trust'}
                {activeSection === 'events' && 'Join fundraising events and drives'}
                {activeSection === 'achievements' && 'Your milestones and recognition'}
              </p>
            </div>

            <div className="header-right">
              {/* Search for campaigns */}
              {activeSection === 'campaigns' && (
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              )}

              {/* Home Button */}
              <button 
                className="home-btn"
                onClick={() => navigate('/')}
                title="Go to Home"
              >
                <FaHome />
              </button>

              {/* Notifications with real data */}
              <div className="notification-wrapper">
                <button 
                  className="notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell />
                  {realTimeUpdates && realTimeUpdates.length > 0 && (
                    <span className="notification-badge">
                      {realTimeUpdates.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notification-dropdown" data-aos="fade-in">
                    <div className="notification-header">
                      <h4>Notifications</h4>
                      <button className="mark-all-read">Mark all as read</button>
                    </div>
                    {realTimeUpdates && realTimeUpdates.length > 0 ? (
                      realTimeUpdates.map(notification => (
                        <div 
                          key={notification.id} 
                          className="notification-item unread"
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <div className="notification-icon">
                            {notification.type === 'impact' && <FaChartLine />}
                            {notification.type === 'campaign' && <FaHeart />}
                            {notification.type === 'achievement' && <FaTrophy />}
                          </div>
                          <div className="notification-content">
                            <p>{notification.message}</p>
                            <span className="notification-time">
                              {new Date(notification.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-notifications">No new notifications</p>
                    )}
                    <button className="view-all-notifications">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button 
                className="logout-header-btn"
                onClick={() => {
                  logout();
                }}
                title="Logout"
              >
                <FaSignOutAlt />
              </button>

              {/* Quick Donate Button */}
              <button 
                className="quick-donate-btn primary"
                onClick={() => setShowDonationModal(true)}
              >
                <FaDonate />
                Quick Donate
              </button>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="dashboard-content">
            {/* Dashboard Overview with real data */}
            {activeSection === 'dashboard' && (
              <div className="dashboard-overview">
                {/* Hero Welcome Section */}
                <div className="hero-welcome" data-aos="fade-up">
                  <div className="welcome-content">
                    <h2>Your generosity creates lasting change</h2>
                    <p>Together, we've impacted many lives this month</p>
                    <div className="hero-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => handleSectionChange('campaigns')}
                      >
                        Explore Campaigns
                        <FaArrowRight />
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => handleSectionChange('impact')}
                      >
                        View Your Impact
                      </button>
                    </div>
                  </div>
                  <div className="welcome-illustration">
                    <div className="impact-animation">
                      <div className="impact-circle"></div>
                      <div className="impact-wave"></div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid with real analytics */}
                <div className="stats-grid" data-aos="fade-up" data-aos-delay="100">
                  <div className="stat-card gradient-1">
                    <div className="stat-icon">
                      <BsCashStack />
                    </div>
                    <div className="stat-content">
                      <h3>{formatCurrency(analytics?.totalDonated || 0)}</h3>
                      <p>Total Donated</p>
                      <span className="stat-trend positive">+15% this year</span>
                    </div>
                    <div className="stat-sparkline">
                      {[40, 60, 45, 80, 70].map((height, i) => (
                        <div key={i} className="sparkline-bar" style={{height: `${height}%`}}></div>
                      ))}
                    </div>
                                      </div>

                  <div className="stat-card gradient-2">
                    <div className="stat-icon">
                      <FaHeart />
                    </div>
                    <div className="stat-content">
                      <h3>{analytics?.campaignsSupported || 0}</h3>
                      <p>Causes Supported</p>
                      <span className="stat-detail">Across 5 categories</span>
                    </div>
                    <div className="stat-chart">
                      <div className="mini-pie-chart"></div>
                    </div>
                  </div>

                  <div className="stat-card gradient-3">
                    <div className="stat-icon">
                      <MdVerified />
                    </div>
                    <div className="stat-content">
                      <h3>{analytics?.ngosSupported || 0}</h3>
                      <p>NGOs Helped</p>
                      <span className="stat-detail">All verified</span>
                    </div>
                    <div className="stat-icons">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="ngo-mini-icon">🏢</div>
                      ))}
                    </div>
                  </div>

                  <div className="stat-card gradient-4">
                    <div className="stat-icon">
                      <MdReport />
                    </div>
                    <div className="stat-content">
                      <h3>{impactReports?.length || 0}</h3>
                      <p>Impact Reports</p>
                      <span className="stat-detail">Received</span>
                    </div>
                    <div className="stat-progress">
                      <div className="progress-circle">
                        <span>92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Donation Panel */}
                <div className="smart-donation-panel" data-aos="fade-up" data-aos-delay="200">
                  <h2 className="section-title">Choose How You Want to Contribute</h2>
                  <div className="donation-options">
                    <div 
                      className="donation-option-card"
                      onClick={() => {
                        setDonationType('monetary');
                        setShowDonationModal(true);
                      }}
                    >
                      <div className="option-icon">
                        <BsCashStack />
                      </div>
                      <h3>Monetary Donation</h3>
                      <p>Support causes with financial contributions</p>
                      <div className="option-features">
                        <span>✓ Tax Benefits</span>
                        <span>✓ Instant Impact</span>
                        <span>✓ Track Usage</span>
                      </div>
                      <button className="option-btn">Donate Money</button>
                    </div>

                    <div 
                      className="donation-option-card"
                      onClick={() => {
                        setDonationType('in-kind');
                        setShowDonationModal(true);
                      }}
                    >
                      <div className="option-icon">
                        <FaBoxOpen />
                      </div>
                      <h3>In-Kind Donation</h3>
                      <p>Donate goods, clothes, books, or equipment</p>
                      <div className="option-features">
                        <span>✓ Direct Help</span>
                        <span>✓ Reuse Items</span>
                        <span>✓ Local Impact</span>
                      </div>
                      <button className="option-btn">Donate Items</button>
                    </div>

                    <div 
                      className="donation-option-card"
                      onClick={() => {
                        setDonationType('skill');
                        setShowDonationModal(true);
                      }}
                    >
                      <div className="option-icon">
                        <FaLaptopCode />
                      </div>
                      <h3>Skill Donation</h3>
                      <p>Offer your expertise and professional services</p>
                      <div className="option-features">
                        <span>✓ Use Skills</span>
                        <span>✓ Mentor NGOs</span>
                        <span>✓ Build Network</span>
                      </div>
                      <button className="option-btn">Offer Skills</button>
                    </div>
                  </div>
                </div>

                {/* Recent Impact Summary */}
                <div className="recent-impact" data-aos="fade-up" data-aos-delay="300">
                  <h2 className="section-title">Your Recent Impact</h2>
                  <div className="impact-cards">
                    <div className="impact-summary-card">
                      <div className="impact-icon">
                        <FaUtensils />
                      </div>
                      <div className="impact-number">500</div>
                      <div className="impact-label">Meals Provided</div>
                    </div>
                    <div className="impact-summary-card">
                      <div className="impact-icon">
                        <FaBook />
                      </div>
                      <div className="impact-number">150</div>
                      <div className="impact-label">Students Helped</div>
                    </div>
                    <div className="impact-summary-card">
                      <div className="impact-icon">
                        <FaTree />
                      </div>
                      <div className="impact-number">100</div>
                      <div className="impact-label">Trees Planted</div>
                    </div>
                    <div className="impact-summary-card">
                      <div className="impact-icon">
                        <FaHandsHelping />
                      </div>
                      <div className="impact-number">5</div>
                      <div className="impact-label">Projects Funded</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Campaigns Section with real data */}
            {activeSection === 'campaigns' && (
              <div className="campaigns-section">
                {/* Category Filter */}
                <div className="campaigns-filter" data-aos="fade-down">
                  <div className="filter-categories">
                    <button
                      className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Categories
                    </button>
                    <button
                      className={`category-btn ${selectedCategory === 'education' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('education')}
                    >
                      <FaBook /> Education
                    </button>
                    <button
                      className={`category-btn ${selectedCategory === 'health' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('health')}
                    >
                      <FaMedkit /> Health
                    </button>
                    <button
                      className={`category-btn ${selectedCategory === 'environment' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('environment')}
                    >
                      <FaTree /> Environment
                    </button>
                    <button
                      className={`category-btn ${selectedCategory === 'hunger' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('hunger')}
                    >
                      <FaUtensils /> Hunger
                    </button>
                  </div>
                  
                  <div className="filter-actions">
                    <button className="filter-btn">
                      <FaFilter /> Advanced Filters
                    </button>
                  </div>
                </div>

                {/* Campaigns Grid */}
                <div className="campaigns-grid">
                  {filteredCampaigns && filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign, index) => (
                      <div 
                        key={campaign.id} 
                        className="campaign-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="campaign-image">
                          <img 
                            src={`https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400`} 
                            alt={campaign.title} 
                          />
                          <div className="campaign-badge">
                            {getCategoryIcon(campaign.category)}
                            <span>{campaign.category}</span>
                          </div>
                        </div>
                        
                        <div className="campaign-content">
                          <div className="ngo-info">
                            <MdVerified className="verified-icon" />
                            <span>{campaign.ngoName}</span>
                          </div>
                          
                          <h3>{campaign.title}</h3>
                          <p>{campaign.description}</p>
                          
                          <div className="campaign-progress">
                            <div className="progress-info">
                              <span className="raised">
                                {formatCurrency(campaign.raised || 0)} raised
                              </span>
                              <span className="target">
                                of {formatCurrency(campaign.goal)}
                              </span>
                            </div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ 
                                  width: `${((campaign.raised || 0) / campaign.goal) * 100}%` 
                                }}
                              >
                                <div className="progress-glow"></div>
                              </div>
                            </div>
                            <div className="campaign-stats">
                              <span><FaClock /> {campaign.daysLeft || 30} days left</span>
                              <span>{Math.round(((campaign.raised || 0) / campaign.goal) * 100)}% funded</span>
                            </div>
                          </div>
                          
                          <div className="campaign-actions">
                            <button 
                              className="donate-btn primary"
                              onClick={() => handleDonate(campaign)}
                            >
                              Donate Now
                            </button>
                            <button className="share-btn">
                              <FaShare />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No campaigns found. Try adjusting your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Donations Section */}
            {activeSection === 'donations' && (
              <div className="donations-section">
                <h2 className="section-title">Your Donation History</h2>
                <div className="donations-list">
                  {donations && donations.length > 0 ? (
                    donations.map((donation, index) => (
                      <div 
                        key={donation.id}
                        className="donation-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="donation-header">
                          <h4>{donation.campaignTitle}</h4>
                          <span className="donation-amount">
                            {formatCurrency(donation.amount)}
                          </span>
                        </div>
                        <div className="donation-details">
                          <p>{donation.ngoName}</p>
                          <span className="donation-date">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="donation-status">
                          <FaCheckCircle className="status-icon" />
                          <span>Payment Successful</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No donations yet. Start making an impact today!</p>
                      <button onClick={() => setActiveSection('campaigns')}>
                        Browse Campaigns
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Impact Reports Section */}
            {activeSection === 'impact' && (
              <div className="impact-section">
                <div className="impact-header" data-aos="fade-up">
                  <h2 className="section-title">See Where Your Donations Go</h2>
                  <p>Transparent reporting from verified NGOs</p>
                </div>

                <div className="impact-reports-grid">
                  {impactReports && impactReports.length > 0 ? (
                    impactReports.map((report, index) => (
                      <div 
                        key={report.id}
                        className="impact-report-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="report-header">
                          <div className="report-ngo">
                            <MdVerified className="verified-badge" />
                            <span>{report.ngoName}</span>
                          </div>
                          <div className="report-date">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="report-content">
                          <h3>{report.campaignTitle}</h3>
                          
                          <div className="donation-info">
                            <span className="donation-label">Your Contribution:</span>
                            <span className="donation-amount">{formatCurrency(report.amount)}</span>
                          </div>
                          
                          <div className="impact-description">
                            <FaCheckCircle className="impact-icon" />
                            <p>{report.impact}</p>
                          </div>
                          
                          <div className="report-actions">
                            <button className="download-btn">
                              <FaDownload /> Download Report
                            </button>
                            <button className="share-btn">
                              <FaShare /> Share Impact
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No impact reports available yet.</p>
                    </div>
                  )}
                </div>

                {/* Impact Analytics */}
                <div className="impact-analytics" data-aos="fade-up" data-aos-delay="200">
                  <h2 className="section-title">Your Impact Analytics</h2>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h3>Donation Distribution</h3>
                      <div className="pie-chart-container">
                        <div className="pie-chart">
                          <div className="chart-center">
                            <span>8</span>
                            <small>Causes</small>
                          </div>
                        </div>
                        <div className="chart-legend">
                          <div className="legend-item">
                            <span className="color education"></span>
                            <span>Education (35%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="color health"></span>
                            <span>Healthcare (25%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="color environment"></span>
                            <span>Environment (20%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="color others"></span>
                            <span>Others (20%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="analytics-card">
                      <h3>Monthly Contribution Trend</h3>
                      <div className="line-chart">
                        <div className="chart-grid">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="grid-line"></div>
                          ))}
                        </div>
                        <svg className="trend-line" viewBox="0 0 300 150">
                          <polyline
                            points="0,120 50,100 100,110 150,80 200,60 250,70 300,40"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#764ba2" />
                              <stop offset="100%" stopColor="#667eea" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Partner NGOs Section */}
            {activeSection === 'ngos' && (
              <div className="ngos-section">
                <h2 className="section-title">NGOs You Support</h2>
                <div className="ngos-grid">
                  {partnerNgos && partnerNgos.length > 0 ? (
                    partnerNgos.map((ngo, index) => (
                      <div 
                        key={ngo.id}
                        className="ngo-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="ngo-header">
                          <div className="ngo-logo">
                            <span>🏢</span>
                            <MdVerified className="ngo-verified" />
                          </div>
                        </div>
                        
                        <div className="ngo-content">
                          <h3>{ngo.name}</h3>
                          
                          <div className="ngo-stats">
                            <div className="stat">
                              <span className="stat-value">
                                {formatCurrency(ngo.totalDonated || 0)}
                              </span>
                              <span className="stat-label">Total Donated</span>
                            </div>
                            <div className="stat">
                              <span className="stat-value">{ngo.projectsSupported || 0}</span>
                              <span className="stat-label">Projects</span>
                            </div>
                          </div>
                          
                          <button className="view-profile-btn">
                            View Profile
                            <FaArrowRight />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>You haven't supported any NGOs yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events Section */}
            {activeSection === 'events' && (
              <div className="events-section">
                <h2 className="section-title">Upcoming Fundraising Events</h2>
                <div className="events-list">
                  {events && events.length > 0 ? (
                    events.map((event, index) => (
                      <div 
                        key={event.id}
                        className="event-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="event-date">
                          <span className="date-day">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="date-month">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                        
                        <div className="event-content">
                          <div className="event-type">
                            {event.type === 'Fundraiser' ? <FaDonate /> : <FaCalendarAlt />}
                            <span>{event.type || 'Event'}</span>
                          </div>
                          
                          <h3>{event.title}</h3>
                          <p className="event-ngo">{event.ngoName}</p>
                          
                          <div className="event-details">
                            <div className="detail">
                              <FaMapMarkerAlt />
                              <span>{event.location}</span>
                            </div>
                            <div className="detail">
                              <FaHeart />
                              <span>Goal: {formatCurrency(event.goal || 50000)}</span>
                            </div>
                          </div>
                          
                          <div className="event-actions">
                            {event.registered?.some(r => r.userId === donorId) ? (
                              <button className="registered-btn" disabled>
                                <FaCheckCircle /> Registered
                              </button>
                            ) : (
                              <>
                                <button className="sponsor-btn">
                                  Sponsor Event
                                </button>
                                <button 
                                  className="register-btn"
                                  onClick={() => handleEventRegister(event.id)}
                                >
                                  Register
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No upcoming events.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {activeSection === 'achievements' && (
              <div className="achievements-section">
                <div className="badges-showcase" data-aos="fade-up">
                  <h2 className="section-title">Your Achievements 🎖️</h2>
                  <div className="badges-grid">
                    {achievements && achievements.length > 0 ? (
                      achievements.map((badge, index) => (
                        <div 
                          key={badge.id}
                          className="badge-card"
                          data-aos="zoom-in"
                          data-aos-delay={index * 100}
                        >
                          <div className="badge-icon">
                            {badge.icon === '⏰' && <FaClock />}
                            {badge.icon === '🏆' && <FaTrophy />}
                            {badge.icon === '💎' && <FaStar />}
                            {badge.icon === '🤝' && <FaHandsHelping />}
                            {!badge.icon && <FaAward />}
                          </div>
                          <h4>{badge.name}</h4>
                          <p>{badge.description}</p>
                          <p className="badge-date">
                            Earned on {new Date(badge.awardedAt || badge.createdAt).toLocaleDateString()}
                          </p>
                          <div className="badge-glow"></div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <p>Keep donating to earn achievements!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="milestones" data-aos="fade-up" data-aos-delay="200">
                  <h2 className="section-title">Milestones</h2>
                  <div className="milestone-timeline">
                    <div className="timeline-line"></div>
                    <div className="milestone-item completed">
                      <div className="milestone-dot"></div>
                      <div className="milestone-content">
                        <h4>First Donation</h4>
                        <p>Made your first contribution</p>
                      </div>
                    </div>
                    <div className="milestone-item completed">
                      <div className="milestone-dot"></div>
                      <div className="milestone-content">
                        <h4>₹1 Lakh Donated</h4>
                        <p>Reached 6-figure donation milestone</p>
                      </div>
                    </div>
                    <div className="milestone-item upcoming">
                      <div className="milestone-dot"></div>
                      <div className="milestone-content">
                        <h4>₹5 Lakh Club</h4>
                        <p>Join our elite donors circle</p>
                        <div className="progress-to-milestone">
                          <div className="milestone-progress" style={{width: '50%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="modal-overlay" onClick={() => setShowDonationModal(false)}>
          <div className="donation-modal" onClick={e => e.stopPropagation()} data-aos="zoom-in">
            <div className="modal-header">
              <h2>
                {donationType === 'monetary' && '💰 Make a Donation'}
                {donationType === 'in-kind' && '📦 Donate Items'}
                {donationType === 'skill' && '💻 Offer Your Skills'}
              </h2>
              <button className="close-btn" onClick={() => setShowDonationModal(false)}>
                ×
              </button>
            </div>
            
            {donationType === 'monetary' && (
              <div className="modal-content">
                {selectedCampaign && (
                  <>
                    <h3>{selectedCampaign.title}</h3>
                    <p className="ngo-name">{selectedCampaign.ngoName}</p>
                  </>
                )}
                
                <div className="quick-amounts">
                  <h3>Select Amount</h3>
                  <div className="amount-grid">
                    {[500, 1000, 2500, 5000, 10000].map(amount => (
                      <button 
                        key={amount}
                        className={`amount-btn ${donationAmount === amount.toString() ? 'selected' : ''}`}
                        onClick={() => setDonationAmount(amount.toString())}
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                    <button className="amount-btn custom">Custom</button>
                  </div>
                </div>
                
                <div className="donation-form">
                  <div className="form-group">
                    <label>Enter Amount</label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="100"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Donation Type</label>
                    <div className="donation-type-options">
                      <label>
                        <input type="radio" name="donation-type" defaultChecked />
                        One-time Donation
                      </label>
                      <label>
                        <input type="radio" name="donation-type" />
                        Monthly Recurring
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    className="proceed-btn"
                    onClick={confirmDonation}
                    disabled={!donationAmount || parseInt(donationAmount) < 100}
                  >
                    Proceed to Payment
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
            
            {donationType === 'in-kind' && (
              <div className="modal-content">
                <div className="item-categories">
                  <h3>What would you like to donate?</h3>
                  <div className="category-grid">
                    <div className="item-category">
                      <FaBook />
                      <span>Books & Stationery</span>
                    </div>
                    <div className="item-category">
                      <FaUtensils />
                      <span>Food & Groceries</span>
                    </div>
                    <div className="item-category">
                      <FaMedkit />
                      <span>Medical Supplies</span>
                    </div>
                    <div className="item-category">
                      <FaLaptopCode />
                      <span>Electronics</span>
                    </div>
                  </div>
                </div>
                
                <div className="donation-form">
                  <div className="form-group">
                    <label>Item Description</label>
                    <textarea placeholder="Describe the items you want to donate..."></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Pickup Location</label>
                    <input type="text" placeholder="Enter your address" />
                  </div>
                  
                  <button className="proceed-btn">
                    Schedule Pickup
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
            
            {donationType === 'skill' && (
              <div className="modal-content">
                <div className="skill-categories">
                  <h3>How can you help?</h3>
                  <div className="skills-grid">
                    <div className="skill-option">
                      <FaChalkboardTeacher />
                      <span>Teaching & Training</span>
                    </div>
                    <div className="skill-option">
                      <FaLaptopCode />
                      <span>Tech & Development</span>
                    </div>
                    <div className="skill-option">
                      <FaStethoscope />
                      <span>Medical Services</span>
                    </div>
                    <div className="skill-option">
                      <FaTools />
                      <span>Professional Services</span>
                    </div>
                  </div>
                </div>
                
                <div className="donation-form">
                  <div className="form-group">
                    <label>Your Expertise</label>
                    <input type="text" placeholder="e.g., Web Development, Accounting" />
                  </div>
                  
                  <div className="form-group">
                    <label>Availability</label>
                    <select>
                      <option>Weekends Only</option>
                      <option>Weekday Evenings</option>
                      <option>Flexible</option>
                      <option>Project-based</option>
                    </select>
                  </div>
                  
                  <button className="proceed-btn">
                    Connect with NGOs
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboardIntegrated;
