import React, { useState } from 'react';
import ProjectCard from './ProjectCard.jsx';
import './TodoList.css';

const TodoList = ({ projects = [] }) => {
  const [allProjects, setAllProjects] = useState(projects);

  // Функція для оновлення стану завдання
  const handleToggleTask = (projectIndex, taskIndex) => {
    const updatedProjects = [...allProjects];
    const task = updatedProjects[projectIndex].tasks[taskIndex];
    task.completed = !task.completed;
    setAllProjects(updatedProjects);
  };

  // Рахуємо ТІЛЬКИ неперекреслені (невиконані) завдання
  // Якщо хочеш рахувати всі, просто прибери .filter
  const activeTaskCount = allProjects.reduce((acc, proj) => 
    acc + proj.tasks.filter(t => !t.completed).length, 0
  );
  return (
    <div className="todo-main-box">
      <div className="todo-header">
        <h2 className="todo-title">To-do list</h2>
        <span className="todo-list-count">({activeTaskCount})</span>
      </div>
      
      <div className="todo-scroll-area">
        <div className="todo-content-list">
          {allProjects.map((project, index) => (
            <ProjectCard 
              key={index} 
              title={project.title} 
              tasks={project.tasks} 
              onToggle={(taskIdx) => handleToggleTask(index, taskIdx)}
            />
          ))}
        </div>
      </div>
      <div className="todo-fade-overlay" />
    </div>
  );
};

export default TodoList;