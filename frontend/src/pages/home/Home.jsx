import React from 'react';
import './Home.css';

const Home = () => {
  const menuItems = ['Dashboard', 'Project', 'Events', 'Comty', 'Profile'];
  const todoItems = Array(6).fill('The point of what needs to be done first');

  return (
    <div className="dashboard-container">
      {/* Sidebar - ліва панель */}
      <aside className="sidebar">
        <div className="logo-placeholder"></div>
        <nav className="side-nav">
          {menuItems.map((item) => (
            <div key={item} className={`nav-link ${item === 'Dashboard' ? 'active' : ''}`}>
              <span className="nav-icon"></span>
              {item}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="nav-icon"></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Dashboard</h1>
          <div className="user-profile"></div>
        </header>

        <div className="dashboard-grid">
          <section className="card todo-section">
            <h2>To-do list</h2>
            <div className="todo-list">
              {todoItems.map((text, index) => (
                <div key={index} className="todo-item">
                  <input type="checkbox" id={`todo-${index}`} />
                  <label htmlFor={`todo-${index}`}>{text}</label>
                </div>
              ))}
            </div>
          </section>

          <div className="right-column">
            <section className="card calendar-section">
              <h2>Calendar</h2>
              <div className="calendar-placeholder"></div>
            </section>

            <section className="timeline-container">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card timeline-card">
                  <div className="timeline-header">
                    <h3>Timeline</h3>
                    <span className="tag">Festival</span>
                  </div>
                  <div className="timeline-progress">
                    <div className="icon-sm"></div>
                    <div className="progress-bar"></div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;