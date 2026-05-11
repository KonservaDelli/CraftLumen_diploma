import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Тут логіка очищення токенів, якщо є
    navigate('/auth'); // Перехід на сторінку авторизації
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1a1625' }}>
      <Sidebar onLogout={handleLogout} />
      <main style={{ 
        flexGrow: 1, 
        padding: '40px', 
        height: '100vh', 
        overflowY: 'auto' 
      }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;