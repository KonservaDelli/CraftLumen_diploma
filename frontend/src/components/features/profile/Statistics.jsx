import React from 'react';
import './Statistics.css';

const Statistics = ({ 
  activeProjects = 0, 
  completedProjects = 0, 
  futureEvents = 0 
}) => {
  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2 className="stats-title">Статистика</h2>
      </div>

      <div className="stats-cards-stack">
        <div className="stats-card card-active">
          <div className="card-info">
            <h3 className="card-label">Активні Проєкти</h3>
            <div className="card-value">{activeProjects ?? 0}</div>
            <p className="card-description">Косплеї, які зараз перебувають у процесі розробки.</p>
          </div>
        </div>

        <div className="stats-card card-completed">
          <div className="card-info">
            <h3 className="card-label">Завершені Косплеї</h3>
            <div className="card-value">{completedProjects ?? 0}</div>
            <p className="card-description">Повністю готові образи, які успішно реалізовані.</p>
          </div>
        </div>

        <div className="stats-card card-events">
          <div className="card-info">
            <h3 className="card-label">Майбутні Події</h3>
            <div className="card-value">{futureEvents ?? 0}</div>
            <p className="card-description">Фестивалі, конвенти та тематичні заходи, які ви запланували відвідати.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;