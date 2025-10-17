import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, 
  FaChevronLeft, FaChevronRight, FaList, FaTh,
  FaProjectDiagram, FaDonate, FaHandsHelping
} from 'react-icons/fa';
import localStorageService from '../../services/localStorageService';
import './EventCalendar.css';

const EventCalendar = ({ userId, userRole, onEventClick }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Fetch events based on current month
  useEffect(() => {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthEvents = localStorageService.getEventsByDateRange(
      startDate.toISOString(),
      endDate.toISOString(),
      userRole,
      userId
    );
    
    setEvents(monthEvents);
    setFilteredEvents(monthEvents);
  }, [currentMonth, userId, userRole]);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Get event icon based on type
  const getEventIcon = (event) => {
    switch(event.eventType) {
      case 'project':
      case 'volunteer-project':
        return <FaProjectDiagram />;
      case 'campaign':
        return <FaDonate />;
      case 'registered-event':
      default:
        return <FaCalendarAlt />;
    }
  };

  // Get event color based on type
  const getEventColor = (event) => {
    switch(event.eventType) {
      case 'project':
        return '#00b894';
      case 'volunteer-project':
        return '#0077b6';
      case 'campaign':
        return '#764ba2';
      case 'registered-event':
        return '#f093fb';
      default:
        return '#667eea';
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="event-calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">
            <FaChevronLeft />
          </button>
          <h3 className="current-month">
            {currentMonth.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <button onClick={() => navigateMonth(1)} className="nav-btn">
            <FaChevronRight />
          </button>
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FaList /> List
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            <FaTh /> Calendar
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="calendar-grid">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="days-grid">
            {getDaysInMonth(currentMonth).map((date, index) => {
              const dayEvents = date ? getEventsForDate(date) : [];
              const isToday = date && 
                date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <div className="day-number">{date.getDate()}</div>
                      {dayEvents.length > 0 && (
                        <div className="event-dots">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <span 
                              key={i}
                              className="event-dot"
                              style={{ backgroundColor: getEventColor(event) }}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="more-events">+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="events-list-view">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="event-list-item"
                onClick={() => onEventClick && onEventClick(event)}
                style={{ borderLeftColor: getEventColor(event) }}
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
                  <div className="event-header">
                    <div className="event-icon" style={{ color: getEventColor(event) }}>
                      {getEventIcon(event)}
                    </div>
                    <h4>{event.title}</h4>
                  </div>
                  
                  <div className="event-meta">
                    {event.time && (
                      <span className="meta-item">
                        <FaClock /> {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="meta-item">
                        <FaMapMarkerAlt /> {event.location}
                      </span>
                    )}
                    {event.ngoName && (
                      <span className="meta-item">
                        By: {event.ngoName}
                      </span>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                  
                  <div className="event-status">
                    {event.status && (
                      <span className={`status-badge ${event.status}`}>
                        {event.status}
                      </span>
                    )}
                    {event.registered && (
                      <span className="participants">
                        <FaUsers /> {event.registered.length} registered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">
              <p>No events scheduled for this period</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Date Modal */}
      {selectedDate && viewMode === 'calendar' && (
        <div className="selected-date-events">
          <div className="modal-header">
            <h4>Events on {formatDate(selectedDate)}</h4>
            <button onClick={() => setSelectedDate(null)} className="close-btn">×</button>
          </div>
          <div className="modal-events">
            {getEventsForDate(selectedDate).map(event => (
              <div 
                key={event.id} 
                className="modal-event-item"
                onClick={() => onEventClick && onEventClick(event)}
              >
                <div className="event-icon" style={{ color: getEventColor(event) }}>
                  {getEventIcon(event)}
                </div>
                <div className="event-info">
                  <h5>{event.title}</h5>
                  {event.time && <span><FaClock /> {event.time}</span>}
                  {event.location && <span><FaMapMarkerAlt /> {event.location}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
