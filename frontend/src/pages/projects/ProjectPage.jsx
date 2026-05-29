import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ProjectAvatar from '../../components/ui/icon/ProjectAvatar';
import InfoProject from '../../components/features/project/InfoProject';
import ProjectProgress from '../../components/ui/progress/ProjectProgress';
import ListProject from '../../components/features/project/ListProject';
import Notebook from '../../components/features/project/Notebook';
import UrlBlock from '../../components/features/project/UrlBlock';
import SquareButton from '../../components/ui/button/SquareButton';

import './ProjectPage.css';

const ProjectPage = () => {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssistantActive, setIsAssistantActive] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/project/${projectSlug}`);
        if (!response.ok) throw new Error('Проєкт не знайдено');
        const data = await response.json();
        
        setProjectData(data);
        // ТЕПЕР: просто беремо sections, бо це вже масив з БД
        setSections(data.sections || []); 
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectSlug]);

  if (loading) return <MainLayout><div className="loader">Завантаження...</div></MainLayout>;
  
  if (!projectData) {
    return (
      <MainLayout>
        <div className="error-container">
          <h2>Проєкт не знайдено</h2>
          <SquareButton type="back" onClick={() => navigate('/projects')} />
        </div>
      </MainLayout>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Видалити цей проєкт?")) {
      await fetch(`http://localhost:8000/api/projects/${projectData.id}`, { method: 'DELETE' });
      navigate('/projects');
    }
  };

  const calculateProgress = () => {
    const allTasks = sections.flatMap(s => s.tasks || []);
    if (allTasks.length === 0) return 0;
    const completedTasks = allTasks.filter(t => t.completed).length;
    return Math.round((completedTasks / allTasks.length) * 100);
  };

  // Використовуємо цю змінну нижче
  const projectProgressValue = calculateProgress();

  return (
    <MainLayout>
      <div className="project-page-content">
        <header className="project-page-header">
          <div className="header-left">
            <SquareButton type="back" onClick={() => navigate('/projects')} />
            <h1 className="page-title">
              СТОРІНКА ПРОЄКТА: <span className="accent-text">{projectData.title}</span>
            </h1>
          </div>
          
          <div className="header-right">
            <div className="options-wrapper">
              <SquareButton type="menu" onClick={() => setShowOptions(!showOptions)} />
              {showOptions && (
                <div className="options-dropdown">
                  <button className="dropdown-item delete" onClick={handleDelete}>Видалити проєкт</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="project-grid-container">
          {/* Ліва частина: Зображення */}
          <section className="grid-avatar">
            <ProjectAvatar src={projectData.image_url} alt={projectData.title} />
          </section>

          {/* Права частина: Інфо + Прогрес */}
          <section className="grid-info-column">
            <InfoProject 
              projectName={projectData.title}
              startDate={projectData.start_date}
              endDate={projectData.end_date}
              eventName={projectData.eventName || "Не вказано"}
              palette={projectData.palette || []}
              isAssistantActive={isAssistantActive}
              onAssistantToggle={setIsAssistantActive}
            />

            <div className="progress-section-wrapper">
              <h3 className="progress-label">Прогрес</h3>
              <ProjectProgress value={projectProgressValue} />
            </div>
          </section>
        </div>

        {/* НИЖНІЙ БЛОК: Завдання (3) + Сайдбар (1) */}
        <div className="project-bottom-grid">
          <div className="grid-tasks-area">
            <ListProject 
              sections={sections} 
              setSections={setSections} 
              aiEnabled={isAssistantActive} 
            />
          </div>

          <aside className="grid-sidebar">
            <Notebook initialItems={[]} />
            <UrlBlock initialLinks={[]} />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectPage;