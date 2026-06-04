import React, { useState, useRef, useEffect } from 'react';
import './EventButton.css';

const EventButton = ({ eventName, allEvents = [], onUpdateEvent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const isEventSelected = 
    eventName && 
    eventName !== "null" && 
    eventName !== "undefined" && 
    eventName.trim().length > 0 &&
    eventName.trim() !== "Без події";

  const displayLabel = isEventSelected ? eventName : "Без події";

  // Закриття списку при кліку поза компонентом
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    setIsEditing(true);
    setSearchTerm(''); 
  };

  const handleSelectEvent = (selectedName) => {
    if (onUpdateEvent) {
      onUpdateEvent(selectedName); 
    }
    setIsEditing(false);
  };

  //Фільтрація подій за тайтлом
  const filteredEvents = allEvents.filter(event => 
    event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="event-button-container" ref={containerRef}>
        <div className="event-search-wrapper">
          <input 
            type="text"
            className="event-search-input"
            placeholder="Пошук події..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            autoFocus
          />
        </div>
        
        <div className="event-dropdown-list">
          <div 
            className="event-dropdown-item no-event-option"
            onMouseDown={() => handleSelectEvent("Без події")}
          >
            Без події
          </div>

          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-dropdown-item ${eventName === event.title ? 'active-item' : ''}`}
                onMouseDown={() => handleSelectEvent(event.title)}
                title={event.title}
              >
                {event.title}
              </div>
            ))
          ) : (
            searchTerm.trim() !== '' && (
              <div className="event-dropdown-empty">Нічого не знайдено</div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`event-button-static ${isEventSelected ? 'event-selected' : 'no-event'}`}
      onClick={handleButtonClick}
      style={{ cursor: 'pointer' }}
    >
      <span className="event-button-text">{displayLabel}</span>
    </div>
  );
};

export default EventButton;