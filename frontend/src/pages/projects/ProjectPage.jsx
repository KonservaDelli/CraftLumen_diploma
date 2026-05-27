import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/button/Button';
import './ProjectPage.css';

const ProjectPage = () => {
  const { projectSlug } = useParams(); 
  const navigate = useNavigate();
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
            Проєкт: {projectSlug}
          </h1>
        </header>
        <div className="card-horizontal-divider" style={{ margin: '20px 0', height: '2px', backgroundColor: 'var(--accent-purple)' }}></div>
        <p style={{ opacity: 0.7, fontFamily: 'Fira Sans, sans-serif' }}>
          Сторінку успішно знайдено за адресою: <strong>/projects/{projectSlug}</strong>
        </p>
      </div>
    </MainLayout>
  );
};

export default ProjectPage;