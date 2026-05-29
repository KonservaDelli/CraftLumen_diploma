import React from 'react'; // Видалили useState з імпорту
import SectionBlock from './SectionBlock.jsx';
import './ListProject.css';

const ListProject = ({ sections, setSections, aiEnabled = true }) => {
  
  const handleAddTask = (sectionId, newTask) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: [...(section.tasks || []), { ...newTask, id: Date.now(), completed: false }]
        };
      }
      return section;
    }));
  };

  const handleToggleTask = (sectionId, taskId) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: (section.tasks || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return section;
    }));
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