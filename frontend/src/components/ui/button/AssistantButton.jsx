import React from 'react';
import './AssistantButton.css';

const AssistantButton = ({ isActive = false, onToggle }) => {
  const handleToggle = () => {
    if (onToggle) onToggle(!isActive);
  };

  return (
    <button 
      type="button"
      className={`assistant-switch-root ${isActive ? 'is-active' : 'is-inactive'}`}
      onClick={handleToggle}
    >
      <div className="switch-track">
        <div className="switch-thumb">
          {isActive ? 'ON' : 'OFF'}
        </div>
      </div>
    </button>
  );
};

export default AssistantButton;