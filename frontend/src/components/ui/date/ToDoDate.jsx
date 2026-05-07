import React from 'react';
import './ToDoDate.css';

const ToDoDate = ({ children }) => {
  return (
    <div className="date">
        {children}
    </div>
  );
};

export default ToDoDate;