import React, { useState } from 'react';
import './ProjectsCard.css';

const ProjectsCard = ({ projects }) => {
  const hasUrgentTasks = projects.urgentTasksCount > 0;

  // Встановлюємо початковий стан: якщо є термінові — 'warning', якщо ні — 'progress'
  const [activeStatus, setActiveStatus] = useState(() => 
    hasUrgentTasks ? 'warning' : 'progress'
  );
  const [prevId, setPrevId] = useState(projects.id);
  if (projects.id !== prevId) {
    setPrevId(projects.id);
    setActiveStatus(hasUrgentTasks ? 'warning' : 'progress');
  }
  // Шлях до запасної картинки в папці public
  const defaultImage = '/default-project.jpg';
  const renderDate = () => {
    if (projects.startDate && !projects.endDate) {
      return `Розпочато ${projects.startDate}`;
    }
    return `${projects.startDate} - ${projects.endDate}`;
  };
  return (
    <div className="projects-card-container">
      {/* Верхня частина з картинкою */}
      <div className="projects-card-banner">
        <img src={projects.image ? projects.image : defaultImage} alt={projects.title} className="banner-img" />
        
        {/* Кнопка опцій (три крапки) винесена окремо для збереження форми */}
        <button className="options-trigger">
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Основна інформаційна плашка (твоя "папка") */}
      <div className="projects-card-content">
        <p className="projects-dates-text">
          {renderDate()}
        </p>
        
        <h3 className="projects-display-title">{projects.title}...</h3>
        
        <div className="card-horizontal-line"></div>

        <div className="card-status-footer">
          <div className={`status-icons-wrapper ${!hasUrgentTasks ? 'single-icon' : ''}`}>
            <div 
              className={`status-box percent-box ${activeStatus === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveStatus('progress')}
            >
              %
            </div>
            {hasUrgentTasks && (
              <div 
                className={`status-box warning-box ${activeStatus === 'warning' ? 'active' : ''}`}
                onClick={() => setActiveStatus('warning')}
              >
                !
              </div>
            )}
          </div>

          <div className="status-message-area">
            <p className={`warning-text-msg ${activeStatus === 'warning' ? 'status-warning' : 'status-progress'}`}>
              {activeStatus === 'warning' 
                ? "Попередження, є завдання, що потребують негайного виконання" 
                : `Проєкт виконано на ${projects.progress}%`}
            </p>
          </div>
        </div>
        </div>
      </div>
  );
};

export default ProjectsCard;