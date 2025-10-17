// src/components/admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './AdminDashboard.css';
import localStorageService from '../../services/localStorageService';
import { 
  FaCheckCircle, FaTimesCircle, FaUsers, FaHome, FaSignOutAlt,
  FaBell, FaSearch, FaFilter, FaEye, FaDownload, FaChartBar,
  FaClock, FaExclamationTriangle, FaShieldAlt
} from 'react-icons/fa';
import { MdDashboard, MdVerified, MdPending } from 'react-icons/md';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [stats, setStats] = useState({
    totalNgos: 0,
    pendingNgos: 0,
    verifiedNgos: 0,
    rejectedNgos: 0
  });

  useEffect(() => {
    // Check admin authentication
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
      return;
    }

    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });

    loadNgoData();
  }, [navigate]);

  const loadNgoData = () => {
    // Get all NGO registrations from local storage
    const allNgos = localStorageService.getAll('ngo_registrations') || [];
    
    // Calculate stats
    const stats = {
      totalNgos: allNgos.length,
      pendingNgos: allNgos.filter(ngo => ngo.verified === 'pending').length,
      verifiedNgos: allNgos.filter(ngo => ngo.verified === true).length,
      rejectedNgos: allNgos.filter(ngo => ngo.verified === false).length
    };
    
    setStats(stats);
    setNgos(allNgos);
  };

  const handleVerifyNgo = (ngoId) => {
    const ngo = ngos.find(n => n.id === ngoId);
    if (!ngo) return;

    // Update NGO verification status
    localStorageService.update('ngo_registrations', ngoId, {
      verified: true,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Admin'
    });

    // Create notification for NGO
    localStorageService.createNotification({
      type: 'verification_approved',
      title: 'Registration Approved!',
      message: 'Your NGO registration has been approved. You can now login.',
      targetId: ngoId,
      targetRole: 'ngo'
    });

    // Reload data
    loadNgoData();
    setShowDetailsModal(false);
    
    alert('NGO verified successfully!');
  };

  const handleRejectNgo = (ngoId, reason) => {
    const ngo = ngos.find(n => n.id === ngoId);
    if (!ngo) return;

    // Update NGO verification status
    localStorageService.update('ngo_registrations', ngoId, {
      verified: false,
      rejectedAt: new Date().toISOString(),
      rejectedBy: 'Admin',
      rejectionReason: reason || 'Registration details not satisfactory'
    });

    // Create notification for NGO
    localStorageService.createNotification({
      type: 'verification_rejected',
      title: 'Registration Rejected',
      message: `Your NGO registration has been rejected. Reason: ${reason || 'Details not satisfactory'}`,
      targetId: ngoId,
      targetRole: 'ngo'
    });

    // Reload data
    loadNgoData();
    setShowDetailsModal(false);
    
    alert('NGO registration rejected.');
  };

  const getFilteredNgos = () => {
    let filtered = ngos;

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered.filter(ngo => ngo.verified === 'pending' || ngo.verified === undefined);
    } else if (activeTab === 'verified') {
      filtered = filtered.filter(ngo => ngo.verified === true);
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(ngo => ngo.verified === false);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(ngo =>
        ngo.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(ngo => ngo.organizationType === filterCategory);
    }

    return filtered;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/admin/login');
  };

  const exportData = () => {
    const data = getFilteredNgos();
    const csv = convertToCSV(data);
    downloadCSV(csv, `ngos_${activeTab}_${Date.now()}.csv`);
  };

  const convertToCSV = (data) => {
    const headers = ['Organization Name', 'Email', 'Registration Number', 'Type', 'Status', 'Date'];
    const rows = data.map(ngo => [
      ngo.organizationName,
      ngo.email,
      ngo.registrationNumber,
      ngo.organizationType,
      ngo.verified === true ? 'Verified' : ngo.verified === false ? 'Rejected' : 'Pending',
      new Date(ngo.createdAt).toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="admin-dashboard">
      {/* Background */}
      <div className="admin-background">
        <div className="bg-gradient-mesh admin-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      {/* Header */}
      <header className="admin-header" data-aos="fade-down">
        <div className="header-left">
          <h1 className="admin-title">
            <FaShieldAlt className="title-icon" />
            Admin Dashboard
          </h1>
          <p className="admin-subtitle">NGO Verification & Management</p>
        </div>

        <div className="header-right">
          <button 
            className="home-btn"
            onClick={() => navigate('/')}
            title="Go to Home"
          >
            <FaHome />
          </button>

          <button 
            className="notification-btn"
            title="Notifications"
          >
            <FaBell />
            <span className="notification-badge">3</span>
          </button>

          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="admin-container">
        {/* Stats Section */}
        <div className="stats-section" data-aos="fade-up">
          <div className="stat-card gradient-1">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.totalNgos}</h3>
              <p>Total NGOs</p>
            </div>
          </div>

          <div className="stat-card gradient-2">
            <div className="stat-icon">
              <MdPending />
            </div>
            <div className="stat-content">
              <h3>{stats.pendingNgos}</h3>
              <p>Pending Verification</p>
            </div>
          </div>

          <div className="stat-card gradient-3">
            <div className="stat-icon">
              <MdVerified />
            </div>
            <div className="stat-content">
              <h3>{stats.verifiedNgos}</h3>
              <p>Verified NGOs</p>
            </div>
          </div>

          <div className="stat-card gradient-4">
            <div className="stat-icon">
              <FaTimesCircle />
            </div>
            <div className="stat-content">
              <h3>{stats.rejectedNgos}</h3>
              <p>Rejected NGOs</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-main-content" data-aos="fade-up" data-aos-delay="100">
          {/* Controls */}
          <div className="controls-section">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                <FaClock />
                <span>Pending ({stats.pendingNgos})</span>
              </button>
              <button 
                className={`tab ${activeTab === 'verified' ? 'active' : ''}`}
                onClick={() => setActiveTab('verified')}
              >
                <MdVerified />
                <span>Verified ({stats.verifiedNgos})</span>
              </button>
              <button 
                className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setActiveTab('rejected')}
              >
                <FaTimesCircle />
                <span>Rejected ({stats.rejectedNgos})</span>
              </button>
            </div>

            <div className="controls-right">
              <div className="search-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search NGOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-wrapper">
                <FaFilter className="filter-icon" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  <option value="Charity">Charity</option>
                  <option value="Non-Profit">Non-Profit</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Trust">Trust</option>
                </select>
              </div>

              <button 
                className="export-btn"
                onClick={exportData}
              >
                <FaDownload />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* NGO List */}
          <div className="ngo-list">
            {getFilteredNgos().length > 0 ? (
              getFilteredNgos().map((ngo) => (
                <div key={ngo.id} className="ngo-card" data-aos="fade-up">
                  <div className="ngo-header">
                    <div className="ngo-info">
                      <h3>{ngo.organizationName}</h3>
                      <p className="ngo-email">{ngo.email}</p>
                      <p className="ngo-reg">Reg No: {ngo.registrationNumber}</p>
                    </div>
                    <div className="ngo-type">
                      <span className="type-badge">{ngo.organizationType}</span>
                    </div>
                  </div>

                  <div className="ngo-details">
                    <div className="detail-item">
                      <span className="label">Founded:</span>
                      <span className="value">{ngo.foundedYear || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Location:</span>
                      <span className="value">{ngo.city}, {ngo.country}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Applied:</span>
                      <span className="value">{new Date(ngo.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="ngo-actions">
                    <button 
                      className="btn-view"
                      onClick={() => {
                        setSelectedNgo(ngo);
                        setShowDetailsModal(true);
                      }}
                    >
                      <FaEye />
                      <span>View Details</span>
                    </button>

                    {(ngo.verified === 'pending' || ngo.verified === undefined) && (
                      <>
                        <button 
                          className="btn-approve"
                          onClick={() => handleVerifyNgo(ngo.id)}
                        >
                          <FaCheckCircle />
                          <span>Approve</span>
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => {
                            const reason = prompt('Reason for rejection:');
                            if (reason) handleRejectNgo(ngo.id, reason);
                          }}
                        >
                          <FaTimesCircle />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {ngo.verified === true && (
                      <span className="status-verified">
                        <MdVerified /> Verified
                      </span>
                    )}

                    {ngo.verified === false && (
                      <span className="status-rejected">
                        <FaTimesCircle /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaExclamationTriangle />
                <p>No NGOs found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedNgo && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>NGO Details</h2>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Organization Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Organization Name:</span>
                    <span className="value">{selectedNgo.organizationName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Registration Number:</span>
                    <span className="value">{selectedNgo.registrationNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">{selectedNgo.organizationType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Founded Year:</span>
                    <span className="value">{selectedNgo.foundedYear}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <span className="value">{selectedNgo.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <span className="value">{selectedNgo.contactPhone || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Contact Person:</span>
                    <span className="value">{selectedNgo.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Website:</span>
                    <span className="value">{selectedNgo.website || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Mission & Focus</h3>
                <p className="mission-text">{selectedNgo.missionStatement || 'No mission statement provided'}</p>
                <div className="focus-areas">
                  <span className="label">Focus Areas:</span>
                  <div className="tags">
                    {selectedNgo.focusAreas?.map((area, index) => (
                      <span key={index} className="tag">{area}</span>
                    )) || <span>No focus areas specified</span>}
                  </div>
                </div>
              </div>

              {(selectedNgo.verified === 'pending' || selectedNgo.verified === undefined) && (
                <div className="modal-actions">
                  <button 
                    className="btn-approve-large"
                    onClick={() => handleVerifyNgo(selectedNgo.id)}
                  >
                    <FaCheckCircle />
                    <span>Approve NGO</span>
                  </button>
                  <button 
                    className="btn-reject-large"
                    onClick={() => {
                      const reason = prompt('Reason for rejection:');
                      if (reason) handleRejectNgo(selectedNgo.id, reason);
                    }}
                  >
                    <FaTimesCircle />
                    <span>Reject NGO</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
