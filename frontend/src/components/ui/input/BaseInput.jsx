import React from 'react';
import './BaseInput.css';

const BaseInput = ({ placeholder = "Назва персонажа", value, onChange, ...props }) => {
  return (
    <div className="base-input-wrapper">
      <input
        type="text"
        className="base-input-element"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default BaseInput;