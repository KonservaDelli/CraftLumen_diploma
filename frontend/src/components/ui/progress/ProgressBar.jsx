import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
  const fillVar = progress === 100 ? 'var(--accent-purple)' : 'var(--accent-yellow)';

  return (
    <div className="progress-container">
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${progress}%`, 
            backgroundColor: fillVar 
          }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;