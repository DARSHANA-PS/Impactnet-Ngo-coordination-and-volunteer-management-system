// authService.js - Updated with local storage user management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Mock user data for local storage
const mockUsers = {
  volunteer: {
    VOL001: { id: 'VOL001', name: 'John Doe', email: 'john@example.com', role: 'volunteer' },
    VOL002: { id: 'VOL002', name: 'Jane Smith', email: 'jane@example.com', role: 'volunteer' }
  },
  ngo: {
    NGO001: { id: 'NGO001', name: 'Green Earth Initiative', email: 'green@example.com', role: 'ngo' },
    NGO002: { id: 'NGO002', name: 'Education First', email: 'edu@example.com', role: 'ngo' }
  },
  donor: {
    DON001: { id: 'DON001', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'donor' },
    DON002: { id: 'DON002', name: 'Priya Sharma', email: 'priya@example.com', role: 'donor' }
  }
};

// Signup function with local storage fallback
export const signup = async (userData) => {
  try {
    const endpoint = `${API_BASE_URL}/auth/${userData.role}/signup`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Signup error:', error);
    
    // Fallback to local storage
    const userId = `${userData.role.toUpperCase()}${Date.now()}`;
    const newUser = {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role
    };
    
    // Store in local storage
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentUserName', userData.name);
    localStorage.setItem('currentUserRole', userData.role);
    localStorage.setItem('token', 'mock-token-' + userId);
    
    return { user: newUser, token: 'mock-token-' + userId };
  }
};

// Login function with local storage fallback
export const login = async (credentials) => {
  try {
    const endpoint = `${API_BASE_URL}/auth/${credentials.role}/login`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    
    // Fallback to local storage with mock users
    let userId, userName;
    
    // Mock login logic
    if (credentials.email === 'volunteer@example.com') {
      userId = 'VOL001';
      userName = 'John Doe';
    } else if (credentials.email === 'ngo@example.com') {
      userId = 'NGO001';
      userName = 'Green Earth Initiative';
    } else if (credentials.email === 'donor@example.com') {
      userId = 'DON001';
      userName = 'Rajesh Kumar';
    } else {
      // Create new user
      userId = `${credentials.role.toUpperCase()}${Date.now()}`;
      userName = credentials.email.split('@')[0];
    }
    
    // Store in local storage
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentUserName', userName);
    localStorage.setItem('currentUserRole', credentials.role);
    localStorage.setItem('token', 'mock-token-' + userId);
    
    return {
      user: {
        id: userId,
        name: userName,
        email: credentials.email,
        role: credentials.role
      },
      token: 'mock-token-' + userId
    };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('userRole');
  sessionStorage.removeItem('userRole');
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('currentUserName');
  localStorage.removeItem('currentUserRole');
  window.location.href = '/login';
};

// Get current user info
export const getCurrentUserInfo = () => {
  return {
    id: localStorage.getItem('currentUserId'),
    name: localStorage.getItem('currentUserName'),
    role: localStorage.getItem('currentUserRole')
  };
};

// Other functions remain the same...
export const verifyToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Token verification error:', error);
    // Check local storage token
    return !!localStorage.getItem('token');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get current user error:', error);
    return getCurrentUserInfo();
  }
};

export const requestPasswordReset = async (email, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};
