import React, { useState, useRef, useEffect } from 'react';
import TaskRow from './TaskRow.jsx';

const SectionBlock = ({ section, onAddTask, onToggle, aiEnabled }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const formRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (isAdding && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isAdding]);

  // маска дати
  const handleDateInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = value.slice(0, 2);
      if (value.length > 2) {
        formattedValue += '.' + value.slice(2, 4);
        if (value.length > 4) {
          formattedValue += '.' + value.slice(4, 8);
        }
      }
    }
    setTaskDate(formattedValue);
  };

  // Вибір через системний календар
  const handleNativeDateChange = (e) => {
    const date = e.target.value; // рррр-мм-дд
    if (!date) return;
    const [y, m, d] = date.split('-');
    setTaskDate(`${d}.${m}.${y}`);
  };

  const submit = () => {
    if (!taskText.trim()) return;
    
    // Передаємо об'єкт з даними завдання
    onAddTask(section.id, { 
      text: taskText, 
      date: taskDate 
    });
    
    setTaskText('');
    setTaskDate('');
    setIsAdding(false);
  };

  return (
    <div className="lp-section-card">
      <div className="lp-section-header">
        <h3 className="lp-section-title">{section.title.toUpperCase()}</h3>
        <button className="lp-add-btn-trigger" onClick={() => setIsAdding(!isAdding)}>+</button>
      </div>

      <div className="lp-tasks-container">
        {section.tasks?.map(task => (
          <TaskRow 
            key={task.id} 
            task={task} 
            onToggle={() => onToggle(section.id, task.id)}
            aiEnabled={aiEnabled} 
          />
        ))}
      </div>

      {isAdding && (
        <div className="lp-add-popup" ref={formRef}>
          <button className="lp-popup-close" onClick={() => setIsAdding(false)}>✕</button>
          <input 
            className="lp-popup-input" 
            placeholder="Назва завдання"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <div className="lp-popup-row">
            <div className="lp-date-input-wrapper">
              <input 
                type="text"
                className="lp-popup-input lp-mask-input"
                placeholder="дд.мм.рррр"
                value={taskDate}
                onChange={handleDateInput}
                maxLength="10"
              />
              <input 
                type="date"
                className="lp-native-hidden"
                onChange={handleNativeDateChange}
                ref={dateInputRef}
              />
              <button 
                className="lp-calendar-icon" 
                onClick={() => dateInputRef.current.showPicker()}
                type="button"
              >
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
              </button>
            </div>
            <button className="lp-popup-submit" onClick={submit}>Додати</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionBlock;