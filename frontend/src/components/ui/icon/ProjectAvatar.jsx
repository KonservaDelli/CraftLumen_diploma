import React, { useRef } from 'react';
import './ProjectAvatar.css';

const ProjectAvatar = ({ src, alt = "Project Avatar", onUpdateImage }) => {
  const imageSource = src ? src : "default-project.jpg";
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (onUpdateImage && fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (onUpdateImage && e.target.files && e.target.files[0]) {
        onUpdateImage(e.target.files[0]);
    }
  };

  return (
    <div 
        className={`project-avatar-card ${onUpdateImage ? 'editable' : ''}`}
        onClick={handleClick}
    >
        <img 
            src={imageSource} 
            alt={alt} 
            className="avatar-image-content" 
            onError={(e) => { e.target.src = "default-project.jpg"; }}
        />
        
        {onUpdateImage && (
            <div className="avatar-overlay">
                <span className="overlay-text">Змінити зображення</span>
            </div>
        )}

        {onUpdateImage && (
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        )}
    </div>
  );
};

export default ProjectAvatar;