import React from 'react';
import './ProjectAvatar.css';

const ProjectAvatar = ({ src, alt = "Project Avatar" }) => {
  const imageSource = src ? src : "default-project.jpg";

  return (
    <div className="project-avatar-card">
    <img 
        src={imageSource} 
        alt={alt} 
        className="avatar-image-content" 
        onError={(e) => { e.target.src = "default-project.jpg"; }}
    />
    </div>
  );
};

export default ProjectAvatar;