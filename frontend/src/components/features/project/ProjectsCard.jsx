import React, { useState } from 'react';
import './ProjectsCard.css';
import { useNavigate } from 'react-router-dom';

const ProjectsCard = ({ projects }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  
  // Логіка статусів
  const hasUrgentTasks = projects.urgentTasksCount > 0;
  const [activeStatus, setActiveStatus] = useState(hasUrgentTasks ? 'warning' : 'progress');

  const handleCardClick = () => {
    navigate(`/project/${projects.id}`);
  };

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    console.log("Видалити проєкт", projects.id);
  };

  const renderDate = () => {
    if (projects.startDate && !projects.endDate) return `Розпочато ${projects.startDate}`;
    return `${projects.startDate} - ${projects.endDate}`;
  };

  return (
    <div className="projects-card-container" onClick={handleCardClick}>
      <div className="projects-card-banner">
        <img src={projects.image || '/default-project.jpg'} className="banner-img" alt={projects.title} />
        
        <button className="options-trigger" onClick={toggleOptions}>
          <span></span><span></span><span></span>
          {showOptions && (
            <div className="options-dropdown">
              <div className="option-item delete" onClick={handleDelete}>Видалити</div>
            </div>
          )}
        </button>
      </div>

      <div className="projects-card-content">
        <p className="projects-dates-text">{renderDate()}</p>
        <h3 className="projects-display-title">{projects.title}</h3>
        <div className="card-horizontal-line"></div>

        <div className="card-status-footer" onClick={(e) => e.stopPropagation()}> 
          {/* Додаємо onClick на весь футер, щоб кліки по тексту теж не перекидали на сторінку */}
          
          <div className={`status-icons-wrapper ${!hasUrgentTasks ? 'single-icon' : ''}`}>
            <div 
              className={`status-box percent-box ${activeStatus === 'progress' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Зупиняємо клік тут
                setActiveStatus('progress');
              }}
            >
              %
            </div>

            {hasUrgentTasks && (
              <div 
                className={`status-box warning-box ${activeStatus === 'warning' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); // Зупиняємо клік тут
                  setActiveStatus('warning');
                }}
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