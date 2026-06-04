import React, { useState } from 'react';
import './ProjectsCard.css';
import { useNavigate } from 'react-router-dom';

const ProjectsCard = ({ projects, onDelete }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [userSelectedStatus, setUserSelectedStatus] = useState(null);
  const isTodayOrTomorrow = (dateStr) => {
    if (!dateStr) return false;

    let normalizedDate = dateStr;
    if (dateStr.includes('.')) {
      const [day, month, year] = dateStr.split('.');
      normalizedDate = `${year}-${month}-${day}`;
    }

    const taskDate = new Date(normalizedDate);
    taskDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return taskDate.getTime() === today.getTime() || taskDate.getTime() === tomorrow.getTime();
  };

  const hasUrgentTasks = (() => {
    if (projects.sections && projects.sections.length > 0) {
      const allTasks = projects.sections.flatMap(s => s.tasks || []);
      return allTasks.some(t => 
        !t.completed && 
        isTodayOrTomorrow(t.end_date || t.start_date || t.date || t.dueDate || t.due_date)
      );
    }
    return projects.urgentTasksCount > 0;
  })();
  const activeStatus = userSelectedStatus ?? (hasUrgentTasks ? 'warning' : 'progress');

  // Динамічний розрахунок прогресу
  const displayProgress = (() => {
    if (projects.sections && projects.sections.length > 0) {
      const allTasks = projects.sections.flatMap(s => s.tasks || []);
      if (allTasks.length === 0) return 0;
      const completedTasks = allTasks.filter(t => t.completed).length;
      return Math.round((completedTasks / allTasks.length) * 100);
    }
    return projects.progress ?? 0;
  })();

  const handleCardClick = () => {
    navigate(`/project/${projects.slug || projects.id}`);
  };

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowOptions(false);
    if (onDelete) {
      onDelete(projects.id);
    }
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
          <div className={`status-icons-wrapper ${!hasUrgentTasks ? 'single-icon' : ''}`}>
            <div 
              className={`status-box percent-box ${activeStatus === 'progress' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setUserSelectedStatus('progress');
              }}
            >
              %
            </div>
            {hasUrgentTasks && (
              <div 
                className={`status-box warning-box ${activeStatus === 'warning' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUserSelectedStatus('warning');
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
                : `Проєкт виконано на ${displayProgress}%`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCard;