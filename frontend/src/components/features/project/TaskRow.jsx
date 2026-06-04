import React, { useRef } from 'react';
import ToDoCheckbox from '../../ui/checkbox/ToDoCheckbox';

const TaskRow = ({ task, onToggle, onUpdateDate, onDelete, aiEnabled, aiDates = {} }) => {
  const dateInputRef = useRef(null);
  const months = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ];

  const formatDate = (str) => {
    if (!str || !str.includes('.')) return str;
    const parts = str.split('.');
    if (parts.length < 2) return str;
    const dayPart = parts[0]; 
    const monthIdx = parseInt(parts[1]) - 1;
    return `${dayPart} ${months[monthIdx]}`;
  };

  const convertToInputFormat = (dateStr) => {
    if (!dateStr || !dateStr.includes('.')) return '';
    const [d, m, y] = dateStr.split('.');
    return `${y}-${m}-${d}`;
  };

  const handleDateChange = (e) => {
    const nativeDate = e.target.value;
    if (!nativeDate) return;
    const [y, m, d] = nativeDate.split('-');
    const formattedDate = `${d}.${m}.${y}`;
    if (onUpdateDate) {
      onUpdateDate(formattedDate);
    }
  };

  const handleWrapperClick = (e) => {
    e.stopPropagation(); 
    if (dateInputRef.current) {
      dateInputRef.current.showPicker(); 
    }
  };

  const userDate = task.end_date || task.start_date;
  const taskTitleClean = task.title ? task.title.trim().toLowerCase() : '';
  const aiRecommendedDate = Object.keys(aiDates).reduce((acc, key) => {
    if (key.trim().toLowerCase() === taskTitleClean) {
      return aiDates[key];
    }
    return acc;
  }, null);

  const showAiHint = aiEnabled && aiRecommendedDate && !task.completed;

  return (
    <div className={`lp-task-row ${task.completed ? 'lp-task-completed' : ''}`}>
      <div className="lp-task-left">
        <div className="lp-checkbox-wrapper">
          <ToDoCheckbox checked={task.completed} onChange={onToggle} />
        </div>
        <span className="lp-task-text">{task.title}</span>
      </div>
      <div className="lp-task-right" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '15px' }}>
        <button 
          className="lp-task-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '0px',
            background: 'none',
            border: 'none',
            color: 'var(--text-light)',
            fontSize: '20px',
            opacity: '0.7',
            cursor: 'pointer',
            padding: '2px 10px',
            lineHeight: '1',
            zIndex: 10
          }}
          title="Видалити завдання"
        >
          ✕
        </button>

        <div 
          className="lp-date-wrapper" 
          onClick={handleWrapperClick} 
          style={{ cursor: 'pointer', position: 'relative', width: '100%' }}
        >
          <input 
            type="date"
            ref={dateInputRef}
            value={convertToInputFormat(userDate)}
            onChange={handleDateChange}
            style={{
              position: 'absolute',
              visibility: 'hidden',
              width: 0,
              height: 0,
              colorScheme: 'dark'
            }}
          />
          <div className="lp-date-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {userDate ? (
              <div className="lp-main-date">{formatDate(userDate)}</div>
            ) : (
              <button className="lp-date-placeholder" type="button">Додати дату</button>
            )}

            {showAiHint && (
              <div className="lp-ai-date" style={{ marginTop: '4px', whiteSpace: 'nowrap', fontFamily: 'Fira Sans', fontSize: '1rem', fontWeight: '400'}}>
                ✨ Оптимально: {formatDate(aiRecommendedDate)}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskRow;