import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ Хук для навігації
import MainLayout from '../../components/layout/MainLayout';
import SearchProject from '../../components/ui/input/SearchInput';
import Button from '../../components/ui/button/Button';
import UserAvatar from '../../components/ui/icon/UserAvatar';
import ProjectsCard from '../../components/features/project/ProjectsCard';
import AiCreateModal from '../../components/features/project/AiCreateModal';
import './Projects.css';

const UKRAINIAN_MONTHS = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
];

const getFormattedToday = () => {
  const today = new Date();
  const day = today.getDate();
  const monthText = UKRAINIAN_MONTHS[today.getMonth()];
  return `${day} ${monthText}`;
};

const formatStringDate = (dateStr) => {
  if (!dateStr || !dateStr.includes('.')) return null;
  const [dayStr, monthStr] = dateStr.split('.');
  const day = parseInt(dayStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  if (isNaN(day) || monthIndex < 0 || monthIndex > 11) return dateStr;
  return `${day} ${UKRAINIAN_MONTHS[monthIndex]}`;
};

const convertToSlug = (text) => {
  const ukrToEng = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
    'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ь': '', 'ю': 'yu', 'я': 'ya', ' ': '-', ' е': 'e'
  };

  return text
    .toLowerCase()
    .trim() 
    .split('')
    .map(char => ukrToEng[char] !== undefined ? ukrToEng[char] : char)
    .join('')
    .replace(/[^a-z0-9-_]/g, '') //видалення спецсимволів
    .replace(/-+/g, '-');
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    { id: 1, title: 'Сейлор Мун', startDate: '1 травня', endDate: '2 червня', progress: 65, urgentTasksCount: 2, image: null },
    { id: 2, title: 'Відьмак', startDate: '10 квітня', progress: 30, urgentTasksCount: 0, image: null },
    { id: 3, title: 'Кіберпанк', startDate: '5 травня', endDate: '15 червня', progress: 10, urgentTasksCount: 5, image: null },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => setSearchQuery(query);
  
  const handleAiGenerate = (newData) => {
    const projectTitle = newData.title || "Новий АІ Проєкт";
    const projectSlug = convertToSlug(projectTitle) || `project-${Date.now()}`;

    const newProjectObj = {
      id: Date.now(),
      title: projectTitle,
      slug: projectSlug,
      startDate: getFormattedToday(), 
      endDate: newData.endDate ? formatStringDate(newData.endDate) : null,
      progress: 0,
      urgentTasksCount: 0,
      image: newData.image ? URL.createObjectURL(newData.image) : null
    };

    setProjects([newProjectObj, ...projects]);
    setIsAiModalOpen(false);
    navigate(`/project/${projectSlug}`);
  };

  return (
    <MainLayout>
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
              <Button text="AI створення" variant="accent" iconName="magic-icon.png" onClick={() => setIsAiModalOpen(true)}/>
            </div>
          </div>
        </header>

        <div className="projects-scroll-container">
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectsCard key={project.id} projects={project} />
            ))}
          </div>
        </div>
      </div>
      <AiCreateModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onGenerate={handleAiGenerate}
      />
    </MainLayout>
  );
};

export default Projects;