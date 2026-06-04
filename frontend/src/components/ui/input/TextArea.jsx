import React from 'react';
import './TextArea.css';

const TextArea = ({ 
  placeholder = "Аксесуари, Взуття, тощо...", 
  value, 
  onChange, 
  rows = 4,
  ...props 
}) => {
  return (
    <div className="textarea-wrapper">
      <textarea
        className="textarea-element"
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default TextArea;