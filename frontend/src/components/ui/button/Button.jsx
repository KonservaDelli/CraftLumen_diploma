import React from 'react';
import './Button.css';

const Button = ({ 
  text, 
  onClick, 
  variant = 'primary', 
  iconName,
  className = '' 
}) => {
  return (
    <button 
      className={`custom-button btn-${variant} ${className}`} 
      onClick={onClick}
    >
      <span className="button-text">{text}</span>
      {iconName && (
        <img 
          src={`/${iconName}`} 
          alt="icon" 
          className="button-icon-img" 
        />
      )}
    </button>
  );
};

export default Button;