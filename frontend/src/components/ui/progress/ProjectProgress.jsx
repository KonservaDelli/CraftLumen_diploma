import React from 'react';
import './ProjectProgress.css';

const ProjectProgress = ({ value = 0 }) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="project-progress-container">
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
      <span className="progress-percentage">{safeValue}%</span>
    </div>
  );
};

export default ProjectProgress;