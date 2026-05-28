import React from 'react';
import './EventButton.css';

/**
 * Компонент кнопки події з двома станами (обрано/не обрано)
 */
const EventButton = ({ eventName }) => {
  const isEventSelected = !!eventName;
  const displayLabel = eventName ? eventName : "Оберіть подію";
  
  return (
    <div className={`event-button-static ${!isEventSelected ? 'no-event' : 'event-selected'}`}>
      <span className="event-button-text">{displayLabel}</span>
    </div>
  );
};

export default EventButton;