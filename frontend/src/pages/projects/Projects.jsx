import React, { useState } from 'react'; // Прибрали useEffect
import Sidebar from '../components/Sidebar';
import SearchProject from '../components/SearchProject';
import Button from '../components/Button';
import UserAvatar from '../components/UserAvatar';
import ProjectsCard from '../components/ProjectsCard';
import './Projects.css';

const Projects = () => {
  // Прибрали setProjects, поки не завантажуємо дані з API
  const [projects] = useState([
    { id: 1, title: 'Сейлор Мун', startDate: '1 травня', endDate: '2 червня', progress: 65, urgentTasksCount: 2, image: null },
    { id: 2, title: 'Відьмак', startDate: '10 квітня', progress: 30, urgentTasksCount: 0, image: null },
    { id: 3, title: 'Кіберпанк', startDate: '5 травня', endDate: '15 червня', progress: 10, urgentTasksCount: 5, image: null },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateManual = () => console.log("Відкрити попап: Вручну");
  const handleCreateAI = () => console.log("Відкрити попап: AI");

  return (
    <div className="projects-page-layout">
      <Sidebar onLogout={() => console.log('Logout')} />
      
      <main className="projects-main-content">
        <header className="projects-header">
          <div className="header-top-row">
            <h1 className="page-title-main">Бібліотека проєктів</h1>
            <UserAvatar src="/my-avatar.png" size={70} />
          </div>
          
          <div className="header-controls">
            <SearchProject onSearch={handleSearch} />
            <div className="buttons-group">
              <Button 
                text="Створити проєкт" 
                variant="primary" 
                onClick={handleCreateManual} 
              />
              <Button 
                text="AI створення" 
                variant="accent" 
                iconName="ai-magic-icon.png" 
                onClick={handleCreateAI} 
              />
            </div>
          </div>
        </header>

        <div className="card-horizontal-divider"></div>

        <div className="projects-scroll-container">
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectsCard key={project.id} projects={project} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;