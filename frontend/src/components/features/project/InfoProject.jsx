import React, { useState, useRef, useEffect } from 'react';
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
  palette = [],
  allEvents = [],
  onUpdateEvent,
  onUpdateProjectName,
  onUpdateProjectEndDate
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(projectName);
  const nameInputRef = useRef(null);
  const [editEndDateValue, setEditEndDateValue] = useState(endDate || '');
  const dateInputRef = useRef(null);

  useEffect(() => {
    setEditNameValue(projectName);
  }, [projectName]);

  useEffect(() => {
    setEditEndDateValue(endDate || '');
  }, [endDate]);

  const getParsedPalette = () => {
    if (typeof palette === 'string') {
      try {
        return JSON.parse(palette);
      } catch (e) {
        console.error("Помилка парсингу палітри:", e);
        return [];
      }
    }
    return Array.isArray(palette) ? palette : [];
  };

  const currentPalette = getParsedPalette();
  const hasPalette = currentPalette.length > 0;

  const handleSaveName = () => {
    setIsEditingName(false);
    if (editNameValue.trim() && editNameValue.trim() !== projectName) {
      onUpdateProjectName(editNameValue.trim());
    } else {
      setEditNameValue(projectName);
    }
  };

  const handleSaveEndDate = (e) => {
    const nativeDate = e.target.value;
    if (!nativeDate) {
      onUpdateProjectEndDate(null);
      setEditEndDateValue('');
      return;
    }
    
    const [y, m, d] = nativeDate.split('-');
    const formattedDate = `${d}.${m}.${y}`;
    
    if (formattedDate !== endDate) {
      onUpdateProjectEndDate(formattedDate);
      setEditEndDateValue(formattedDate);
    }
  };

  const convertToInputFormat = (dateStr) => {
    if (!dateStr || !dateStr.includes('.')) return '';
    const [d, m, y] = dateStr.split('.');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className={`info-project-card ${hasPalette ? 'with-palette' : 'no-palette'}`}>
      <div className="info-project-header">
        
        <div className="info-dates-row">
          <div className="date-item start">
            <span className="date-label">Розпочато {startDate}</span>
          </div>
          <div 
            className="date-item end editable-date-wrapper"
            style={{ 
              position: 'relative',
              cursor: 'pointer' 
            }}
            title="Натисніть для зміни дати"
            onClick={() => {
              if (dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
                dateInputRef.current.showPicker();
              }
            }}
          >
            <span className="date-label">
              {endDate ? `Дата завершення ${endDate}` : 'Додати дату завершення'}
            </span>
            <input 
              type="date"
              ref={dateInputRef}
              value={convertToInputFormat(editEndDateValue)}
              onChange={handleSaveEndDate}
              onClick={(e) => e.stopPropagation()} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                colorScheme: 'dark',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        <div className="project-main-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div className="project-title-container" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {isEditingName ? (
              <input 
                type="text"
                ref={nameInputRef}
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                autoFocus
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--accent-purple, #8a2be2)',
                  color: 'var(--text-light, #fff)',
                  fontFamily: 'Tektur, sans-serif',
                  fontSize: '40px',
                  fontWeight: 700,
                  padding: '0px',
                  margin: '0px',
                  lineHeight: '1.2',
                  outline: 'none',
                }}
              />
            ) : (
              <h1 
                className="project-title"
                onClick={() => setIsEditingName(true)}
                title="Натисніть, щоб змінити назву"
                style={{ 
                  fontSize: '40px', 
                  fontWeight: 700, 
                  margin: 0, 
                  padding: 0,
                  lineHeight: '1.2',
                  cursor: 'pointer'
                }}
              >
                {projectName}
              </h1>
            )}
          </div>
          
          <div className="project-event-wrapper" style={{ flexShrink: 0 }}>
            <EventButton 
              eventName={eventName} 
              allEvents={allEvents} 
              onUpdateEvent={onUpdateEvent}
            />
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

        {hasPalette && (
          <div className="palette-section">
            {currentPalette.map((item, index) => (
              <PaletBlock 
                key={index} 
                hex={item.color || item.hex} 
                label={item.label} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoProject;