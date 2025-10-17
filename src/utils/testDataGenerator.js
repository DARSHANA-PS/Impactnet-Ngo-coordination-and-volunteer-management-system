// testDataGenerator.js - Generate test data for demo

import localStorageService from '../services/localStorageService';

export const generateTestData = () => {
  // Clear existing data
  localStorageService.clearAllData();

  // Create test NGO projects
  const testProjects = [
    {
      ngoId: 'NGO001',
      ngoName: 'Green Earth Initiative',
      title: 'River Cleaning Campaign',
      description: 'Join us in cleaning the Yamuna river banks',
      category: 'Environment',
      location: 'Delhi, India',
      skillsNeeded: ['Physical Work', 'Team Coordination', 'Photography'],
      volunteersNeeded: 50,
      fundGoal: 200000,
      urgency: 'high',
      startDate: '2025-02-01',
      endDate: '2025-03-31'
    },
    {
      ngoId: 'NGO002',
      ngoName: 'Education First',
      title: 'Teach Computer Skills to Rural Students',
      description: 'Help bridge the digital divide',
      category: 'Education',
      location: 'Karnataka, India',
      skillsNeeded: ['Teaching', 'Computer Skills', 'English'],
      volunteersNeeded: 30,
      fundGoal: 150000,
      urgency: 'medium',
      startDate: '2025-02-15',
      endDate: '2025-06-30'
    },
    {
      ngoId: 'NGO003',
      ngoName: 'Healthcare Heroes',
      title: 'Medical Camp for Elderly',
      description: 'Free health checkups and medicines',
      category: 'Healthcare',
      location: 'Mumbai, India',
      skillsNeeded: ['Medical Knowledge', 'First Aid', 'Patient Care'],
      volunteersNeeded: 20,
      fundGoal: 300000,
      urgency: 'high',
      startDate: '2025-01-20',
      endDate: '2025-01-25'
    }
  ];

  testProjects.forEach(project => {
    localStorageService.createProject(project);
  });

  // Create test fundraisers
  const testFundraisers = [
    {
      ngoId: 'NGO001',
      ngoName: 'Green Earth Initiative',
      title: 'Plant 10,000 Trees',
      description: 'Help us plant trees across the city',
      category: 'Environment',
      goal: 500000,
      endDate: '2025-04-30'
    },
    {
      ngoId: 'NGO002',
      ngoName: 'Education First',
      title: 'Build Computer Lab',
      description: 'Create a computer lab for rural school',
      category: 'Education',
      goal: 1000000,
      endDate: '2025-05-31'
    }
  ];

  testFundraisers.forEach(fundraiser => {
    localStorageService.create('ngo_fundraisers', {
      ...fundraiser,
      raised: 0,
      donors: [],
      status: 'active'
    });
  });

  // Create test events
  const testEvents = [
    {
      ngoId: 'NGO001',
      ngoName: 'Green Earth Initiative',
      title: 'Environmental Awareness Workshop',
      description: 'Learn about sustainable living',
      date: '2025-02-15',
      time: '10:00 AM',
      location: 'Community Center, Delhi',
      category: 'Environment',
      maxParticipants: 100
    },
    {
      ngoId: 'NGO002',
      ngoName: 'Education First',
      title: 'Career Guidance Session',
      description: 'Career counseling for students',
      date: '2025-02-20',
      time: '2:00 PM',
      location: 'School Auditorium, Bangalore',
      category: 'Education',
      maxParticipants: 200
    }
  ];

  testEvents.forEach(event => {
    localStorageService.createEvent(event);
  });

  console.log('Test data generated successfully!');
};

// Auto-generate on first load if no data exists
if (localStorageService.getAll('ngo_projects').length === 0) {
  generateTestData();
}
