// localStorageService.js - Complete Local Storage Backend with NGO Verification

class LocalStorageService {
  constructor() {
    this.initializeStorage();
  }

  // Initialize storage with default data structure
  initializeStorage() {
    const storageKeys = [
      'ngo_projects',
      'ngo_fundraisers', 
      'ngo_events',
      'ngo_resources',
      'ngo_impact',
      'ngo_announcements',
      'ngo_registrations', // Add this for NGO registrations
      'volunteer_engagements',
      'volunteer_events',
      'volunteer_impact',
      'volunteer_skills',
      'donor_donations',
      'donor_impact_reports',
      'donor_ngos',
      'donor_achievements',
      'notifications',
      'messages',
      'users'
    ];

    storageKeys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });

    // Initialize sample data if empty
    if (this.getAll('ngo_projects').length === 0) {
      this.initializeSampleData();
    }
  }

  // Generic CRUD operations
  getAll(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  getById(key, id) {
    const items = this.getAll(key);
    return items.find(item => item.id === id);
  }

  create(key, item) {
    const items = this.getAll(key);
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
  }

  update(key, id, updates) {
    const items = this.getAll(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(items));
      return items[index];
    }
    return null;
  }

  delete(key, id) {
    const items = this.getAll(key);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    return filtered.length < items.length;
  }

  // Generate unique ID
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // NGO Registration and Verification Methods
  createNgoRegistration(ngoData) {
    const registration = this.create('ngo_registrations', {
      ...ngoData,
      verified: 'pending', // pending, true, or false
      verifiedAt: null,
      verifiedBy: null,
      rejectionReason: null
    });
    
    // Create notification for admin
    this.createNotification({
      type: 'new_ngo_registration',
      title: 'New NGO Registration',
      message: `${ngoData.organizationName} has registered and is pending verification`,
      targetRole: 'admin'
    });
    
    return registration;
  }

  // Check if NGO is verified before login
  checkNgoVerification(email) {
    const registrations = this.getAll('ngo_registrations');
    const ngo = registrations.find(n => n.email === email);
    
    if (!ngo) return { exists: false };
    
    return {
      exists: true,
      verified: ngo.verified,
      rejectionReason: ngo.rejectionReason
    };
  }

  // Initialize sample data
  initializeSampleData() {
    // Sample NGO Projects
    const sampleProjects = [
      {
        id: this.generateId(),
        ngoId: "NGO001",
        ngoName: "Green Earth Initiative",
        title: "Clean Water for Villages",
        description: "Provide purified water systems for 10 villages in rural Maharashtra",
        category: "Water",
        skillsNeeded: ["Engineering", "Field Work", "Community Outreach"],
        volunteersNeeded: 20,
        volunteersJoined: [],
        fundRaised: 75000,
        fundGoal: 100000,
        status: "active",
        startDate: "2025-01-15",
        endDate: "2025-06-30",
        location: "Maharashtra, India",
        image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=400",
        urgency: "high"
      },
      {
        id: this.generateId(),
        ngoId: "NGO002",
        ngoName: "Education First",
        title: "Digital Literacy for Rural Students",
        description: "Teaching computer skills to underprivileged students",
        category: "Education",
        skillsNeeded: ["Teaching", "Computer Skills", "Communication"],
        volunteersNeeded: 15,
        volunteersJoined: [],
        fundRaised: 45000,
        fundGoal: 80000,
        status: "active",
        startDate: "2025-02-01",
        endDate: "2025-07-31",
        location: "Delhi NCR",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
        urgency: "medium"
      }
    ];

    // Sample NGO Registrations (some verified, some pending)
    const sampleRegistrations = [
      {
        id: "NGO001",
        organizationName: "Green Earth Initiative",
        registrationNumber: "NGO/2023/0456",
        email: "ngo@example.com",
        password: "demo123",
        organizationType: "Non-Profit",
        foundedYear: 2015,
        city: "Mumbai",
        country: "India",
        contactPerson: "Rahul Sharma",
        contactPhone: "+91-9876543210",
        missionStatement: "Working towards environmental sustainability and clean water access",
        focusAreas: ["Environment", "Water", "Sanitation"],
        verified: true,
        verifiedAt: "2023-06-15T10:00:00.000Z",
        verifiedBy: "Admin",
        createdAt: "2023-06-10T10:00:00.000Z"
      },
      {
        id: this.generateId(),
        organizationName: "Hope Foundation",
        registrationNumber: "NGO/2024/0789",
        email: "hope@example.com",
        password: "test123",
        organizationType: "Charity",
        foundedYear: 2020,
        city: "Delhi",
        country: "India",
        contactPerson: "Priya Verma",
        contactPhone: "+91-9876543211",
        missionStatement: "Empowering underprivileged children through education",
        focusAreas: ["Education", "Child Welfare"],
        verified: 'pending',
        createdAt: new Date().toISOString()
      }
    ];

    // Sample Fundraisers
    const sampleFundraisers = [
      {
        id: this.generateId(),
        ngoId: "NGO001",
        ngoName: "Green Earth Initiative",
        title: "Health Camp Drive",
        description: "Free medical checkups for rural communities",
        goal: 50000,
        raised: 20000,
        donors: [],
        category: "Healthcare",
        endDate: "2025-03-15",
        status: "active"
      }
    ];

    // Sample Events
    const sampleEvents = [
      {
        id: this.generateId(),
        ngoId: "NGO001",
        ngoName: "Green Earth Initiative",
        title: "Tree Plantation Drive",
        description: "Plant 1000 trees in local areas",
        date: "2025-02-20",
        time: "7:00 AM",
        location: "Aarey Forest, Mumbai",
        category: "Environment",
        maxParticipants: 200,
        registered: [],
        status: "upcoming"
      }
    ];

    // Store sample data
    localStorage.setItem('ngo_projects', JSON.stringify(sampleProjects));
    localStorage.setItem('ngo_fundraisers', JSON.stringify(sampleFundraisers));
    localStorage.setItem('ngo_events', JSON.stringify(sampleEvents));
    localStorage.setItem('ngo_registrations', JSON.stringify(sampleRegistrations));
  }

  // NGO-specific operations
  createProject(projectData) {
    const project = this.create('ngo_projects', projectData);
    
    // Create notification for volunteers
    this.createNotification({
      type: 'new_project',
      title: 'New Project Available',
      message: `${projectData.ngoName} has posted a new project: ${projectData.title}`,
      targetRole: 'volunteer',
      projectId: project.id
    });

    return project;
  }

  updateProject(projectId, updates) {
    return this.update('ngo_projects', projectId, updates);
  }

  getProjectsByNgo(ngoId) {
    const projects = this.getAll('ngo_projects');
    return projects.filter(p => p.ngoId === ngoId);
  }

  getActiveProjects() {
    const projects = this.getAll('ngo_projects');
    return projects.filter(p => p.status === 'active');
  }

  // Volunteer operations
  joinProject(volunteerId, projectId, volunteerData) {
    const project = this.getById('ngo_projects', projectId);
    if (!project) return null;

    // Add volunteer to project
    const updatedVolunteers = [...(project.volunteersJoined || []), {
      volunteerId,
      name: volunteerData.name,
      joinedAt: new Date().toISOString(),
      status: 'active'
    }];

    this.update('ngo_projects', projectId, {
      volunteersJoined: updatedVolunteers
    });

    // Create engagement record
    const engagement = this.create('volunteer_engagements', {
      volunteerId,
      projectId,
      projectTitle: project.title,
      ngoName: project.ngoName,
      hours: 0,
      status: 'active',
      startDate: new Date().toISOString()
    });

    // Notify NGO
    this.createNotification({
      type: 'volunteer_joined',
      title: 'New Volunteer Joined',
      message: `${volunteerData.name} has joined your project: ${project.title}`,
      targetNgoId: project.ngoId,
      projectId
    });

    return engagement;
  }

  getVolunteerEngagements(volunteerId) {
    const engagements = this.getAll('volunteer_engagements');
    return engagements.filter(e => e.volunteerId === volunteerId);
  }

  updateVolunteerHours(engagementId, hours) {
    const engagement = this.getById('volunteer_engagements', engagementId);
    if (!engagement) return null;

    const updated = this.update('volunteer_engagements', engagementId, {
      hours: engagement.hours + hours
    });

    // Update volunteer impact
    this.updateVolunteerImpact(engagement.volunteerId, hours);

    return updated;
  }

  updateVolunteerImpact(volunteerId, additionalHours) {
    const impacts = this.getAll('volunteer_impact');
    const existingImpact = impacts.find(i => i.volunteerId === volunteerId);

    if (existingImpact) {
      this.update('volunteer_impact', existingImpact.id, {
        totalHours: existingImpact.totalHours + additionalHours,
        projectsCompleted: existingImpact.projectsCompleted
      });
    } else {
      this.create('volunteer_impact', {
        volunteerId,
        totalHours: additionalHours,
        projectsCompleted: 0,
        beneficiariesImpacted: 0
      });
    }
  }

  // Donor operations
  makeDonation(donorData, campaignId, amount) {
    const campaign = this.getById('ngo_fundraisers', campaignId);
    if (!campaign) return null;

    // Create donation record
    const donation = this.create('donor_donations', {
      donorId: donorData.donorId,
      donorName: donorData.name,
      campaignId,
      campaignTitle: campaign.title,
      ngoId: campaign.ngoId,
      ngoName: campaign.ngoName,
      amount,
      paymentMethod: donorData.paymentMethod || 'online',
      status: 'completed'
    });

    // Update campaign
    const updatedDonors = [...(campaign.donors || []), {
      donorId: donorData.donorId,
      name: donorData.name,
      amount,
      donatedAt: new Date().toISOString()
    }];

    this.update('ngo_fundraisers', campaignId, {
      raised: (campaign.raised || 0) + amount,
      donors: updatedDonors
    });

    // Create impact report
    this.create('donor_impact_reports', {
      donorId: donorData.donorId,
      campaignId,
      campaignTitle: campaign.title,
      ngoName: campaign.ngoName,
      amount,
      impact: `Your donation is helping ${campaign.description}`,
      status: 'pending' // NGO will update with actual impact
    });

    // Notify NGO
    this.createNotification({
      type: 'new_donation',
      title: 'New Donation Received',
      message: `${donorData.name} donated ₹${amount} to ${campaign.title}`,
      targetNgoId: campaign.ngoId,
      campaignId
    });

    return donation;
  }

  getDonorDonations(donorId) {
    const donations = this.getAll('donor_donations');
    return donations.filter(d => d.donorId === donorId);
  }

  getDonorImpactReports(donorId) {
    const reports = this.getAll('donor_impact_reports');
    return reports.filter(r => r.donorId === donorId);
  }

  // Event operations
  createEvent(eventData) {
    const event = this.create('ngo_events', eventData);
    
    // Notify volunteers and donors
    this.createNotification({
      type: 'new_event',
      title: 'New Event Posted',
      message: `${eventData.ngoName} is organizing: ${eventData.title}`,
      targetRole: 'all',
      eventId: event.id
    });

    return event;
  }

  registerForEvent(userId, eventId, userRole) {
    const event = this.getById('ngo_events', eventId);
    if (!event) return null;

    const updatedRegistered = [...(event.registered || []), {
      userId,
      userRole,
      registeredAt: new Date().toISOString()
    }];

    this.update('ngo_events', eventId, {
      registered: updatedRegistered
    });

    // Create volunteer event record if volunteer
    if (userRole === 'volunteer') {
      this.create('volunteer_events', {
        volunteerId: userId,
        eventId,
        eventTitle: event.title,
        ngoName: event.ngoName,
        date: event.date,
        status: 'registered'
      });
    }

    return event;
  }

  // Resource sharing operations
  shareResource(resourceData) {
    const resource = this.create('ngo_resources', resourceData);
    
    this.createNotification({
      type: 'resource_shared',
      title: 'New Resource Available',
      message: `${resourceData.ngoName} is sharing: ${resourceData.name}`,
      targetRole: 'ngo'
    });

    return resource;
  }

  requestResource(requestorNgoId, resourceId) {
    const resource = this.getById('ngo_resources', resourceId);
    if (!resource || resource.availability !== 'Available') return null;

    this.update('ngo_resources', resourceId, {
      availability: 'Requested',
      requestedBy: requestorNgoId,
      requestedAt: new Date().toISOString()
    });

    return resource;
  }

  // Communication operations
  sendMessage(messageData) {
    const message = this.create('messages', {
      ...messageData,
      read: false
    });

    this.createNotification({
      type: 'new_message',
      title: 'New Message',
      message: `You have a new message from ${messageData.senderName}`,
      targetId: messageData.recipientId
    });

    return message;
  }

  createAnnouncement(announcementData) {
    const announcement = this.create('ngo_announcements', announcementData);
    
    // Notify relevant users based on announcement type
    if (announcementData.targetAudience.includes('volunteers')) {
      this.createNotification({
        type: 'announcement',
        title: announcementData.title,
        message: announcementData.message,
        targetRole: 'volunteer',
        ngoId: announcementData.ngoId
      });
    }

    return announcement;
  }

  // Notification operations
  createNotification(notificationData) {
    return this.create('notifications', {
      ...notificationData,
      read: false
    });
  }

  getNotifications(userId, userRole) {
    const notifications = this.getAll('notifications');
    return notifications.filter(n => 
      n.targetId === userId || 
      n.targetRole === userRole || 
      n.targetRole === 'all'
    );
  }

  markNotificationAsRead(notificationId) {
    return this.update('notifications', notificationId, { read: true });
  }

  // Analytics and reporting
  getNgoAnalytics(ngoId) {
    const projects = this.getProjectsByNgo(ngoId);
    const fundraisers = this.getAll('ngo_fundraisers').filter(f => f.ngoId === ngoId);
    const events = this.getAll('ngo_events').filter(e => e.ngoId === ngoId);
    
    const totalVolunteers = projects.reduce((sum, p) => 
      sum + (p.volunteersJoined?.length || 0), 0
    );
    
    const totalFundsRaised = fundraisers.reduce((sum, f) => sum + (f.raised || 0), 0);
    
    const activeProjects = projects.filter(p => p.status === 'active').length;

    return {
      totalProjects: projects.length,
      activeProjects,
      totalVolunteers,
      totalFundsRaised,
      totalEvents: events.length,
      upcomingEvents: events.filter(e => e.status === 'upcoming').length,
      completedProjects: projects.filter(p => p.status === 'completed').length
    };
  }

  getVolunteerAnalytics(volunteerId) {
    const engagements = this.getVolunteerEngagements(volunteerId);
    const events = this.getAll('volunteer_events').filter(e => e.volunteerId === volunteerId);
    const impact = this.getAll('volunteer_impact').find(i => i.volunteerId === volunteerId);

    return {
      totalHours: impact?.totalHours || 0,
      activeProjects: engagements.filter(e => e.status === 'active').length,
      completedProjects: engagements.filter(e => e.status === 'completed').length,
      upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
      totalEngagements: engagements.length
    };
  }

  getDonorAnalytics(donorId) {
    const donations = this.getDonorDonations(donorId);
    const impactReports = this.getDonorImpactReports(donorId);
    
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const ngosSupported = [...new Set(donations.map(d => d.ngoId))].length;
    const campaignsSupported = [...new Set(donations.map(d => d.campaignId))].length;

    return {
      totalDonated,
      totalDonations: donations.length,
      ngosSupported,
      campaignsSupported,
      impactReports: impactReports.length
    };
  }

  // Search operations
  searchProjects(query, filters = {}) {
    let projects = this.getActiveProjects();
    
    if (query) {
      query = query.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.ngoName.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.skillsNeeded.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (filters.category && filters.category !== 'all') {
      projects = projects.filter(p => p.category === filters.category);
    }

    if (filters.location) {
      projects = projects.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.urgency) {
      projects = projects.filter(p => p.urgency === filters.urgency);
    }

    return projects;
  }

  searchEvents(query, filters = {}) {
    let events = this.getAll('ngo_events');
    
    if (query) {
      query = query.toLowerCase();
      events = events.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.ngoName.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }

    if (filters.category && filters.category !== 'all') {
      events = events.filter(e => e.category === filters.category);
    }

    if (filters.dateFrom) {
      events = events.filter(e => new Date(e.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      events = events.filter(e => new Date(e.date) <= new Date(filters.dateTo));
    }

    return events;
  }

  // Achievement and badge operations
  checkAndAwardBadges(userId, userRole) {
    const achievements = [];

    if (userRole === 'volunteer') {
      const analytics = this.getVolunteerAnalytics(userId);
      
      if (analytics.totalHours >= 10 && !this.hasBadge(userId, 'first_10_hours')) {
        achievements.push(this.awardBadge(userId, {
          name: '10 Hour Hero',
          description: 'Completed 10 hours of volunteering',
          icon: '⏰',
          type: 'hours',
          badgeType: 'first_10_hours'
        }));
      }

      if (analytics.completedProjects >= 5 && !this.hasBadge(userId, 'project_champion')) {
        achievements.push(this.awardBadge(userId, {
          name: 'Project Champion',
          description: 'Completed 5 projects',
          icon: '🏆',
          type: 'projects',
          badgeType: 'project_champion'
        }));
      }
    }

    if (userRole === 'donor') {
      const analytics = this.getDonorAnalytics(userId);
      
      if (analytics.totalDonated >= 100000 && !this.hasBadge(userId, 'impact_donor')) {
        achievements.push(this.awardBadge(userId, {
          name: 'Impact Donor',
          description: 'Donated over ₹1 Lakh',
          icon: '💎',
          type: 'donation',
          badgeType: 'impact_donor'
        }));
      }

      if (analytics.ngosSupported >= 10 && !this.hasBadge(userId, 'supporter')) {
        achievements.push(this.awardBadge(userId, {
          name: 'NGO Supporter',
          description: 'Supported 10+ NGOs',
          icon: '🤝',
          type: 'support',
          badgeType: 'supporter'
        }));
      }
    }

    return achievements;
  }

  hasBadge(userId, badgeType) {
    const achievements = this.getAll('donor_achievements');
    return achievements.some(a => a.userId === userId && a.badgeType === badgeType);
  }

  awardBadge(userId, badge) {
    const achievement = this.create('donor_achievements', {
      userId,
      ...badge,
      awardedAt: new Date().toISOString()
    });

    this.createNotification({
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: `Congratulations! You've earned the "${badge.name}" badge`,
      targetId: userId
    });

    return achievement;
  }

  // Data export operations
  exportUserData(userId, userRole) {
    const data = {
      exportDate: new Date().toISOString(),
      userRole,
      userId
    };

    switch(userRole) {
      case 'volunteer':
        data.engagements = this.getVolunteerEngagements(userId);
        data.events = this.getAll('volunteer_events').filter(e => e.volunteerId === userId);
        data.impact = this.getAll('volunteer_impact').filter(i => i.volunteerId === userId);
        data.skills = this.getAll('volunteer_skills').filter(s => s.volunteerId === userId);
        break;
      
      case 'ngo':
        data.projects = this.getProjectsByNgo(userId);
        data.fundraisers = this.getAll('ngo_fundraisers').filter(f => f.ngoId === userId);
        data.events = this.getAll('ngo_events').filter(e => e.ngoId === userId);
        data.analytics = this.getNgoAnalytics(userId);
        break;
      
      case 'donor':
        data.donations = this.getDonorDonations(userId);
        data.impactReports = this.getDonorImpactReports(userId);
        data.achievements = this.getAll('donor_achievements').filter(a => a.userId === userId);
        data.analytics = this.getDonorAnalytics(userId);
        break;
    }

    return data;
  }

  // Clear all data (for testing)
  clearAllData() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('ngo_') || key.includes('volunteer_') || 
          key.includes('donor_') || key.includes('notifications') || 
          key.includes('messages')) {
        localStorage.removeItem(key);
      }
    });
    this.initializeStorage();
  }
}

// Create singleton instance
const localStorageService = new LocalStorageService();
export default localStorageService;
