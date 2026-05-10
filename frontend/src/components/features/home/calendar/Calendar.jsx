import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  
  const monthName = viewDate.toLocaleString('uk-UA', { month: 'long' });
  const year = viewDate.getFullYear();

  //Генерації днів місяця
  const generateDays = () => {
    const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    
    const days = [];
    let firstDayIndex = startOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: '', currentMonth: false });
    }

    //числа місяця
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push({ day: i, currentMonth: true });
    }

    return days;
  };

  const handleDayClick = (day) => {
    if (day) setSelectedDate(day);
  };

  return (
    <div className="container">
      <h3 className="text">Calendar</h3>
      
      <div className="header">
        <button className="button" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}>&lt;</button>
        <div className="date-display">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)} &nbsp; {year}
        </div>
        <button className="button" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(d => (
          <div key={d} className="grid-weekday">{d}</div>
        ))}
        
        {generateDays().map((item, index) => (
          <div key={index} className={`grid-day ${!item.currentMonth ? 'empty' : ''} ${item.day === selectedDate && item.currentMonth ? 'active-day' : ''}`} onClick={() => handleDayClick(item.day)}>
            <span>{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;