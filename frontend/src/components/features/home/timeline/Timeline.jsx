import React from 'react';
import ProgressIcon from '../../../ui/progress/ProgressIcon';
import ProgressBar from '../../../ui/progress/ProgressBar';
import './Timeline.css';

const Timeline = ({ progress = 0, festivalName = "" }) => {
  return (
    <div className="container">
      <div className="timeline-header">
        <h3 className="title">Timeline</h3>
        {festivalName && (
          <span className="festival-name">{festivalName}</span>
        )}
      </div>
      
      <div className="timeline-body">
        <ProgressIcon progress={progress} />
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};

export default Timeline;