import React from 'react';
import './SquareButton.css';

const SquareButton = ({ type = 'back', onClick }) => {
  const renderIcon = () => {
    switch (type) {
      case 'menu':
        return (
          <div className="icon-menu-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case 'edit':
        return <span className="icon-action-symbol">✎</span>;
      case 'save':
        return <span className="icon-action-symbol">✓</span>;
      case 'cancel':
        return <span className="icon-action-symbol">✕</span>;
      case 'back':
      default:
        return <span className="icon-arrow-back">⬅</span>;
    }
  };

  return (
    <button className={`square-neon-btn type-${type}`} onClick={onClick} type="button">
      <div className="square-btn-content">
        {renderIcon()}
      </div>
    </button>
  );
};

export default SquareButton;