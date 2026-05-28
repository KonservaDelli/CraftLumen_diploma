import React from 'react';
import './SquareButton.css';

/**
 * Універсальна квадратна кнопка для інтерфейсу
 * @param {string} type - 'back' (зі стрілкою) або 'menu' (з точками)
 * @param {function} onClick - обробник події натискання
 */
const SquareButton = ({ type = 'back', onClick }) => {
  return (
    <button className="square-neon-btn" onClick={onClick} type="button">
      <div className="square-btn-content">
        {type === 'menu' ? (
          <div className="dots-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <img src="arrow-icon.png" alt="Назад" className="back-arrow-img" />
        )}
      </div>
    </button>
  );
};

export default SquareButton;