import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const menuItems = [
    { name: 'Головна', icon: 'home-icon.png', activeIcon: 'home-icon-active.png' },
    { name: 'Проєкти', icon: 'project-icon.png', activeIcon: 'project-icon-active.png' },
    { name: 'Події', icon: 'event-icon.png', activeIcon: 'event-icon-active.png' },
    { name: 'Профіль', icon: 'profile-icon.png', activeIcon: 'profile-icon-active.png' },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src="logo.png" alt="Logo" />
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <div
              key={item.name}
              className={`menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.name)}
            >
              <div className="icon-wrapper">
                <img 
                  src={`${isActive ? item.activeIcon : item.icon}`} 
                  alt={item.name} 
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