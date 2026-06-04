import React from 'react';
import './SelectEvent.css';

const SelectEvent = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="upcoming-events-container">
        <div className="ue-header">
          <h2 className="ue-main-title">Майбутні події</h2>
        </div>
        <div className="ue-list">
          <div className="ue-card" style={{ cursor: 'default', textAlign: 'center' }}>
            <span className="ue-event-name" style={{ opacity: 0.6, fontSize: '18px' }}>
              Немає запланованих подій
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-events-container">
      <div className="ue-header">
        <h2 className="ue-main-title">Майбутні події</h2>
      </div>

      <div className="ue-list">
        {events.map((event, index) => (
          <div key={index} className="ue-card">
            <div className="ue-card-content">
              <span className="ue-event-name">{event?.title || 'Без назви'}</span>
              <div className="ue-date-placard">
                <span className="ue-date-text">{event?.date || '--.--'}</span>
                <div className="ue-placard-glow"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectEvent;