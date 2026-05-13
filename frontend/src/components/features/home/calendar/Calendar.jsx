import React, { useState } from 'react';
import './Calendar.css';


const Calendar = ({ onDateChange }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedFullDate, setSelectedFullDate] = useState(new Date());
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const monthName = viewDate.toLocaleString('uk-UA', { month: 'long' });
  const year = viewDate.getFullYear();

  const generateDays = () => {
    const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    
    const days = [];
    let firstDayIndex = startOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: '', currentMonth: false });
    }

    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push({ day: i, currentMonth: true });
    }
    return days;
  };

  const handleDayClick = (day) => {
    if (day) {
      const newFullDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      setSelectedFullDate(newFullDate);
      if (onDateChange) onDateChange(newFullDate);
    }
  };

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  return (
    <div className="calendar-container"> {/* Змінено клас на більш унікальний */}
      <h3 className="calendar-title">Calendar</h3>
      
      <div className="calendar-header">
        <button className="nav-button" onClick={() => changeMonth(-1)}>&lt;</button>
        <div className="date-display">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} &nbsp; {year}
        </div>
        <button className="nav-button" onClick={() => changeMonth(1)}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(d => (
          <div key={d} className="grid-weekday">{d}</div>
        ))}
        
        {generateDays().map((item, index) => {
          const isSelected = item.currentMonth && 
            selectedFullDate.getDate() === item.day &&
            selectedFullDate.getMonth() === viewDate.getMonth() &&
            selectedFullDate.getFullYear() === viewDate.getFullYear();

          return (
            <div 
              key={index} 
              className={`grid-day ${!item.currentMonth ? 'empty' : ''} ${isSelected ? 'active-day' : ''}`} 
              onClick={() => handleDayClick(item.day)}
            >
              <span>{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;