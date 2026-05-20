import React, { useState } from 'react';
import './UserAvatar.css';

const UserAvatar = ({ src, size = 60, onClick }) => {
  const defaultImage = '/default-profile.jpg';
  const [isError, setIsError] = useState(false);
  const handleError = () => {
    setIsError(true);
  };
  const currentSrc = (isError || !src) ? defaultImage : src;
  return (
    <div 
      className="user-avatar-container" 
      onClick={onClick}
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
    >
      <img 
        key={src} //скидає стан, якщо є новий src
        src={currentSrc} 
        alt="User Profile" 
        className="user-avatar-img"
        onError={handleError}
      />
    </div>
  );
};

export default UserAvatar;