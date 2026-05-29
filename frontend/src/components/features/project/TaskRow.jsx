import React from 'react';
import ToDoCheckbox from '../../ui/checkbox/ToDoCheckbox';

const TaskRow = ({ task, onToggle, aiEnabled }) => {
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

  const showAiHint = aiEnabled && task.date && !task.completed;

  return (
    <div className={`lp-task-row ${task.completed ? 'lp-task-completed' : ''}`}>
      <div className="lp-task-left">
        <div className="lp-checkbox-wrapper">
          <ToDoCheckbox checked={task.completed} onChange={onToggle} />
        </div>
        <span className="lp-task-text">{task.text}</span>
      </div>

      <div className="lp-task-right">
        <div className="lp-date-wrapper">
          {task.date ? (
            <div className="lp-date-block">
              <div className="lp-main-date">{formatDate(task.date)}</div>
              <div className={`lp-ai-date ${!showAiHint ? 'lp-hidden' : ''}`}>
                ✨ Оптимально: {formatDate(task.date)}
              </div>
            </div>
          ) : (
            <div className="lp-date-block">
               <button className="lp-date-placeholder">Додати дату</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskRow;