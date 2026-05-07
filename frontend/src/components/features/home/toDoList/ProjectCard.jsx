import React from 'react';
import Date from '../../components/ui/date/ToDoDate.jsx';
import Line from '../../components/ui/figures/Line.jsx';
import styles from './ProjectCard.css';

const ProjectCard = ({ projectName, tasks }) => {
  return (
    <div className="card">
      <h3 className="text-title">{projectName}</h3>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-line">
            <div className={styles.taskMain}>
              <div className="cheackbox" />
              <span className="text">{task.text}</span>
            </div>
            <Line></Line>
            <Date>{task.date}</Date>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectCard;