import React, { useState } from 'react';
import './EventCard.css';

const EventCard = ({ event }) => {
  const [imgError, setImgError] = useState(false);
  const defaultImage = '/default-project.jpg'; 
  const currentImage = (imgError || !event.image_url) ? defaultImage : event.image_url;

  return (
    <div className="events-card-container">
      <div className="events-card-banner">
        <img 
          src={currentImage} 
          className="event-banner-img" 
          alt={event.title} 
          onError={() => setImgError(true)}
        />
      </div>

      <div className="events-card-content">
        <p className="events-dates-text">
          {event.display_date || "Дата уточнюється"}
        </p>
        
        <h3 className="events-display-title">{event.title}</h3>
        <div className="event-horizontal-line"></div>
        <div className="event-description-area">
          <p className="event-description-text">
            {event.description || "Опис події відсутній..."}
          </p>
        </div>

        {event.event_url && (
          <a 
            href={event.event_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="event-more-button"
            style={{ 
              display: 'inline-block', 
              marginTop: '18px', 
              color: '#d6a3fb',
              fontFamily: 'Fira Sans', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            Детальніше про квитки →
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;