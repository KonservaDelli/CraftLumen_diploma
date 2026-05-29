import React from 'react'; // Видалили useState з імпорту
import SectionBlock from './SectionBlock.jsx';
import './ListProject.css';

const ListProject = ({ sections, setSections, aiEnabled = true }) => {
  const handleAddTask = async (sectionId, newTaskData) => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskData.text, // текст з форми
          section_id: sectionId
        }),
      });

      if (response.ok) {
        const savedTask = await response.json(); 
      // savedTask вже містить { id, title, completed ... }
      
        setSections(prev => prev.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              tasks: [...(section.tasks || []), savedTask] // savedTask має поле title
            };
          }
          return section;
        }));
      }
    } catch (error) {
      console.error("Помилка збереження завдання:", error);
    }
  };

  // ПЕРЕМИКАННЯ СТАТУСУ В БД
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
              tasks: section.tasks.map(t => 
                t.id === taskId ? { ...t, completed: !t.completed } : t
              )
            };
          }
          return section;
        }));
      }
    } catch (error) {
      console.error("Помилка оновлення статусу:", error);
    }
  };

  return (
    <div className="lp-main-wrapper">
      <div className="lp-sections-list">
        {sections.map(section => (
          <SectionBlock 
            key={section.id} 
            section={section} 
            onAddTask={handleAddTask}
            onToggle={handleToggleTask}
            aiEnabled={aiEnabled}
          />
        ))}
      </div>
    </div>
  );
};

export default ListProject;