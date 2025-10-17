// useDashboardData.js - React hooks for dashboard data management

import { useState, useEffect, useCallback } from 'react';
import localStorageService from '../services/localStorageService';

// Hook for NGO Dashboard
export const useNgoDashboard = (ngoId) => {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    volunteers: [],
    fundraisers: [],
    events: [],
    resources: [],
    analytics: {},
    notifications: [],
    loading: true
  });

  // Get the NGO name from localStorage
  const getNgoName = () => {
    const ngoName = localStorage.getItem('currentUserName') || 'Unknown NGO';
    return ngoName;
  };

  const refreshData = useCallback(() => {
    const projects = localStorageService.getProjectsByNgo(ngoId);
    const analytics = localStorageService.getNgoAnalytics(ngoId);
    const notifications = localStorageService.getNotifications(ngoId, 'ngo');
    const fundraisers = localStorageService.getAll('ngo_fundraisers')
      .filter(f => f.ngoId === ngoId);
    const events = localStorageService.getAll('ngo_events')
      .filter(e => e.ngoId === ngoId);
    const resources = localStorageService.getAll('ngo_resources');

    // Get volunteers from all projects
    const volunteers = [];
    projects.forEach(project => {
      if (project.volunteersJoined) {
        project.volunteersJoined.forEach(volunteer => {
          if (!volunteers.find(v => v.volunteerId === volunteer.volunteerId)) {
            volunteers.push(volunteer);
          }
        });
      }
    });

    setDashboardData({
      projects,
      volunteers,
      fundraisers,
      events,
      resources,
      analytics,
      notifications,
      loading: false
    });
  }, [ngoId]);

  useEffect(() => {
    refreshData();
    // Set up refresh interval
    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  const createProject = (projectData) => {
    const project = localStorageService.createProject({
      ...projectData,
      ngoId,
      ngoName: getNgoName() // Fixed: Use actual NGO name
    });
    refreshData();
    return project;
  };

  const updateProject = (projectId, updates) => {
    localStorageService.updateProject(projectId, updates);
    refreshData();
  };

  const createFundraiser = (fundraiserData) => {
    const fundraiser = localStorageService.create('ngo_fundraisers', {
      ...fundraiserData,
      ngoId,
      ngoName: getNgoName(), // Fixed: Use actual NGO name
      raised: 0,
      donors: []
    });
    refreshData();
    return fundraiser;
  };

  const createEvent = (eventData) => {
    const event = localStorageService.createEvent({
      ...eventData,
      ngoId,
      ngoName: getNgoName(), // Fixed: Use actual NGO name
      registered: []
    });
    refreshData();
    return event;
  };

  const shareResource = (resourceData) => {
    const resource = localStorageService.shareResource({
      ...resourceData,
      ngoId,
      ngoName: getNgoName(), // Fixed: Use actual NGO name
      availability: 'Available'
    });
    refreshData();
    return resource;
  };

  const sendAnnouncement = (announcementData) => {
    const announcement = localStorageService.createAnnouncement({
      ...announcementData,
      ngoId,
      ngoName: getNgoName() // Fixed: Use actual NGO name
    });
    refreshData();
    return announcement;
  };

  return {
    ...dashboardData,
    createProject,
    updateProject,
    createFundraiser,
    createEvent,
    shareResource,
    sendAnnouncement,
    refreshData
  };
};

// Hook for Volunteer Dashboard
export const useVolunteerDashboard = (volunteerId) => {
  const [dashboardData, setDashboardData] = useState({
    opportunities: [],
    engagements: [],
    events: [],
    impact: {},
    skills: [],
    notifications: [],
    loading: true
  });

  // Get the volunteer name from localStorage
  const getVolunteerName = () => {
    const volunteerName = localStorage.getItem('currentUserName') || 'Unknown Volunteer';
    return volunteerName;
  };

  const refreshData = useCallback(() => {
    const opportunities = localStorageService.getActiveProjects();
    const engagements = localStorageService.getVolunteerEngagements(volunteerId);
    const events = localStorageService.getAll('ngo_events')
      .filter(e => e.status === 'upcoming');
    const volunteerEvents = localStorageService.getAll('volunteer_events')
      .filter(e => e.volunteerId === volunteerId);
    const impact = localStorageService.getVolunteerAnalytics(volunteerId);
    const skills = localStorageService.getAll('volunteer_skills')
      .filter(s => s.volunteerId === volunteerId);
    const notifications = localStorageService.getNotifications(volunteerId, 'volunteer');

    setDashboardData({
      opportunities,
      engagements,
      events,
      volunteerEvents,
      impact,
      skills,
      notifications,
      loading: false
    });
  }, [volunteerId]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const joinProject = (projectId) => {
    const engagement = localStorageService.joinProject(volunteerId, projectId, {
      name: getVolunteerName(), // Fixed: Use actual volunteer name
      skills: dashboardData.skills.map(s => s.name)
    });
    refreshData();
    return engagement;
  };

  const registerForEvent = (eventId) => {
    const event = localStorageService.registerForEvent(volunteerId, eventId, 'volunteer');
    refreshData();
    return event;
  };

  const updateHours = (engagementId, hours) => {
    localStorageService.updateVolunteerHours(engagementId, hours);
    refreshData();
  };

  const addSkill = (skillData) => {
    const skill = localStorageService.create('volunteer_skills', {
      ...skillData,
      volunteerId
    });
    refreshData();
    return skill;
  };

  const searchOpportunities = (query, filters) => {
    const results = localStorageService.searchProjects(query, filters);
    return results;
  };

  return {
    ...dashboardData,
    joinProject,
    registerForEvent,
    updateHours,
    addSkill,
    searchOpportunities,
    refreshData
  };
};

// Hook for Donor Dashboard
export const useDonorDashboard = (donorId) => {
  const [dashboardData, setDashboardData] = useState({
    campaigns: [],
    donations: [],
    impactReports: [],
    partnerNgos: [],
    events: [],
    achievements: [],
    notifications: [],
    analytics: {},
    loading: true
  });

  // Get the donor name from localStorage
  const getDonorName = () => {
    const donorName = localStorage.getItem('currentUserName') || 'Unknown Donor';
    return donorName;
  };

  const refreshData = useCallback(() => {
    const campaigns = localStorageService.getAll('ngo_fundraisers')
      .filter(f => f.status === 'active');
    const donations = localStorageService.getDonorDonations(donorId);
    const impactReports = localStorageService.getDonorImpactReports(donorId);
    const achievements = localStorageService.getAll('donor_achievements')
      .filter(a => a.userId === donorId);
    const events = localStorageService.getAll('ngo_events')
      .filter(e => e.status === 'upcoming');
    const notifications = localStorageService.getNotifications(donorId, 'donor');
    const analytics = localStorageService.getDonorAnalytics(donorId);

    // Get unique NGOs from donations
    const ngoIds = [...new Set(donations.map(d => d.ngoId))];
    const partnerNgos = ngoIds.map(ngoId => {
      const ngoProjects = localStorageService.getProjectsByNgo(ngoId);
      return {
        id: ngoId,
        name: donations.find(d => d.ngoId === ngoId)?.ngoName || 'Unknown NGO',
        totalDonated: donations
          .filter(d => d.ngoId === ngoId)
          .reduce((sum, d) => sum + d.amount, 0),
        projectsSupported: ngoProjects.length
      };
    });

    setDashboardData({
      campaigns,
      donations,
      impactReports,
      partnerNgos,
      events,
      achievements,
      notifications,
      analytics,
      loading: false
    });
  }, [donorId]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const makeDonation = (campaignId, amount, paymentMethod) => {
    const donation = localStorageService.makeDonation(
      {
        donorId,
        name: getDonorName(), // Fixed: Use actual donor name
        paymentMethod
      },
      campaignId,
      amount
    );
    
    // Check for new achievements
    localStorageService.checkAndAwardBadges(donorId, 'donor');
    
    refreshData();
    return donation;
  };

  const searchCampaigns = (query, filters) => {
    let campaigns = localStorageService.getAll('ngo_fundraisers')
      .filter(f => f.status === 'active');
    
    if (query) {
      query = query.toLowerCase();
      campaigns = campaigns.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.ngoName.toLowerCase().includes(query)
      );
    }

    if (filters.category && filters.category !== 'all') {
      campaigns = campaigns.filter(c => c.category === filters.category);
    }

    return campaigns;
  };

  const registerForEvent = (eventId) => {
    const event = localStorageService.registerForEvent(donorId, eventId, 'donor');
    refreshData();
    return event;
  };

  const markNotificationRead = (notificationId) => {
    localStorageService.markNotificationAsRead(notificationId);
    refreshData();
  };

  return {
    ...dashboardData,
    makeDonation,
    searchCampaigns,
    registerForEvent,
    markNotificationRead,
    refreshData
  };
};

// Hook for real-time updates
export const useRealTimeUpdates = (userId, userRole) => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const checkUpdates = () => {
      const notifications = localStorageService.getNotifications(userId, userRole)
        .filter(n => !n.read)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setUpdates(notifications);
    };

    checkUpdates();
    const interval = setInterval(checkUpdates, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, [userId, userRole]);

  return updates;
};

// Hook for analytics
export const useAnalytics = (userId, userRole) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = () => {
      let data;
      switch(userRole) {
        case 'ngo':
          data = localStorageService.getNgoAnalytics(userId);
          break;
        case 'volunteer':
          data = localStorageService.getVolunteerAnalytics(userId);
          break;
        case 'donor':
          data = localStorageService.getDonorAnalytics(userId);
          break;
        default:
          data = {};
      }
      setAnalytics(data);
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [userId, userRole]);

  return analytics;
};

// Hook for messaging
export const useMessaging = (userId) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get the user name from localStorage
  const getUserName = () => {
    const userName = localStorage.getItem('currentUserName') || 'Unknown User';
    return userName;
  };

  const refreshMessages = useCallback(() => {
    const allMessages = localStorageService.getAll('messages');
    const userMessages = allMessages.filter(m => 
      m.recipientId === userId || m.senderId === userId
    );
    
    const unread = userMessages.filter(m => 
      m.recipientId === userId && !m.read
    ).length;

    setMessages(userMessages);
    setUnreadCount(unread);
  }, [userId]);

  useEffect(() => {
    refreshMessages();
    const interval = setInterval(refreshMessages, 3000);
    return () => clearInterval(interval);
  }, [refreshMessages]);

  const sendMessage = (recipientId, message) => {
    const newMessage = localStorageService.sendMessage({
      senderId: userId,
      senderName: getUserName(), // Fixed: Use actual user name
      recipientId,
      message,
      subject: message.subject || 'No Subject'
    });
    refreshMessages();
    return newMessage;
  };

  const markAsRead = (messageId) => {
    localStorageService.update('messages', messageId, { read: true });
    refreshMessages();
  };

  return {
    messages,
    unreadCount,
    sendMessage,
    markAsRead,
    refreshMessages
  };
};

// useDashboardData.js - continued

export default {
  useNgoDashboard,
  useVolunteerDashboard,
  useDonorDashboard,
  useRealTimeUpdates,
  useAnalytics,
  useMessaging
};
