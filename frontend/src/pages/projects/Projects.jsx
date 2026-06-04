import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import SearchProject from '../../components/ui/input/SearchInput';
import Button from '../../components/ui/button/Button';
import UserAvatar from '../../components/ui/icon/UserAvatar';
import ProjectsCard from '../../components/features/project/ProjectsCard';
import AiCreateModal from '../../components/features/project/AiCreateModal';
import ManualCreateModal from '../../components/features/project/ManualCreateModal';
import api from '../../services/api';
import './Projects.css';

const UKRAINIAN_MONTHS = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
];

const formatStringDate = (dateStr) => {
  if (!dateStr || !dateStr.includes('.')) return null;
  const [dayStr, monthStr] = dateStr.split('.');
  const day = parseInt(dayStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  if (isNaN(day) || monthIndex < 0 || monthIndex > 11) return dateStr;
  return `${day} ${UKRAINIAN_MONTHS[monthIndex]}`;
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  //Завантаження аватарки профілю
  useEffect(() => {
    api.get('/api/profile')
      .then(res => {
        if (res.data && res.data.avatarUrl) {
          setAvatarUrl(res.data.avatarUrl);
        }
      })
      .catch(err => console.error("Помилка завантаження аватарки:", err));
  }, []);

  //Завантаження проєктів
  useEffect(() => {
    api.get('/api/projects')
      .then(res => {
        const mappedProjects = res.data.map(project => ({
          id: project.id,
          title: project.title,
          slug: project.slug,
          startDate: project.start_date ? formatStringDate(project.start_date) : '',
          endDate: project.end_date ? formatStringDate(project.end_date) : null,
          progress: project.progress,
          sections: project.sections || [], 
          urgentTasksCount: project.urgentTasksCount || 0, 
          image: project.image_url || '/default-project.jpg'
        }));
        setProjects(mappedProjects);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Помилка завантаження бібліотеки:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => setSearchQuery(query);
  
  //Генерація проєкту через AI
  const handleAiGenerate = async (newData) => {
    try {
      const formData = new FormData();
      formData.append('title', newData.title || "Новий АІ Проєкт");
      if (newData.endDate) formData.append('endDate', newData.endDate);
      if (newData.event) formData.append('event', newData.event);
      if (newData.image) formData.append('image', newData.image);

      const response = await api.post('/api/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setIsAiModalOpen(false);
      navigate(`/project/${response.data.slug}`);
    } catch (error) {
      console.error("Не вдалося згенерувати проєкт:", error);
      alert("Сталася помилка при збереженні проєкту в базу даних");
    }
  };

  //Ручне створення проєкту
  const handleManualCreate = async (formDataFields) => {
    try {
      const formData = new FormData();
      formData.append('title', formDataFields.title);
      formData.append('sections', formDataFields.sections);
      
      if (formDataFields.event) formData.append('event', formDataFields.event); 
      if (formDataFields.endDate) formData.append('endDate', formDataFields.endDate);
      if (formDataFields.image) formData.append('image', formDataFields.image);

      const response = await api.post('/api/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsManualModalOpen(false);
      navigate(`/project/${response.data.slug}`);
    } catch (error) {
      console.error("Помилка ручного створення проєкту:", error);
      alert("Не вдалося зберегти проєкт. Перевірте з'єднання з сервером.");
    }
  };

  //Видалення проєкту
  const handleDeleteProject = async (projectId) => {
    const isConfirmed = window.confirm("Ви впевнені, що хочете видалити цей проєкт?");
    if (!isConfirmed) return;
    try {
      await api.delete(`/api/projects/${projectId}`);
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error("Помилка при видаленні проєкту:", error);
      alert("Сталася помилка при видаленні проєкту з бази даних");
    }
  };

  return (
    <MainLayout>
      <div className="projects-main-content">
        <header className="projects-header">
          <div className="header-top-row">
            <h1 className="page-title-main">Бібліотека проєктів</h1>
            <UserAvatar src={avatarUrl} size={70} onClick={() => navigate('/profile')} />
          </div>
          <div className="card-horizontal-divider"></div>
          <div className="header-controls">
            <SearchProject onSearch={handleSearch} />
            <div className="buttons-group">
              <Button text="Створити проєкт" variant="primary" onClick={() => setIsManualModalOpen(true)}/>
              <Button text="AI створення" variant="accent" iconName="magic-icon.png" onClick={() => setIsAiModalOpen(true)}/>
            </div>
          </div>
        </header>

        <div className="projects-scroll-container">
          {isLoading ? (
            <p style={{ color: 'var(--text-light)', textAlign: 'center', marginTop: '40px' }}>Завантаження бібліотеки проєктів...</p>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <ProjectsCard key={project.id} projects={project} onDelete={handleDeleteProject}/>
              ))}
            </div>
          )}
        </div>
      </div>
      <AiCreateModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onGenerate={handleAiGenerate}
      />
      <ManualCreateModal 
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onCreate={handleManualCreate}
      />
    </MainLayout>
  );
};

export default Projects;