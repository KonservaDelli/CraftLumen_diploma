import React from 'react';
import ProjectCard from './ProjectCard.jsx';
import './TodoList.css';

const TodoList = ({ projects = [], onToggleTask}) => {
  const activeTaskCount = projects.reduce((acc, proj) => 
    acc + proj.tasks.filter(t => !t.completed).length, 0
  );

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2 className="todo-title">To-do list</h2>
        <span className="todo-list-count">({activeTaskCount})</span>
      </div>
      
      <div className="todo-scroll-area">
        <div className="todo-content">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                title={project.title} 
                tasks={project.tasks} 
                onToggle={onToggleTask}
              />
            ))
          ) : (
            <div className="no-tasks">
              <p>
                На цей день завдань немає
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="todo-fade-overlay" />
    </div>
  );
};

export default TodoList;