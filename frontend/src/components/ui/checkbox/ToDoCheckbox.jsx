import React from 'react';
import './ToDoCheckbox.css';

const ToDoCheckbox = ({ checked, onChange }) => {
  return (
    <label className="checkbox-container">
      <input type="checkbox" checked={checked} onChange={onChange} className="real-checkbox"/>
      <span className="custom-checkbox" />
    </label>
  );
};

export default ToDoCheckbox;