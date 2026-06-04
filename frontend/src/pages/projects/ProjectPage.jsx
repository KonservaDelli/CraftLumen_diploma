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
import api from '../../services/api';
import './ProjectPage.css';

const ProjectPage = () => {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [sections, setSections] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [aiDates, setAiDates] = useState({});

  useEffect(() => {
    const fetchProjectAndEvents = async () => {
      try {
        const response = await api.get(`/api/project/${projectSlug}`);
        setProjectData(response.data);
        setSections(response.data.sections || []);

        const eventsResponse = await api.get('/api/external-events');
        setAllEvents(eventsResponse.data || []);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndEvents();
  }, [projectSlug]);

  const handleUpdateEvent = async (newEventName) => {
    if (!projectData) return;
    try {
      const response = await api.patch(`/api/project/${projectData.id}/event`, { 
        event_name: newEventName 
      });

      setProjectData(prev => ({
        ...prev,
        event_name: response.data.event_name
      }));
    } catch (error) {
      console.error("Помилка оновлення події проєкту:", error);
    }
  };

  const handleUpdateProjectName = async (newName) => {
    if (!projectData) return;
    try {
      const response = await api.patch(`/api/project/${projectData.id}/title`, { 
        event_name: newName 
      });

      setProjectData(prev => ({
        ...prev,
        title: response.data.title,
        slug: response.data.slug
      }));
      
      if (response.data.slug !== projectSlug) {
        navigate(`/project/${response.data.slug}`, { replace: true });
      }
    } catch (error) {
      console.error("Помилка оновлення назви проєкту:", error);
    }
  };

  const handleUpdateProjectEndDate = async (newEndDate) => {
    if (!projectData) return;
    try {
      const response = await api.patch(`/api/project/${projectData.id}/end-date`, { 
        end_date: newEndDate 
      });

      setProjectData(prev => ({
        ...prev,
        end_date: response.data.end_date
      }));
    } catch (error) {
      console.error("Помилка оновлення дати завершення проєкту:", error);
    }
  };

  const handleUpdateProjectImage = async (file) => {
    if (!projectData || !file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await api.patch(`/api/project/${projectData.id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProjectData(prev => ({
        ...prev,
        image_url: response.data.image_url
      }));
    } catch (error) {
      console.error("Помилка оновлення зображення проєкту:", error);
    }
  };

  const handleAddNotebookItem = async (text) => {
    try {
      const response = await api.post('/api/notebook', { 
        text, 
        project_id: projectData.id 
      });

      setProjectData(prev => ({
        ...prev,
        notebook_items: [...(prev.notebook_items || []), response.data]
      }));
    } catch (err) {
      console.error("Помилка додавання нотатки:", err);
    }
  };

  const handleDeleteNotebookItem = async (itemId) => {
    try {
      await api.delete(`/api/notebook/${itemId}`);
      setProjectData(prev => ({
        ...prev,
        notebook_items: prev.notebook_items.filter(item => item.id !== itemId)
      }));
    } catch (err) {
      console.error("Помилка видалення нотатки:", err);
    }
  };

  const handleAddUrlLink = async (title, url) => {
    try {
      const response = await api.post('/api/url-links', { 
        title, 
        url, 
        project_id: projectData.id 
      });

      setProjectData(prev => ({
        ...prev,
        url_links: [...(prev.url_links || []), response.data]
      }));
    } catch (err) {
      console.error("Помилка додавання посилання:", err);
    }
  };

  const handleDeleteUrlLink = async (linkId) => {
    try {
      await api.delete(`/api/url-links/${linkId}`);
      setProjectData(prev => ({
        ...prev,
        url_links: prev.url_links.filter(link => link.id !== linkId)
      }));
    } catch (err) {
      console.error("Помилка видалення посилання:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Видалити цей проєкт?")) {
      try {
        await api.delete(`/api/projects/${projectData.id}`);
        navigate('/projects');
      } catch (error) {
        console.error("Помилка при видаленні проєкту:", error);
      }
    }
  };

  const handleAssistantToggle = async (checked) => {
    setIsAssistantActive(checked);
    if (!checked) {
      setAiDates({});
      return;
    }

    if (checked && projectData) {
      try {
        const response = await api.post(`/api/project/${projectData.id}/ai-schedule`);
        setAiDates(response.data.recommendations || {});
      } catch (err) {
        console.error("Не вдалося залучити ШІ-планувальник:", err);
      }
    }
  };

  const calculateProgress = () => {
    const allTasks = sections.flatMap(s => s.tasks || []);
    if (allTasks.length === 0) return 0;
    const completedTasks = allTasks.filter(t => t.completed).length;
    return Math.round((completedTasks / allTasks.length) * 100);
  };

  const projectProgressValue = calculateProgress();
  
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
  
  return (
    <MainLayout>
      <div className="project-page-content">
        <header className="project-page-header">
          <div className="header-left">
            <SquareButton type="back" onClick={() => navigate('/projects')} />
            <h1 className="page-title">
              Сторінка проєкта: <span className="accent-text">{projectData.title}</span>
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
          <section className="grid-avatar">
            <ProjectAvatar 
              src={projectData.image_url} 
              alt={projectData.title} 
              onUpdateImage={handleUpdateProjectImage}
            />
          </section>

          <section className="grid-info-column">
            <InfoProject 
              projectName={projectData.title}
              startDate={projectData.start_date}
              endDate={projectData.end_date}
              eventName={projectData?.event_name}
              palette={projectData.palette || []}
              isAssistantActive={isAssistantActive}
              onAssistantToggle={handleAssistantToggle}
              allEvents={allEvents} 
              onUpdateEvent={handleUpdateEvent} 
              onUpdateProjectName={handleUpdateProjectName}
              onUpdateProjectEndDate={handleUpdateProjectEndDate}
            />
            <div className="progress-section-wrapper">
              <h3 className="progress-label">Прогрес</h3>
              <ProjectProgress value={projectProgressValue} />
            </div>
          </section>
        </div>

        <div className="project-bottom-grid">
          <div className="grid-tasks-area">
            <ListProject 
              sections={sections} 
              setSections={setSections} 
              aiEnabled={isAssistantActive} 
              aiDates={aiDates} 
              projectId={projectData.id} 
            />
          </div>
          <aside className="grid-sidebar">
            <Notebook 
              items={projectData.notebook_items || []} 
              onAddItem={handleAddNotebookItem} 
              onRemoveItem={handleDeleteNotebookItem} 
            />
            <UrlBlock 
              links={projectData.url_links || []} 
              onAddLink={handleAddUrlLink} 
              onRemoveLink={handleDeleteUrlLink} 
            />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectPage;