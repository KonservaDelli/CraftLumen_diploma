import React, { useState } from 'react'; 
import SectionBlock from './SectionBlock.jsx';
import './ListProject.css';

const ListProject = ({ sections, setSections, aiEnabled = true, aiDates = {}, projectId }) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const handleAddSectionSubmit = async () => {
    if (!sectionTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: sectionTitle.trim(),
          project_id: projectId
        }),
      });

      if (response.ok) {
        const newSection = await response.json();
        setSections(prev => [...prev, { ...newSection, tasks: [] }]);
        setSectionTitle('');
        setIsAddingSection(false);
      }
    } catch (error) {
      console.error("Помилка додавання розділу:", error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSections(prev => prev.filter(section => section.id !== sectionId));
      }
    } catch (error) {
      console.error("Помилка видалення розділу:", error);
    }
  };

  const handleUpdateSectionTitle = async (sectionId, newTitle) => {
    try {
      const response = await fetch(`http://localhost:8000/api/sections/${sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_name: newTitle }), 
      });

      if (response.ok) {
        setSections(prev => prev.map(section => 
          section.id === sectionId ? { ...section, title: newTitle } : section
        ));
      }
    } catch (error) {
      console.error("Помилка оновлення назви розділу:", error);
    }
  };

  const handleAddTask = async (sectionId, newTaskData) => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskData.text, 
          section_id: sectionId,
          start_date: newTaskData.date || null, 
          end_date: newTaskData.date || null     
        }),
      });

      if (response.ok) {
        const savedTask = await response.json(); 
        setSections(prev => prev.map(section => {
          if (section.id === sectionId) {
            return { ...section, tasks: [...(section.tasks || []), savedTask] };
          }
          return section;
        }));
      }
    } catch (error) {
      console.error("Помилка збереження завдання:", error);
    }
  };

  const handleToggleTask = async (sectionId, taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/toggle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setSections(prev => prev.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              tasks: section.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
            };
          }
          return section;
        }));
      }
    } catch (error) {
      console.error("Помилка оновлення статусу:", error);
    }
  };

  const handleUpdateTaskDate = async (sectionId, taskId, newDate) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: newDate || null, end_date: newDate || null }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setSections(prev => prev.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              tasks: section.tasks.map(t => 
                t.id === taskId ? { ...t, start_date: updatedTask.start_date, end_date: updatedTask.end_date } : t
              )
            };
          }
          return section;
        }));
      }
    } catch (error) {
      console.error("Помилка оновлення дати завдання:", error);
    }
  };

  const handleDeleteTask = async (sectionId, taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, { method: 'DELETE' });
      if (response.ok) {
        setSections(prev => prev.map(section => {
          if (section.id === sectionId) {
            return { ...section, tasks: section.tasks.filter(t => t.id !== taskId) };
          }
          return section;
        }));
      }
    } catch (error) {
      console.error("Помилка видалення завдання:", error);
    }
  };

  return (
    <div className="lp-main-wrapper">
      <div className="lp-global-header-wrapper">
        <h3 className="lp-global-title">Список завдань</h3>
        <button 
          className="lp-add-btn-trigger" 
          onClick={() => setIsAddingSection(!isAddingSection)}
          title="Додати новий розділ"
        >
          +
        </button>
        {isAddingSection && (
          <div className="lp-section-add-popover">
            <h3 className="lp-popover-title">Новий розділ</h3>
            <button className="lp-popup-close" onClick={() => setIsAddingSection(false)}>✕</button>
            <div className="lp-popover-row">
              <input 
                className="lp-popover-input-field" 
                placeholder="Назва нового розділу"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSectionSubmit()}
                autoFocus
              />
              <button className="lp-popup-submit" onClick={handleAddSectionSubmit}>Додати</button>
            </div>
          </div>
        )}
      </div>

      <div className="lp-sections-list">
        {sections.map(section => (
          <SectionBlock 
            key={section.id} 
            section={section} 
            onAddTask={handleAddTask}
            onToggle={handleToggleTask}
            onUpdateDate={handleUpdateTaskDate} 
            onDeleteTask={handleDeleteTask}
            onDeleteSection={handleDeleteSection}
            onUpdateSectionTitle={handleUpdateSectionTitle}
            aiEnabled={aiEnabled}
            aiDates={aiDates}
          />
        ))}
      </div>
    </div>
  );
};

export default ListProject;