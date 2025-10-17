// DemoCredentials.jsx - Show demo login credentials

import React from 'react';
import './DemoCredentials.css';

const DemoCredentials = () => {
  const credentials = [
    {
      role: 'Volunteer',
      email: 'volunteer@example.com',
      password: 'demo123',
      features: ['Browse opportunities', 'Join projects', 'Track impact']
    },
    {
      role: 'NGO',
      email: 'ngo@example.com',
      password: 'demo123',
      features: ['Create projects', 'Manage volunteers', 'Track donations']
    },
    {
      role: 'Donor',
      email: 'donor@example.com',
      password: 'demo123',
      features: ['Browse campaigns', 'Make donations', 'View impact reports']
    }
  ];

  return (
    <div className="demo-credentials">
      <h3>Demo Credentials</h3>
      <p>Use these credentials to explore the platform:</p>
      
      <div className="credentials-grid">
        {credentials.map((cred, index) => (
          <div key={index} className="credential-card">
            <h4>{cred.role}</h4>
            <div className="credential-info">
              <p><strong>Email:</strong> {cred.email}</p>
              <p><strong>Password:</strong> {cred.password}</p>
            </div>
            <div className="features">
              <p>Features:</p>
              <ul>
                {cred.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <p className="note">
        💡 This is a demo environment using Local Storage. 
        All data is stored locally in your browser.
      </p>
    </div>
  );
};

export default DemoCredentials;
