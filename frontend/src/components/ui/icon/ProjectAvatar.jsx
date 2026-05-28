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
        // Додатковий захист: якщо файл не завантажився (помилка 404), ставимо дефолт
        onError={(e) => { e.target.src = "default-project.jpg"; }}
    />
    </div>
  );
};

export default ProjectAvatar;