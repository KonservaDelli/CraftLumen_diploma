import React from 'react';
import './InfoProject.css';
import EventButton from '../../ui/figures/EventButton';
import AssistantButton from '../../ui/button/AssistantButton';
import PaletBlock from '../../ui/figures/PaletBlock';

const InfoProject = ({ 
  startDate, 
  endDate, 
  projectName, 
  eventName, 
  isAssistantActive, 
  onAssistantToggle,
  palette = [] 
}) => {
  // Перевіряємо, чи є дані в палітрі
  const hasPalette = palette && palette.length > 0;

  return (
    <div className={`info-project-card ${hasPalette ? 'with-palette' : 'no-palette'}`}>
      <div className="info-project-header">
        <div className="info-dates-row">
          <div className="date-item start">
            <span className="date-label">Розпочато {startDate}</span>
          </div>
          
          {endDate && (
            <div className="date-item end">
              <span className="date-label">Дата завершення {endDate}</span>
            </div>
          )}
        </div>

        <div className="project-main-row">
          <h1 className="project-title">{projectName}</h1>
          <div className="project-event-wrapper">
            <EventButton eventName={eventName} />
          </div>
        </div>
      </div>

      <div className="horizontal-divider-bold" />

      <div className="info-project-footer">
        <div className="assistant-section">
          <AssistantButton 
            isActive={isAssistantActive} 
            onToggle={onAssistantToggle} 
          />
          <span className="assistant-text">Помічник з таймменеджменту</span>
        </div>

        {/* Рендеримо секцію палітри тільки якщо вона є */}
        {hasPalette && (
          <div className="palette-section">
            {palette.map((color, index) => (
              <PaletBlock 
                key={index} 
                hex={color.hex} 
                label={color.label} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoProject;