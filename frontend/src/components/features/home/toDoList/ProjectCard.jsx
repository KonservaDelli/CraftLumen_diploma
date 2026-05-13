import React from 'react';
import Checkbox from '../../../ui/checkbox/ToDoCheckbox.jsx';
import Line from '../../../ui/figures/Line.jsx';
import ToDoDate from '../../../ui/date/ToDoDate.jsx';
import './ProjectCard.css';

const ProjectCard = ({ title, tasks, onToggle }) => {
  return (
    <div className="project-card-container">
      <h4 className="project-card-title">{title}</h4>
      <div className="card-body">
        <div className="tasks-container">
          {tasks.map((task) => (
            <div key={task.id} className="task-row">
              <Checkbox 
                checked={task.completed} 
                onChange={() => onToggle(task.id)}
              />
              <span className={`task-text ${task.completed ? 'strikethrough' : ''}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
        
        <div className="dates-section">
          <div className="line-wrapper">
            <Line />
          </div>
          <div className="dates-column">
            {tasks.map((task) => (
              <div key={task.id} className="date-item-row">
                <ToDoDate>{task.displayDate}</ToDoDate>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;