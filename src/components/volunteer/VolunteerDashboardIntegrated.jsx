// VolunteerDashboardIntegrated.jsx - Volunteer Dashboard with Local Storage Integration

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVolunteerDashboard, useRealTimeUpdates } from '../../hooks/useDashboardData';
import localStorageService from '../../services/localStorageService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './VolunteerDashboard.css';
import { logout } from '../../services/authService';

// Icons - Using React Icons
import { 
  FaSearch, FaFilter, FaHeart, FaClock, FaTrophy, FaCalendar,
  FaChartLine, FaUsers, FaHandsHelping, FaBell, FaBookmark,
  FaCertificate, FaGraduationCap, FaMapMarkerAlt, FaShare,
  FaComment, FaDownload, FaStar, FaCheckCircle, FaArrowRight,
  FaLightbulb, FaLeaf, FaChild, FaGlobe, FaMedkit,
  FaHome, FaCog, FaQuestionCircle, FaSignOutAlt
} from 'react-icons/fa';
import { 
  BsGraphUp, BsCalendarEvent, BsAward, BsClockHistory,
  BsBookmarkStar, BsChatDots, BsShare, BsDownload
} from 'react-icons/bs';
import { 
  MdDashboard, MdEventAvailable, MdVolunteerActivism,
  MdTrendingUp, MdNotifications, MdVerified
} from 'react-icons/md';

const VolunteerDashboardIntegrated = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get volunteer ID from auth/session (mock for now)
  const volunteerId = localStorage.getItem('currentUserId') || 'VOL001';
  const volunteerName = localStorage.getItem('currentUserName') || 'John Doe';

  // Use custom hooks
  const {
    opportunities,
    engagements,
    events,
    volunteerEvents,
    impact,
    skills,
    notifications,
    loading,
    joinProject,
    registerForEvent,
    updateHours,
    addSkill,
    searchOpportunities,
    refreshData
  } = useVolunteerDashboard(volunteerId);

  const realTimeUpdates = useRealTimeUpdates(volunteerId, 'volunteer');

  // Filter opportunities based on search and category
  const filteredOpportunities = searchOpportunities(searchQuery, {
    category: selectedFilter === 'all' ? null : selectedFilter
  });

  // Handle project application
  const handleProjectApply = (project) => {
    setSelectedProject(project);
    setShowApplicationModal(true);
  };

  const confirmApplication = () => {
    if (selectedProject) {
      joinProject(selectedProject.id);
      setShowApplicationModal(false);
      setSelectedProject(null);
    }
  };

  // Handle event registration
  const handleEventRegister = (eventId) => {
    registerForEvent(eventId);
  };

  // Handle marking session complete
  const handleSessionComplete = (engagementId, hours) => {
    updateHours(engagementId, hours);
  };

  // Handle adding new skill
  const handleAddSkill = (skillName) => {
    addSkill({
      name: skillName,
      level: 'Beginner'
    });
  };

  // Calculate stats with null checks
  const activeEngagements = engagements ? engagements.filter(e => e.status === 'active').length : 0;
  const completedEngagements = engagements ? engagements.filter(e => e.status === 'completed').length : 0;
  const upcomingEvents = volunteerEvents ? volunteerEvents.filter(e => new Date(e.date) > new Date()).length : 0;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'education': return <FaGraduationCap />;
      case 'health': return <FaMedkit />;
      case 'environment': return <FaLeaf />;
      case 'women empowerment': return <FaUsers />;
      case 'women': return <FaUsers />;
      case 'child': return <FaChild />;
      default: return <FaGlobe />;
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
    <div className="volunteer-dashboard">
      {/* Dynamic Background */}
      <div className="dashboard-bg">
        <div className="bg-gradient-mesh"></div>
        <div className="bg-particles"></div>
        <div className="bg-glow-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar" data-aos="fade-right">
          <div className="sidebar-header">
            <div className="user-profile">
              <div className="user-avatar">
                <span>👤</span>
                <div className="avatar-status active"></div>
              </div>
              <div className="user-info">
                <h3>{volunteerName}</h3>
                <span className="user-role">Volunteer</span>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <MdDashboard />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'opportunities' ? 'active' : ''}`}
              onClick={() => setActiveTab('opportunities')}
            >
              <FaHandsHelping />
              <span>Opportunities</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'engagements' ? 'active' : ''}`}
              onClick={() => setActiveTab('engagements')}
            >
              <BsClockHistory />
              <span>My Engagements</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <BsCalendarEvent />
              <span>Events</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'impact' ? 'active' : ''}`}
              onClick={() => setActiveTab('impact')}
            >
              <BsGraphUp />
              <span>My Impact</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <BsAward />
              <span>Skills & Certificates</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="help-btn">
              <FaLightbulb />
              <span>Need Help?</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Header Bar */}
          <header className="dashboard-header" data-aos="fade-down">
            <div className="header-left">
              <h1 className="page-title">
                {activeTab === 'dashboard' && `Welcome back, ${volunteerName}! 👋`}
                {activeTab === 'opportunities' && 'Discover Opportunities'}
                {activeTab === 'engagements' && 'Your Current Engagements'}
                {activeTab === 'events' && 'Upcoming Events & Drives'}
                {activeTab === 'impact' && 'Your Impact Journey'}
                {activeTab === 'skills' && 'Skills & Achievements'}
              </h1>
              <p className="page-subtitle">
                {activeTab === 'dashboard' && 'Make an impact today. Find projects that need your help.'}
                {activeTab === 'opportunities' && 'Projects matching your skills and interests'}
                {activeTab === 'engagements' && 'Track your ongoing volunteer activities'}
                {activeTab === 'events' && 'Join community events and make a difference'}
                {activeTab === 'impact' && 'See the difference you\'ve made'}
                {activeTab === 'skills' && 'Your growth and certifications'}
              </p>
            </div>
            
            <div className="header-right">
              {/* Search Bar */}
              {(activeTab === 'opportunities' || activeTab === 'events') && (
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search projects, events..."
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

              {/* Settings Button */}
              <button 
                className="settings-btn"
                onClick={() => console.log('Settings clicked')}
                title="Settings"
              >
                <FaCog />
              </button>

              {/* Help Center Button */}
              <button 
                className="help-center-btn"
                onClick={() => console.log('Help Center clicked')}
                title="Help Center"
              >
                <FaQuestionCircle />
              </button>

              {/* Notifications */}
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
                  <div className="notification-dropdown">
                    <h4>Notifications</h4>
                    {realTimeUpdates && realTimeUpdates.length > 0 ? (
                      realTimeUpdates.map(notification => (
                        <div 
                          key={notification.id} 
                          className="notification-item unread"
                          onClick={() => {
                            localStorageService.markNotificationAsRead(notification.id);
                            refreshData();
                          }}
                        >
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
                    <button className="view-all-btn">View All Notifications</button>
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

              {/* Quick Action */}
              <button 
                className="cta-button primary"
                onClick={() => setActiveTab('opportunities')}
              >
                Find Opportunities
                <FaArrowRight />
              </button>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="dashboard-content">
            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-overview">
                {/* Stats Cards */}
                <div className="stats-grid" data-aos="fade-up">
                  <div className="stat-card gradient-1">
                    <div className="stat-icon">
                      <FaClock />
                    </div>
                    <div className="stat-content">
                      <h3>{impact?.totalHours || 0}</h3>
                      <p>Total Hours</p>
                    </div>
                    <div className="stat-chart">
                      <div className="mini-chart"></div>
                    </div>
                  </div>

                  <div className="stat-card gradient-2">
                    <div className="stat-icon">
                      <FaHandsHelping />
                    </div>
                    <div className="stat-content">
                      <h3>{activeEngagements}</h3>
                      <p>Active Projects</p>
                    </div>
                    <div className="stat-chart">
                      <div className="mini-chart"></div>
                    </div>
                  </div>

                  <div className="stat-card gradient-3">
                    <div className="stat-icon">
                      <FaTrophy />
                    </div>
                    <div className="stat-content">
                      <h3>{completedEngagements}</h3>
                      <p>Completed</p>
                    </div>
                    <div className="stat-chart">
                      <div className="mini-chart"></div>
                    </div>
                  </div>

                  <div className="stat-card gradient-4">
                    <div className="stat-icon">
                      <BsCalendarEvent />
                    </div>
                    <div className="stat-content">
                      <h3>{upcomingEvents}</h3>
                      <p>Upcoming Events</p>
                    </div>
                    <div className="stat-chart">
                      <div className="mini-chart"></div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="quick-actions" data-aos="fade-up" data-aos-delay="100">
                  <h2 className="section-title">Quick Actions</h2>
                  <div className="action-cards">
                    <button className="action-card" onClick={() => setActiveTab('opportunities')}>
                      <div className="action-icon">
                        <FaSearch />
                      </div>
                      <h4>Find Projects</h4>
                      <p>Discover new opportunities</p>
                    </button>
                    
                    <button className="action-card" onClick={() => setActiveTab('events')}>
                      <div className="action-icon">
                        <FaCalendar />
                      </div>
                      <h4>Browse Events</h4>
                      <p>Join upcoming drives</p>
                    </button>
                    
                    <button className="action-card" onClick={() => setActiveTab('skills')}>
                      <div className="action-icon">
                        <FaCertificate />
                      </div>
                      <h4>Get Certificate</h4>
                      <p>Download achievements</p>
                    </button>
                    
                    <button className="action-card" onClick={() => setActiveTab('impact')}>
                      <div className="action-icon">
                        <FaChartLine />
                      </div>
                      <h4>View Impact</h4>
                      <p>Track your contribution</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity" data-aos="fade-up" data-aos-delay="200">
                  <h2 className="section-title">Recent Activity</h2>
                  <div className="activity-timeline">
                    {engagements && engagements.length > 0 ? (
                      engagements.slice(0, 3).map((engagement, index) => (
                        <div key={engagement.id} className="timeline-item">
                          <div className="timeline-icon success">
                            <FaCheckCircle />
                          </div>
                          <div className="timeline-content">
                            <h4>Joined: {engagement.projectTitle}</h4>
                            <p>{engagement.ngoName} • {new Date(engagement.startDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div className="opportunities-section">
                {/* Filters */}
                <div className="filters-bar" data-aos="fade-down">
                  <div className="filter-chips">
                    <button
                      className={`filter-chip ${selectedFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedFilter('all')}
                    >
                      All Categories
                    </button>
                    <button
                      className={`filter-chip ${selectedFilter === 'education' ? 'active' : ''}`}
                      onClick={() => setSelectedFilter('education')}
                    >
                      <FaGraduationCap /> Education
                    </button>
                    <button
                      className={`filter-chip ${selectedFilter === 'health' ? 'active' : ''}`}
                      onClick={() => setSelectedFilter('health')}
                    >
                      <FaMedkit /> Health
                    </button>
                    <button
                      className={`filter-chip ${selectedFilter === 'environment' ? 'active' : ''}`}
                      onClick={() => setSelectedFilter('environment')}
                    >
                      <FaLeaf /> Environment
                    </button>
                    <button
                      className={`filter-chip ${selectedFilter === 'women' ? 'active' : ''}`}
                      onClick={() => setSelectedFilter('women')}
                    >
                      <FaUsers /> Women
                    </button>
                  </div>
                  
                  <button className="advanced-filter-btn">
                    <FaFilter /> Advanced Filters
                  </button>
                </div>

                {/* Project Cards Grid */}
                <div className="projects-grid" data-aos="fade-up">
                  {filteredOpportunities && filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((project, index) => (
                      <div 
                        key={project.id} 
                        className="project-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="project-image">
                          <img src={project.image} alt={project.title} />
                          <div className="project-category">
                            {getCategoryIcon(project.category)}
                            <span>{project.category}</span>
                          </div>
                          {project.urgency === 'high' && (
                            <div className="urgency-badge">Urgent</div>
                          )}
                        </div>
                        
                        <div className="project-content">
                          <h3>{project.title}</h3>
                          <div className="project-ngo">
                            <MdVerified className="verified-icon" />
                            <span>{project.ngoName}</span>
                          </div>
                          
                          <div className="project-meta">
                            <div className="meta-item">
                              <FaMapMarkerAlt />
                              <span>{project.location}</span>
                            </div>
                            <div className="meta-item">
                              <FaClock />
                              <span>{project.endDate}</span>
                            </div>
                          </div>
                          
                          <div className="project-skills">
                            <span className="skills-label">Skills needed:</span>
                            <div className="skill-tags">
                              {project.skillsNeeded && project.skillsNeeded.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="project-footer">
                            <div className="participants">
                              <FaUsers />
                              <span>
                                {project.volunteersJoined?.length || 0}/{project.volunteersNeeded} volunteers
                              </span>
                            </div>
                            
                            {/* Check if already joined */}
                            {project.volunteersJoined?.some(v => v.volunteerId === volunteerId) ? (
                              <button className="applied-btn" disabled>
                                <FaCheckCircle /> Already Joined
                              </button>
                            ) : (
                              <button 
                                className="apply-btn"
                                onClick={() => handleProjectApply(project)}
                              >
                                Apply Now
                                <FaArrowRight />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No opportunities found. Try adjusting your filters.</p>
                    </div>
                  )}
                </div>

                {/* Load More */}
                <div className="load-more-section">
                  <button className="load-more-btn">
                    Load More Projects
                  </button>
                </div>
              </div>
            )}

            {/* Current Engagements Tab */}
            {activeTab === 'engagements' && (
              <div className="engagements-section">
                <div className="engagements-list">
                  {engagements && engagements.filter(e => e.status === 'active').length > 0 ? (
                    engagements.filter(e => e.status === 'active').map((engagement, index) => (
                      <div 
                        key={engagement.id} 
                        className="engagement-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="engagement-header">
                          <div className="engagement-info">
                            <h3>{engagement.projectTitle}</h3>
                            <p className="ngo-name">{engagement.ngoName}</p>
                          </div>
                          <div className="engagement-actions">
                            <button className="action-btn">
                              <BsChatDots />
                              <span>Message NGO</span>
                            </button>
                            <button className="action-btn">
                              <BsShare />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="engagement-details">
                          <div className="detail-item">
                            <span className="label">Task Assigned:</span>
                            <span className="value">{engagement.task || 'General Volunteer'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Hours Completed:</span>
                            <span className="value">{engagement.hours || 0} hours</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Status:</span>
                            <span className="value status-active">{engagement.status}</span>
                          </div>
                        </div>
                        
                        <div className="progress-section">
                          <div className="progress-header">
                            <span>Progress</span>
                            <span>{engagement.progress || 0}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${engagement.progress || 0}%` }}
                            >
                              <div className="progress-glow"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="engagement-footer">
                          <button 
                            className="complete-btn"
                            onClick={() => handleSessionComplete(engagement.id, 2)}
                          >
                            Log 2 Hours
                          </button>
                          <button className="certificate-btn">
                            Request Certificate
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No active engagements. Start by applying to projects!</p>
                      <button onClick={() => setActiveTab('opportunities')}>
                        Browse Opportunities
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="events-section">
                <div className="events-calendar">
                  {events && events.length > 0 ? (
                    events.map((event, index) => (
                      <div 
                        key={event.id}
                        className="event-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="event-date">
                          <span className="day">{new Date(event.date).getDate()}</span>
                          <span className="month">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                        
                        <div className="event-content">
                          <div className="event-category">
                            {getCategoryIcon(event.category)}
                            <span>{event.category}</span>
                          </div>
                          
                          <h3>{event.title}</h3>
                          <p className="event-ngo">{event.ngoName}</p>
                          
                          <div className="event-details">
                            <div className="detail">
                              <FaClock />
                              <span>{event.time}</span>
                            </div>
                            <div className="detail">
                              <FaMapMarkerAlt />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          {/* Check if already registered */}
                          {event.registered?.some(r => r.userId === volunteerId) ? (
                            <button className="registered-btn" disabled>
                              <FaCheckCircle /> Registered
                            </button>
                          ) : (
                            <button 
                              className="register-btn"
                              onClick={() => handleEventRegister(event.id)}
                            >
                              Register Now
                              <FaArrowRight />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No upcoming events available.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Impact Tab */}
            {activeTab === 'impact' && (
              <div className="impact-section">
                {/* Impact Overview */}
                <div className="impact-overview" data-aos="fade-up">
                  <h2 className="section-title">Your Impact Summary</h2>
                  <div className="impact-stats">
                    <div className="impact-stat">
                      <div className="stat-value">{impact?.totalHours || 0}</div>
                      <div className="stat-label">Total Hours</div>
                      <div className="stat-comparison">+12% this month</div>
                    </div>
                    <div className="impact-stat">
                      <div className="stat-value">500+</div>
                      <div className="stat-label">Lives Impacted</div>
                      <div className="stat-comparison">Direct beneficiaries</div>
                    </div>
                    <div className="impact-stat">
                      <div className="stat-value">15</div>
                      <div className="stat-label">NGOs Supported</div>
                      <div className="stat-comparison">Across 5 causes</div>
                    </div>
                  </div>
                </div>

                {/* Monthly Chart */}
                <div className="impact-chart-container" data-aos="fade-up" data-aos-delay="100">
                  <h3>Volunteer Hours - Last 6 Months</h3>
                  <div className="chart-wrapper">
                    <div className="bar-chart">
                      {[8, 12, 6, 10, 14, 8].map((hours, index) => (
                        <div key={index} className="chart-bar">
                          <div 
                            className="bar"
                            style={{ height: `${(hours / 14) * 100}%` }}
                            data-hours={hours}
                          >
                            <span className="bar-value">{hours}h</span>
                          </div>
                          <span className="bar-label">
                            {new Date(Date.now() - (5 - index) * 30 * 24 * 60 * 60 * 1000)
                              .toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Causes Distribution */}
                <div className="causes-distribution" data-aos="fade-up" data-aos-delay="200">
                  <h3>Causes You've Supported</h3>
                  <div className="causes-chart">
                    <div className="pie-chart">
                      {/* Simple representation - replace with actual chart library */}
                      <div className="chart-center">
                        <span className="total">12</span>
                        <span className="label">Projects</span>
                      </div>
                    </div>
                    <div className="causes-legend">
                      <div className="legend-item">
                        <span className="color education"></span>
                        <span>Education (35%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="color health"></span>
                        <span>Health (25%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="color environment"></span>
                        <span>Environment (20%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="color women"></span>
                        <span>Women Empowerment (20%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills & Certificates Tab */}
            {activeTab === 'skills' && (
              <div className="skills-section">
                {/* Skills Overview */}
                <div className="skills-overview" data-aos="fade-up">
                  <h2 className="section-title">Your Skills</h2>
                  <div className="skills-grid">
                    {skills && skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <div key={skill.id} className="skill-card">
                          <div className="skill-icon">
                            <FaStar />
                          </div>
                          <span>{skill.name}</span>
                        </div>
                      ))
                    ) : (
                      <p>No skills added yet.</p>
                    )}
                    <button 
                      className="add-skill-btn"
                      onClick={() => {
                        const skillName = prompt('Enter new skill:');
                        if (skillName) handleAddSkill(skillName);
                      }}
                    >
                      <span>+ Add New Skill</span>
                    </button>
                  </div>
                </div>

                {/* Badges Section */}
                <div className="badges-section" data-aos="fade-up" data-aos-delay="100">
                  <h2 className="section-title">Earned Badges</h2>
                  <div className="badges-grid">
                    {['Community Hero', '50 Hour Milestone', 'Environmental Champion'].map((badge, index) => (
                      <div key={index} className="badge-card">
                        <div className="badge-icon">
                          <FaTrophy />
                        </div>
                        <h4>{badge}</h4>
                        <p>Earned on {new Date().toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates Section */}
                <div className="certificates-section" data-aos="fade-up" data-aos-delay="200">
                  <h2 className="section-title">Your Certificates</h2>
                  <div className="certificates-list">
                    {[1, 2, 3, 4].map(cert => (
                      <div key={cert} className="certificate-card">
                        <div className="certificate-icon">
                          <FaCertificate />
                        </div>
                        <div className="certificate-info">
                          <h4>Community Service Certificate</h4>
                          <p>Issued by Green Earth Initiative</p>
                          <p className="date">Jan 15, 2024</p>
                        </div>
                        <button className="download-btn">
                          <BsDownload />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowApplicationModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply to Project</h2>
              <button className="close-btn" onClick={() => setShowApplicationModal(false)}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <h3>{selectedProject.title}</h3>
              <p>{selectedProject.description}</p>
              
              <div className="project-requirements">
                <h4>Required Skills:</h4>
                <div className="skill-tags">
                  {selectedProject.skillsNeeded && selectedProject.skillsNeeded.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              
              <p className="confirm-text">
                Are you sure you want to apply for this project?
              </p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowApplicationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={confirmApplication}
              >
                Confirm Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboardIntegrated;
