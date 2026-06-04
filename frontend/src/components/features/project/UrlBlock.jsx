import React, { useState } from 'react';
import './UrlBlock.css';

const UrlBlock = ({ title = "Колекція посилань", initialLinks = [] }) => {
  const [links, setLinks] = useState(initialLinks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddLink = () => {
    if (newTitle.trim() && newUrl.trim()) {
      const formattedUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
      setLinks([...links, { title: newTitle, url: formattedUrl }]);
      setNewTitle('');
      setNewUrl('');
      setIsAdding(false);
    }
  };

  return (
    <div className="url-block">
      <div className={`url-header-section ${isAdding ? 'expanded' : ''}`}>
        <div className="url-header-row">
          <h3 className="url-title">{title}</h3>
          <button className="url-toggle-btn" onClick={() => setIsAdding(!isAdding)}>
            <span className={`toggle-icon ${isAdding ? 'rotated' : ''}`}>+</span>
          </button>
        </div>

        {isAdding && (
          <div className="url-form-container">
            <input 
              className="url-form-input"
              placeholder="Назва посилання"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="url-form-row">
              <input 
                className="url-form-input main-input"
                placeholder="URL посилання"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <button className="url-add-submit" onClick={handleAddLink}>Додати</button>
            </div>
          </div>
        )}
      </div>

      <div className="url-content">
        {links.length === 0 && !isAdding ? (
          <div className="url-empty-msg">
            Зберігайте в одному місці корисні посилання для проєкту.
          </div>
        ) : (
          <div className="url-list">
            {links.map((link, index) => (
              <div key={index} className="url-item">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="url-pill">
                  <img src="/url-icon.png" alt="" className="url-pill-icon" />
                  <span className="url-pill-label">{link.title}</span>
                </a>
                <button 
                  className="url-delete-node" 
                  onClick={() => setLinks(links.filter((_, i) => i !== index))}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlBlock;