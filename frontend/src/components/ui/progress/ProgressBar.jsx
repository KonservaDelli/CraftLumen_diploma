import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
  // Вибираємо, яку саме твою змінну використати для заливки
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