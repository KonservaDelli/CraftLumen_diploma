import React from 'react';
import './ProgressIcon.css';

const ProgressIcon = ({ progress }) => {
  let iconName = 'timeline-icon-empty.png';
  let status = 'empty';

  if (progress === 100) {
    iconName = 'timeline-icon-completed.png';
    status = 'completed';
  } else if (progress > 0) {
    iconName = 'timeline-icon-active.png';
    status = 'active';
  }

  return (
    <div className="icon-container" data-status={status}>
      <img 
        src={`/${iconName}`} 
        alt={status} 
        className="icon" 
      />
    </div>
  );
};

export default ProgressIcon;