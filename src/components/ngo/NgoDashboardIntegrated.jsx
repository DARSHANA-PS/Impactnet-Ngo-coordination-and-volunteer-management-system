// NgoDashboardIntegrated.jsx - NGO Dashboard with Local Storage Integration

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNgoDashboard, useRealTimeUpdates, useMessaging } from '../../hooks/useDashboardData';
import localStorageService from '../../services/localStorageService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './NgoDashboard.css';
import { logout } from '../../services/authService';

// Icons
import { 
  FaProjectDiagram, FaUsers, FaHandsHelping, FaChartLine, FaBell,
  FaCalendarAlt, FaDollarSign, FaShare, FaComments, FaPlus,
  FaTrophy, FaCog, FaGlobe, FaHeart, FaClipboardList, FaArrowRight,
  FaCheckCircle, FaClock, FaMapMarkerAlt, FaStar, FaEnvelope,
  FaDownload, FaUpload, FaEdit, FaTrash, FaEye, FaSearch,
  FaFilter, FaFileAlt, FaUserPlus, FaBullhorn, FaLightbulb,
  FaChartPie, FaHome, FaSignOutAlt, FaQuestionCircle
} from 'react-icons/fa';
import { 
  MdDashboard, MdVolunteerActivism, MdCampaign, MdAnalytics,
  MdEvent, MdMessage, MdNotifications, MdVerified, MdTrendingUp
} from 'react-icons/md';
import { 
  BsGraphUp, BsCalendarEvent, BsPeopleFill, BsCashStack,
  BsShareFill, BsChatDotsFill, BsBarChartFill
} from 'react-icons/bs';

const NgoDashboardIntegrated = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'project', 'event', 'fundraiser'
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get NGO ID from auth/session (mock for now)
  const ngoId = localStorage.getItem('currentUserId') || 'NGO001';
  const ngoName = localStorage.getItem('currentUserName') || 'Green Earth Initiative';

  // Use custom hooks for data
  const {
    projects,
    volunteers,
    fundraisers,
    events,
    resources,
    analytics,
    notifications,
    loading,
    createProject,
    updateProject,
    createFundraiser,
    createEvent,
    shareResource,
    sendAnnouncement,
    refreshData
  } = useNgoDashboard(ngoId);

  const realTimeUpdates = useRealTimeUpdates(ngoId, 'ngo');
  const { messages, unreadCount, sendMessage, markAsRead } = useMessaging(ngoId);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'Environment',
    location: '',
    startDate: '',
    endDate: '',
    skillsNeeded: '',
    volunteersNeeded: 10,
    fundGoal: 50000,
    urgency: 'medium',
    image: 'https://images.unsplash.com/photo-1558618047-f5cb0c2b8f81?w=400'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'Environment',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50
  });

  const [fundraiserForm, setFundraiserForm] = useState({
    title: '',
    description: '',
    category: 'General',
    goal: 100000,
    endDate: ''
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  // Handle form submissions
  const handleCreateProject = (e) => {
    e.preventDefault();
    const projectData = {
      ...projectForm,
      ngoName,
      skillsNeeded: projectForm.skillsNeeded.split(',').map(s => s.trim()),
      status: 'active',
      volunteersJoined: [],
      fundRaised: 0
    };
    createProject(projectData);
    setShowCreateModal(false);
    resetForms();
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const eventData = {
      ...eventForm,
      ngoName,
      status: 'upcoming'
    };
    createEvent(eventData);
    setShowCreateModal(false);
    resetForms();
  };

  const handleCreateFundraiser = (e) => {
    e.preventDefault();
    
    // Create fundraiser data with all required fields
    const fundraiserData = {
      ...fundraiserForm,
      ngoId: ngoId,
      ngoName: ngoName,
      status: 'active',
      raised: 0,  // Initial raised amount = 0
      donors: [], // Empty donors list
      startDate: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400'
    };
    
    // Store the campaign using the service
    createFundraiser(fundraiserData);
    
    // Create a unique ID for the campaign
    const campaignId = `CAMP_${Date.now()}`;
    
    // Also store in a general campaigns collection for easy access
    localStorageService.create('campaigns', {
      ...fundraiserData,
      id: campaignId
    });
    
    // Create notification
    localStorageService.createNotification({
      type: 'campaign_created',
      title: 'Campaign Created Successfully!',
      message: `Your campaign "${fundraiserData.title}" is now live!`,
      targetNgoId: ngoId
    });
    
    setShowCreateModal(false);
    resetForms();
    
    // Show success message
    alert('Campaign created successfully! Redirecting to campaigns page...');
    
    // Navigate to campaigns page after a short delay
    setTimeout(() => {
      navigate('/campaigns');
    }, 1500);
  };

  const resetForms = () => {
    setProjectForm({
      title: '',
      description: '',
      category: 'Environment',
      location: '',
      startDate: '',
      endDate: '',
      skillsNeeded: '',
      volunteersNeeded: 10,
      fundGoal: 50000,
      urgency: 'medium',
      image: 'https://images.unsplash.com/photo-1558618047-f5cb0c2b8f81?w=400'
    });
    setEventForm({
      title: '',
      description: '',
      category: 'Environment',
      date: '',
      time: '',
      location: '',
      maxParticipants: 50
    });
    setFundraiserForm({
      title: '',
      description: '',
      category: 'General',
      goal: 100000,
      endDate: ''
    });
  };

  const handleProjectUpdate = (projectId, updates) => {
    updateProject(projectId, updates);
  };

  const handleVolunteerMessage = (volunteerId, volunteerName) => {
    const message = {
      subject: 'Thank you for volunteering!',
      message: `Dear ${volunteerName}, thank you for your interest in our projects.`
    };
    sendMessage(volunteerId, message);
  };

  const handleResourceShare = () => {
    const resourceData = {
      name: 'Community Hall',
      type: 'Venue',
      description: 'Available for NGO events',
      capacity: '100 people'
    };
    shareResource(resourceData);
  };

  const handleAnnouncement = (title, message, targetAudience) => {
    sendAnnouncement({
      title,
      message,
      targetAudience,
      priority: 'normal'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate additional stats
  const totalVolunteers = projects.reduce((sum, p) => 
    sum + (p.volunteersJoined?.length || 0), 0
  );

  const totalFundsRaised = fundraisers.reduce((sum, f) => sum + (f.raised || 0), 0);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'environment': return <FaGlobe />;
      case 'education': return <FaClipboardList />;
      case 'healthcare': return <FaHeart />;
      case 'meeting': return <FaUsers />;
      default: return <FaProjectDiagram />;
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
    <div className="ngo-dashboard">
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
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar" data-aos="fade-right">
          <div className="sidebar-header">
            <div className="ngo-profile">
              <div className="ngo-logo">
                <span>🌱</span>
                <div className="verified-badge">
                  <MdVerified />
                </div>
              </div>
              <div className="ngo-info">
                <h3>{ngoName}</h3>
                <span className="ngo-id">NGO/2023/0456</span>
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
              className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}
              onClick={() => handleSectionChange('projects')}
            >
              <FaProjectDiagram />
              <span>Projects</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'volunteers' ? 'active' : ''}`}
              onClick={() => handleSectionChange('volunteers')}
            >
              <MdVolunteerActivism />
              <span>Volunteers</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`}
              onClick={() => handleSectionChange('resources')}
            >
              <FaShare />
              <span>Resources</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'fundraising' ? 'active' : ''}`}
              onClick={() => handleSectionChange('fundraising')}
            >
              <FaDollarSign />
              <span>Fundraising</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'events' ? 'active' : ''}`}
              onClick={() => handleSectionChange('events')}
            >
              <BsCalendarEvent />
              <span>Events</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'impact' ? 'active' : ''}`}
              onClick={() => handleSectionChange('impact')}
            >
              <MdAnalytics />
              <span>Impact</span>
              <div className="nav-indicator"></div>
            </button>
            
            <button
              className={`nav-item ${activeSection === 'communications' ? 'active' : ''}`}
              onClick={() => handleSectionChange('communications')}
            >
              <BsChatDotsFill />
              <span>Communications</span>
              {unreadCount > 0 && (
                <span className="nav-badge">{unreadCount}</span>
              )}
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
          {/* Header Bar */}
          <header className="dashboard-header" data-aos="fade-down">
            <div className="header-left">
              <h1 className="page-title">
                {activeSection === 'dashboard' && `Welcome back, ${ngoName}! 👋`}
                {activeSection === 'projects' && 'Project Management'}
                {activeSection === 'volunteers' && 'Volunteer Management'}
                {activeSection === 'resources' && 'Resource Sharing Hub'}
                {activeSection === 'fundraising' && 'Fundraising Campaigns'}
                {activeSection === 'events' && 'Events & Drives'}
                {activeSection === 'impact' && 'Impact Analytics'}
                {activeSection === 'communications' && 'Communications Center'}
              </h1>
              <p className="page-subtitle">
                {activeSection === 'dashboard' && 'Collaborate. Empower. Create Lasting Impact.'}
                {activeSection === 'projects' && 'Create and manage your social impact projects'}
                {activeSection === 'volunteers' && 'Find and manage volunteers for your projects'}
                {activeSection === 'resources' && 'Share and request resources with other NGOs'}
                {activeSection === 'fundraising' && 'Create and track fundraising campaigns'}
                {activeSection === 'events' && 'Organize and promote your events'}
                {activeSection === 'impact' && 'Track and visualize your social impact'}
                {activeSection === 'communications' && 'Connect with volunteers and donors'}
              </p>
            </div>

            <div className="header-right">
              {/* Search Bar */}
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search projects, volunteers..."
                  className="search-input"
                />
              </div>

              {/* Home Button */}
              <button 
                className="home-btn"
                onClick={() => navigate('/')}
                title="Go to Home"
              >
                <FaHome />
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
                  <div className="notification-dropdown" data-aos="fade-in">
                    <div className="notification-header">
                      <h4>Notifications</h4>
                      <button 
                        className="mark-all-read"
                        onClick={() => {
                          realTimeUpdates.forEach(n => 
                            localStorageService.markNotificationAsRead(n.id)
                          );
                          refreshData();
                        }}
                      >
                        Mark all as read
                      </button>
                    </div>
                    
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
                          <div className="notification-icon">
                            {notification.type === 'volunteer_joined' && <FaUsers />}
                            {notification.type === 'new_donation' && <FaDollarSign />}
                            {notification.type === 'resource_request' && <FaShare />}
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
                className="create-btn primary"
                onClick={() => {
                  setModalType('project');
                  setShowCreateModal(true);
                }}
              >
                <FaPlus />
                Create Project
              </button>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="dashboard-content">
            {/* Dashboard Overview with real data */}
            {activeSection === 'dashboard' && (
              <div className="dashboard-overview">
                {/* Stats Cards with real analytics */}
                <div className="stats-grid" data-aos="fade-up">
                  <div className="stat-card gradient-1">
                    <div className="stat-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="stat-content">
                      <h3>{analytics?.activeProjects || 0}</h3>
                      <p>Active Projects</p>
                      <span className="stat-change positive">+12% from last month</span>
                    </div>
                    <div className="stat-sparkline">
                      <div className="sparkline-bar" style={{height: '40%'}}></div>
                      <div className="sparkline-bar" style={{height: '60%'}}></div>
                      <div className="sparkline-bar" style={{height: '45%'}}></div>
                      <div className="sparkline-bar" style={{height: '80%'}}></div>
                      <div className="sparkline-bar" style={{height: '70%'}}></div>
                    </div>
                  </div>

                  <div className="stat-card gradient-2">
                    <div className="stat-icon">
                      <FaUsers />
                    </div>
                    <div className="stat-content">
                      <h3>{totalVolunteers}</h3>
                      <p>Total Volunteers</p>
                      <span className="stat-change positive">+25% from last month</span>
                    </div>
                  </div>

                  <div className="stat-card gradient-3">
                    <div className="stat-icon">
                      <FaDollarSign />
                    </div>
                    <div className="stat-content">
                      <h3>{formatCurrency(totalFundsRaised)}</h3>
                      <p>Funds Raised</p>
                      <span className="stat-change positive">+18% from last month</span>
                    </div>
                  </div>

                  <div className="stat-card gradient-4">
                    <div className="stat-icon">
                      <FaTrophy />
                    </div>
                    <div className="stat-content">
                      <h3>92%</h3>
                      <p>Impact Score</p>
                      <span className="stat-change positive">Excellent</span>
                    </div>
                    <div className="circular-progress">
                      <svg viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeDasharray="92, 100"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions" data-aos="fade-up" data-aos-delay="100">
                  <h2 className="section-title">Quick Actions</h2>
                  <div className="action-grid">
                    <button className="action-card" onClick={() => handleSectionChange('projects')}>
                      <div className="action-icon">
                        <FaPlus />
                      </div>
                      <h4>Create Project</h4>
                      <p>Start a new initiative</p>
                      <div className="action-arrow">
                        <FaArrowRight />
                      </div>
                    </button>

                    <button className="action-card" onClick={() => handleSectionChange('volunteers')}>
                      <div className="action-icon">
                        <FaUserPlus />
                      </div>
                      <h4>Find Volunteers</h4>
                      <p>Match skills with needs</p>
                      <div className="action-arrow">
                        <FaArrowRight />
                      </div>
                    </button>

                    <button className="action-card" onClick={() => handleSectionChange('fundraising')}>
                      <div className="action-icon">
                        <FaDollarSign />
                      </div>
                      <h4>Start Campaign</h4>
                      <p>Raise funds for causes</p>
                      <div className="action-arrow">
                        <FaArrowRight />
                      </div>
                    </button>

                    <button className="action-card" onClick={() => handleSectionChange('events')}>
                      <div className="action-icon">
                        <FaCalendarAlt />
                      </div>
                      <h4>Schedule Event</h4>
                      <p>Organize community drives</p>
                      <div className="action-arrow">
                        <FaArrowRight />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Projects with real data */}
                <div className="recent-projects" data-aos="fade-up" data-aos-delay="200">
                  <div className="section-header">
                    <h2 className="section-title">Recent Projects</h2>
                    <button 
                      className="view-all-btn" 
                      onClick={() => handleSectionChange('projects')}
                    >
                      View All
                      <FaArrowRight />
                    </button>
                  </div>
                  
                  <div className="projects-preview">
                    {projects && projects.length > 0 ? (
                      projects.slice(0, 3).map((project, index) => (
                        <div 
                          key={project.id} 
                          className="project-preview-card"
                          data-aos="fade-up"
                          data-aos-delay={index * 100}
                        >
                          <div className="project-preview-image">
                            <img src={project.image} alt={project.title} />
                            <div className="project-status-badge">
                              {project.status}
                            </div>
                          </div>
                          <div className="project-preview-content">
                            <h4>{project.title}</h4>
                            <div className="project-preview-meta">
                              <span><FaMapMarkerAlt /> {project.location}</span>
                              <span>
                                <FaUsers /> {project.volunteersJoined?.length || 0} volunteers
                              </span>
                            </div>
                            <div className="project-progress">
                              <div className="progress-header">
                                <span>Progress</span>
                                <span>
                                  {Math.round((project.fundRaised / project.fundGoal) * 100)}%
                                </span>
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill"
                                  style={{ 
                                    width: `${(project.fundRaised / project.fundGoal) * 100}%` 
                                  }}
                                >
                                  <div className="progress-glow"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No projects yet. Create your first project!</p>
                    )}
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="impact-summary" data-aos="fade-up" data-aos-delay="300">
                  <h2 className="section-title">Your Impact This Month</h2>
                  <div className="impact-cards">
                    <div className="impact-card">
                      <div className="impact-icon">
                        <FaHandsHelping />
                      </div>
                      <h3>5,000</h3>
                      <p>Lives Impacted</p>
                    </div>
                    <div className="impact-card">
                      <div className="impact-icon">
                        <FaGlobe />
                      </div>
                      <h3>15</h3>
                      <p>Communities Reached</p>
                    </div>
                    <div className="impact-card">
                      <div className="impact-icon">
                        <FaStar />
                      </div>
                      <h3>4.8</h3>
                      <p>Volunteer Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Section with real data */}
            {activeSection === 'projects' && (
              <div className="projects-section">
                <div className="section-actions">
                  <button 
                    className="create-new-btn"
                    onClick={() => {
                      setModalType('project');
                      setShowCreateModal(true);
                    }}
                  >
                    <FaPlus /> Create New Project
                  </button>
                </div>

                <div className="projects-grid">
                  {projects && projects.length > 0 ? (
                    projects.map((project, index) => (
                      <div 
                        key={project.id}
                        className="project-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="project-header">
                          <img src={project.image} alt={project.title} />
                          <div className="project-overlay">
                            <div className="project-status">
                              {project.status === 'active' ? (
                                <><FaCheckCircle /> Active</>
                              ) : (
                                <><FaClock /> {project.status}</>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="project-content">
                          <h3>{project.title}</h3>
                          <p className="project-location">
                            <FaMapMarkerAlt /> {project.location}
                          </p>
                          
                          <div className="project-skills">
                            <span className="skills-label">Required Skills:</span>
                            <div className="skill-tags">
                              {project.skillsNeeded && project.skillsNeeded.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="project-stats">
                            <div className="stat">
                              <FaUsers />
                              <span>
                                {project.volunteersJoined?.length || 0}/{project.volunteersNeeded} Volunteers
                              </span>
                            </div>
                            <div className="stat">
                              <FaDollarSign />
                              <span>
                                {formatCurrency(project.fundRaised || 0)} raised
                              </span>
                            </div>
                          </div>
                          
                          <div className="project-progress-section">
                            <div className="progress-header">
                              <span>Progress</span>
                              <span>{Math.round((project.fundRaised / project.fundGoal) * 100)}%</span>
                            </div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${(project.fundRaised / project.fundGoal) * 100}%` }}
                              >
                                <div className="progress-glow"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="project-actions">
                            <button className="btn-secondary">
                              <FaEye /> View Details
                            </button>
                            <button className="btn-primary">
                              <FaEdit /> Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No projects yet. Create your first project!</p>
                    </div>
                  )}
                  
                  {/* Add New Project Card */}
                  <div 
                    className="add-project-card"
                    data-aos="fade-up"
                    onClick={() => {
                      setModalType('project');
                      setShowCreateModal(true);
                    }}
                  >
                    <div className="add-project-icon">
                      <FaPlus />
                    </div>
                    <h3>Create New Project</h3>
                    <p>Start a new initiative to create impact</p>
                  </div>
                </div>
              </div>
            )}

            {/* Volunteers Section with real data */}
            {activeSection === 'volunteers' && (
              <div className="volunteers-section">
                {/* AI Matching Banner */}
                <div className="ai-matching-banner" data-aos="fade-up">
                  <div className="ai-icon">
                    <FaLightbulb />
                  </div>
                  <div className="ai-content">
                    <h3>AI-Powered Volunteer Matching</h3>
                    <p>Our AI engine suggests the best volunteers based on your project requirements</p>
                  </div>
                  <button className="ai-match-btn">
                    Find Best Matches
                    <FaArrowRight />
                  </button>
                </div>

                <div className="volunteers-table" data-aos="fade-up">
                  <table>
                    <thead>
                      <tr>
                        <th>Volunteer</th>
                        <th>Project</th>
                        <th>Joined Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects && projects.length > 0 ? (
                        projects.map(project => 
                          project.volunteersJoined?.map((volunteer, index) => (
                            <tr key={`${project.id}-${volunteer.volunteerId}`}>
                              <td>
                                <div className="volunteer-info">
                                  <div className="volunteer-avatar">👤</div>
                                  <span>{volunteer.name}</span>
                                </div>
                              </td>
                              <td>{project.title}</td>
                              <td>{new Date(volunteer.joinedAt).toLocaleDateString()}</td>
                              <td>
                                <span className={`status ${volunteer.status}`}>
                                  {volunteer.status}
                                </span>
                              </td>
                              <td>
                                <div className="table-actions">
                                  <button 
                                    className="action-btn message"
                                    onClick={() => handleVolunteerMessage(
                                      volunteer.volunteerId, 
                                      volunteer.name
                                    )}
                                  >
                                    <FaEnvelope /> Message
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ).filter(Boolean)
                      ) : (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <p>No volunteers have joined your projects yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {activeSection === 'resources' && (
              <div className="resources-section">
                <div className="resources-tabs" data-aos="fade-down">
                  <button className="resource-tab active">My Resources</button>
                  <button className="resource-tab">Available Resources</button>
                  <button className="resource-tab">Requests</button>
                </div>

                <div className="resources-grid">
                  {resources && resources.length > 0 ? (
                    resources.map((resource, index) => (
                      <div 
                        key={resource.id}
                        className="resource-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="resource-header">
                          <div className="resource-type">
                            {resource.type === 'Venue' && <FaHome />}
                            {resource.type === 'Equipment' && <FaCog />}
                            {resource.type === 'Vehicle' && <FaShare />}
                            <span>{resource.type}</span>
                          </div>
                          <div className={`resource-status ${resource.availability?.toLowerCase()}`}>
                            {resource.availability}
                          </div>
                        </div>
                        
                        <h3>{resource.name}</h3>
                        <p>Shared by: {resource.sharedBy || 'Anonymous'}</p>
                        
                        <div className="resource-actions">
                          {resource.availability === 'Available' ? (
                            <button className="btn-primary">Request Resource</button>
                          ) : (
                            <button className="btn-secondary" disabled>In Use</button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No resources available.</p>
                  )}
                  
                  <div className="add-resource-card" data-aos="fade-up">
                    <FaPlus />
                    <h3>Share a Resource</h3>
                    <p>Help other NGOs by sharing</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fundraising Section with real data - UPDATED */}
            {activeSection === 'fundraising' && (
              <div className="fundraising-section">
                <div className="section-actions">
                  <button 
                                        className="create-new-btn"
                    onClick={() => {
                      setModalType('fundraiser');
                      setShowCreateModal(true);
                    }}
                  >
                    <FaPlus /> Create Campaign
                  </button>
                  
                  {/* Add button to view all campaigns */}
                  <button 
                    className="view-campaigns-btn"
                    onClick={() => navigate('/campaigns')}
                  >
                    <FaEye /> View Public Page
                  </button>
                </div>

                <div className="campaigns-overview" data-aos="fade-up">
                  <h2 className="section-title">Active Campaigns</h2>
                  <div className="campaigns-grid">
                    {fundraisers && fundraisers.length > 0 ? (
                      fundraisers.map((campaign, index) => (
                        <div 
                          key={campaign.id}
                          className="campaign-card"
                          data-aos="fade-up"
                          data-aos-delay={index * 100}
                        >
                          <div className="campaign-header">
                            <h3>{campaign.title}</h3>
                            <span className={`campaign-status ${campaign.status}`}>
                              {campaign.status}
                            </span>
                          </div>
                          
                          <div className="campaign-progress">
                            <div className="campaign-amounts">
                              <div className="raised">
                                <h4>{formatCurrency(campaign.raised || 0)}</h4>
                                <p>Raised</p>
                              </div>
                              <div className="goal">
                                <h4>{formatCurrency(campaign.goal)}</h4>
                                <p>Goal</p>
                              </div>
                            </div>
                            
                            <div className="progress-bar large">
                              <div 
                                className="progress-fill"
                                style={{ width: `${((campaign.raised || 0) / campaign.goal) * 100}%` }}
                              >
                                <div className="progress-glow"></div>
                              </div>
                            </div>
                            
                            <div className="campaign-stats">
                              <div className="stat">
                                <FaUsers />
                                <span>{campaign.donors?.length || 0} Donors</span>
                              </div>
                              <div className="stat">
                                <FaCalendarAlt />
                                <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="campaign-actions">
                            <button 
                              className="btn-primary"
                              onClick={() => navigate('/campaigns')}
                            >
                              View Public Page
                            </button>
                            <button className="btn-secondary">
                              <FaShare /> Share
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No active campaigns. Create your first fundraiser!</p>
                    )}
                    
                    <div 
                      className="create-campaign-card" 
                      data-aos="fade-up"
                      onClick={() => navigate('/campaigns')}
                    >
                      <FaEye />
                      <h3>View All Campaigns</h3>
                      <p>Browse all active fundraising campaigns</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Events Section with real data */}
            {activeSection === 'events' && (
              <div className="events-section">
                <div className="events-header" data-aos="fade-down">
                  <div className="calendar-view-toggle">
                    <button className="view-btn active">List View</button>
                    <button className="view-btn">Calendar View</button>
                  </div>
                  <button 
                    className="create-event-btn"
                    onClick={() => {
                      setModalType('event');
                      setShowCreateModal(true);
                    }}
                  >
                    <FaPlus /> Create Event
                  </button>
                </div>
                
                <div className="events-list">
                  {events && events.length > 0 ? (
                    events.map((event, index) => (
                      <div 
                        key={event.id}
                        className="event-card"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="event-date-badge">
                          <div className="date-day">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="date-month">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        
                        <div className="event-details">
                          <div className="event-category">
                            {getCategoryIcon(event.category)}
                            <span>{event.category}</span>
                          </div>
                          <h3>{event.title}</h3>
                          <div className="event-meta">
                            <span><FaClock /> {event.time}</span>
                            <span><FaMapMarkerAlt /> {event.location}</span>
                            <span>
                              <FaUsers /> {event.registered?.length || 0}/{event.maxParticipants} registered
                            </span>
                          </div>
                        </div>
                        
                        <div className="event-actions">
                          <button className="btn-primary">Manage Event</button>
                          <button className="btn-secondary">
                            <FaShare /> Share
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming events. Create your first event!</p>
                  )}
                </div>
              </div>
            )}  

            {/* Impact Analytics Section */}
            {activeSection === 'impact' && (
              <div className="impact-section">
                <div className="impact-overview" data-aos="fade-up">
                  <h2 className="section-title">Impact Dashboard</h2>
                  
                  <div className="impact-metrics">
                    <div className="metric-card">
                      <div className="metric-icon">
                        <FaUsers />
                      </div>
                      <div className="metric-value">
                        {totalVolunteers}
                      </div>
                      <div className="metric-label">Volunteers Engaged</div>
                      <div className="metric-chart">
                        <BsBarChartFill />
                      </div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-icon">
                        <FaDollarSign />
                      </div>
                      <div className="metric-value">
                        {formatCurrency(totalFundsRaised)}
                      </div>
                      <div className="metric-label">Funds Raised</div>
                      <div className="metric-chart">
                        <BsGraphUp />
                      </div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-icon">
                        <FaProjectDiagram />
                      </div>
                      <div className="metric-value">
                        {projects.length}
                      </div>
                      <div className="metric-label">Total Projects</div>
                      <div className="metric-chart">
                        <FaChartPie />
                      </div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-icon">
                        <FaHandsHelping />
                      </div>
                      <div className="metric-value">
                        5,000
                      </div>
                      <div className="metric-label">Lives Impacted</div>
                      <div className="metric-chart">
                        <MdTrendingUp />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="charts-section" data-aos="fade-up" data-aos-delay="100">
                  <div className="chart-container">
                    <h3>Volunteer Engagement Over Time</h3>
                    <div className="chart-placeholder">
                      <div className="chart-bars">
                        {[40, 65, 55, 80, 70, 85, 90].map((height, i) => (
                          <div 
                            key={i} 
                            className="chart-bar"
                            style={{ height: `${height}%` }}
                            data-aos="fade-up"
                            data-aos-delay={i * 50}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-container">
                    <h3>Causes Distribution</h3>
                    <div className="pie-chart-placeholder">
                      <div className="pie-chart">
                        <div className="pie-segment segment-1"></div>
                        <div className="pie-segment segment-2"></div>
                        <div className="pie-segment segment-3"></div>
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-color" style={{background: '#0077b6'}}></span>
                          <span>Environment (40%)</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color" style={{background: '#00b894'}}></span>
                          <span>Education (35%)</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color" style={{background: '#764ba2'}}></span>
                          <span>Healthcare (25%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Communications Section with real messages */}
            {activeSection === 'communications' && (
              <div className="communications-section">
                <div className="announcements" data-aos="fade-up">
                  <h2 className="section-title">Recent Announcements</h2>
                  <div className="announcement-feed">
                    <div className="announcement-item">
                      <div className="announcement-icon new">
                        <FaBullhorn />
                      </div>
                      <div className="announcement-content">
                        <h4>New Volunteer Joined</h4>
                        <p>A new volunteer has joined your organization</p>
                        <span className="announcement-time">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="messaging" data-aos="fade-up" data-aos-delay="100">
                  <h2 className="section-title">Direct Messages</h2>
                  <div className="message-list">
                    {messages && messages.length > 0 ? (
                      messages.slice(0, 5).map(message => (
                        <div 
                          key={message.id}
                          className={`message-item ${!message.read ? 'unread' : ''}`}
                          onClick={() => markAsRead(message.id)}
                        >
                          <div className="message-avatar">👤</div>
                          <div className="message-content">
                            <h4>{message.senderName}</h4>
                            <p>{message.message}</p>
                          </div>
                          <div className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No messages yet.</p>
                    )}
                  </div>
                  
                  <button 
                    className="compose-btn"
                    onClick={() => handleAnnouncement(
                      'Update to Volunteers',
                      'Thank you all for your amazing support!',
                      ['volunteers']
                    )}
                  >
                    <FaEnvelope /> Send Announcement
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Modals */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} data-aos="zoom-in">
            <div className="modal-header">
              <h2>
                {modalType === 'project' && 'Create New Project'}
                {modalType === 'event' && 'Create New Event'}
                {modalType === 'fundraiser' && 'Create Fundraising Campaign'}
              </h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            {/* Project Form */}
            {modalType === 'project' && (
              <form onSubmit={handleCreateProject} className="create-project-form">
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                    >
                      <option>Environment</option>
                      <option>Education</option>
                      <option>Healthcare</option>
                      <option>Women Empowerment</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={projectForm.startDate}
                      onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={projectForm.endDate}
                      onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.skillsNeeded}
                    onChange={(e) => setProjectForm({...projectForm, skillsNeeded: e.target.value})}
                    placeholder="e.g., Teaching, Communication"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Volunteers Needed</label>
                    <input
                      type="number"
                      value={projectForm.volunteersNeeded}
                      onChange={(e) => setProjectForm({...projectForm, volunteersNeeded: parseInt(e.target.value)})}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Funding Goal</label>
                    <input
                      type="number"
                      value={projectForm.fundGoal}
                      onChange={(e) => setProjectForm({...projectForm, fundGoal: parseInt(e.target.value)})}
                      min="1000"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Urgency Level</label>
                  <select
                    value={projectForm.urgency}
                    onChange={(e) => setProjectForm({...projectForm, urgency: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Project
                  </button>
                </div>
              </form>
            )}

            {/* Event Form */}
            {modalType === 'event' && (
              <form onSubmit={handleCreateEvent} className="create-form">
                <div className="form-group">
                  <label>Event Title</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                    >
                      <option>Environment</option>
                      <option>Education</option>
                      <option>Healthcare</option>
                      <option>Community</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Max Participants</label>
                    <input
                      type="number"
                      value={eventForm.maxParticipants}
                      onChange={(e) => setEventForm({...eventForm, maxParticipants: parseInt(e.target.value)})}
                      min="10"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Event
                  </button>
                </div>
              </form>
            )}

            {/* Fundraiser Form */}
            {modalType === 'fundraiser' && (
              <form onSubmit={handleCreateFundraiser} className="create-form">
                <div className="form-group">
                  <label>Campaign Title</label>
                  <input
                    type="text"
                    value={fundraiserForm.title}
                    onChange={(e) => setFundraiserForm({...fundraiserForm, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={fundraiserForm.description}
                    onChange={(e) => setFundraiserForm({...fundraiserForm, description: e.target.value})}
                    rows="4"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={fundraiserForm.category}
                      onChange={(e) => setFundraiserForm({...fundraiserForm, category: e.target.value})}
                    >
                      <option>General</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Emergency</option>
                      <option>Environment</option>
                      <option>Children</option>
                      <option>Hunger</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Funding Goal (₹)</label>
                    <input
                      type="number"
                      value={fundraiserForm.goal}
                      onChange={(e) => setFundraiserForm({...fundraiserForm, goal: parseInt(e.target.value)})}
                      min="10000"
                      step="1000"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={fundraiserForm.endDate}
                    onChange={(e) => setFundraiserForm({...fundraiserForm, endDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Campaign
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboardIntegrated;
