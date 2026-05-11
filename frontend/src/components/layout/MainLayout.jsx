import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/register');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
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