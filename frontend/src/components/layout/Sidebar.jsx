import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Головна',path: '/home', icon: 'home-icon.png', activeIcon: 'home-icon-active.png' },
    { name: 'Проєкти', path: '/projects', icon: 'project-icon.png', activeIcon: 'project-icon-active.png' },
    { name: 'Події', path: '/events', icon: 'event-icon.png', activeIcon: 'event-icon-active.png' },
    { name: 'Профіль', path: '/profile', icon: 'profile-icon.png', activeIcon: 'profile-icon-active.png' },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src="logo.png" alt="Logo" />
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              className={`menu-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="icon-wrapper">
                <img 
                  src={isActive ? item.activeIcon : item.icon} alt={item.name}
                />
              </div>
              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="menu-item exit" onClick={onLogout}>
          <div className="icon-wrapper">
            <img src="exit-icon.png" alt="Exit" />
          </div>
          <span>Вийти</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;