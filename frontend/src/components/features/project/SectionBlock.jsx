import React, { useState, useRef, useEffect } from 'react';
import TaskRow from './TaskRow.jsx';

const SectionBlock = ({ 
  section, onAddTask, onToggle, onUpdateDate, onDeleteTask, 
  onDeleteSection, onUpdateSectionTitle, aiEnabled, aiDates = {} 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(section.title);
  const formRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (isAdding && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isAdding]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (editTitleValue.trim() && editTitleValue.trim() !== section.title) {
      onUpdateSectionTitle(section.id, editTitleValue.trim());
    } else {
      setEditTitleValue(section.title);
    }
  };

  const handleDateInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = value.slice(0, 2);
      if (value.length > 2) {
        formattedValue += '.' + value.slice(2, 4);
        if (value.length > 4) formattedValue += '.' + value.slice(4, 8);
      }
    }
    setTaskDate(formattedValue);
  };

  const handleNativeDateChange = (e) => {
    const date = e.target.value; 
    if (!date) return;
    const [y, m, d] = date.split('-');
    setTaskDate(`${d}.${m}.${y}`);
  };

  const submit = () => {
    if (!taskText.trim()) return;
    onAddTask(section.id, { text: taskText, date: taskDate });
    setTaskText('');
    setTaskDate('');
    setIsAdding(false);
  };

  return (
    <div className="lp-section-card">
      <div className="lp-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              style={{
                background: 'var(--accent-purple-light)',
                color: 'var(--text-light)',
                outline: 'none',
                border: 'none',
                borderBottom: '2px solid var(--accent-purple)',
                fontSize: '30px',
                fontWeight: '500',
                padding: '2px 8px',
                fontFamily: 'inherit',
                width: '80%'
              }}
            />
          ) : (
            <>
              <h3 
                className="lp-section-title" 
                onClick={() => setIsEditingTitle(true)}
                title="Натисніть для редагування"
                style={{ cursor: 'pointer', margin: 0 }}
              >
                {section.title}
              </h3>
              <button 
                onClick={() => onDeleteSection(section.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-purple)',
                  fontSize: '24px',
                  fontWeight: 800,
                  opacity: 0.8,
                  cursor: 'pointer',
                  padding: '2px 6px',
                  lineHeight: 1,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0.6}
                title="Видалити цей розділ і всі його завдання"
              >
                ✕
              </button>
            </>
          )}
        </div>
        <div>
          <button className="lp-add-btn-trigger" onClick={() => setIsAdding(!isAdding)}>+</button>
        </div>
      </div>

      <div className="lp-tasks-container">
        {section.tasks?.map(task => (
          <TaskRow 
            key={task.id} 
            task={task} 
            onToggle={() => onToggle(section.id, task.id)}
            onUpdateDate={(newDate) => onUpdateDate(section.id, task.id, newDate)} 
            onDelete={() => onDeleteTask(section.id, task.id)}
            aiEnabled={aiEnabled} 
            aiDates={aiDates}
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
                style={{ colorScheme: 'dark' }}
              />
              <button 
                className="lp-calendar-icon" 
                onClick={() => dateInputRef.current.showPicker()}
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F1EBFFB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="deadline-calendar-icon">
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