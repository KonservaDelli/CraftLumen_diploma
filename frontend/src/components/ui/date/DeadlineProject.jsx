import React, { useRef } from 'react';
import './DeadlineProject.css';

const DeadlineProject = ({ 
  value = "", 
  onChange, 
  placeholder = "dd.mm.yyyy" 
}) => {
  const dateInputRef = useRef(null);

  // Викликає вікно календаря
  const handleIconClick = (e) => {
    e.stopPropagation(); 
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  // Конвертує дату з календаря
  const handleCalendarChange = (e) => {
    const isoDate = e.target.value;
    if (!isoDate) return;
    const [year, month, day] = isoDate.split("-");
    onChange?.(`${day}.${month}.${year}`);
  };

  const getIsoValue = () => {
    if (!value || !value.includes('.')) return "";
    const [day, month, year] = value.split(".");
    if (day && month && year && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  return (
    <div className="deadline-input-wrapper">
      <input
        type="text"
        className={`deadline-text-input ${value ? 'has-value' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        maxLength={10}
      />

      <div className="deadline-icon-box" onClick={handleIconClick}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="deadline-calendar-icon"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        <input
          type="date"
          ref={dateInputRef}
          className="deadline-hidden-date-input"
          value={getIsoValue()}
          onChange={handleCalendarChange}
        />
      </div>
    </div>
  );
};

export default DeadlineProject;