import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/button/Button';
import './ProjectPage.css';

const ProjectPage = () => {
  const { projectSlug } = useParams(); 
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  // Завантаження певного проєкту
  useEffect(() => {
    fetch(`http://localhost:8000/api/project/${projectSlug}`)
      .then(res => {
        if (!res.ok) throw new Error("Проєкт відсутній в БД");
        return res.json();
      })
      .then(data => setProject(data))
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, [projectSlug]);
  // Видалення проєкту
  const handleDeleteFromPage = async () => {
    if (!project) return;
    
    const isConfirmed = window.confirm(`Ви впевнені, що хочете видалити проєкт "${project.title}"?`);
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${project.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error("Не вдалося видалити проєкт");
      navigate('/projects');

    } catch (error) {
      console.error("Помилка при видаленні:", error);
      alert("Не вдалося видалити проєкт");
    }
  };

  if (error) {
    return (
      <MainLayout>
        <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>
          <h2>Проєкт "{projectSlug}" не знайдено в базі даних.</h2>
          <div style={{ marginTop: '20px' }}>
            <Button text="Назад до бібліотеки" variant="primary" onClick={() => navigate('/projects')} />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>
          <p>Завантаження даних косплей-проєкту...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '40px', color: '#fff' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <Button 
            text="Назад" 
            variant="primary" 
            onClick={() => navigate('/projects')} 
          />
          <h1 style={{ fontFamily: 'Tektur, sans-serif', margin: 0 }}>
            Проєкт: {project.title}
          </h1>

          <Button 
            text="Видалити проєкт" 
            variant="danger"
            onClick={handleDeleteFromPage} 
          />
        </header>
        <div className="card-horizontal-divider" style={{ margin: '20px 0', height: '2px', backgroundColor: 'var(--accent-purple)' }}></div>
        
        <div className="project-page-content" style={{ display: 'flex', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
          <div className="project-page-image-wrapper">
            <img 
              src={project.image_url || '/default-project.jpg'} 
              alt={project.title} 
              style={{ width: '100%', maxWidth: '400px', height: 'auto', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--accent-purple)' }} 
            />
          </div>

          <div className="project-page-info" style={{ fontFamily: 'Fira Sans, sans-serif', fontSize: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p>Дата створення:{project.start_date}</p>
            <p>Дедлайн: {project.end_date || "Не вказано"}</p>
            <p>Поточний прогрес крафту: {project.progress}%</p>
            <div style={{ width: '250px', height: '10px', backgroundColor: '#333', borderRadius: '5px', overflow: 'hidden', marginTop: '5px' }}>
              <div style={{ width: `${project.progress}%`, height: '100%', backgroundColor: 'var(--accent-purple)' }}></div>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default ProjectPage;