import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SearchProject from '../../components/ui/input/SearchProject';
import Button from '../../components/ui/button/Button';
import UserAvatar from '../../components/ui/icon/UserAvatar';
import ProjectsCard from '../../components/features/project/ProjectsCard';
import './Projects.css';

const Projects = () => {
  const [projects] = useState([
    { id: 1, title: 'Сейлор Мун', startDate: '1 травня', endDate: '2 червня', progress: 65, urgentTasksCount: 2, image: null },
    { id: 2, title: 'Відьмак', startDate: '10 квітня', progress: 30, urgentTasksCount: 0, image: null },
    { id: 3, title: 'Кіберпанк', startDate: '5 травня', endDate: '15 червня', progress: 10, urgentTasksCount: 5, image: null },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => setSearchQuery(query);

  return (
    <MainLayout>
      {/* Клас projects-main-content тепер обгортає все всередині лейауту */}
      <div className="projects-main-content">
        <header className="projects-header">
          <div className="header-top-row">
            <h1 className="page-title-main">Бібліотека проєктів</h1>
            <UserAvatar size={70} />
          </div>
          <div className="card-horizontal-divider"></div>
          <div className="header-controls">
            <SearchProject onSearch={handleSearch} />
            <div className="buttons-group">
              <Button text="Створити проєкт" variant="primary" />
              <Button text="AI створення" variant="accent" iconName="magic-icon.png" />
            </div>
          </div>
        </header>


        {/* Додаємо scroll-container, щоб скролилися лише картки */}
        <div className="projects-scroll-container">
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectsCard key={project.id} projects={project} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Projects;