import React, { useState } from 'react';
import './Notebook.css';

const Notebook = ({ title = "Нотатник", items = [], onAddItem, onRemoveItem }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    if (inputValue.trim() && onAddItem) {
      onAddItem(inputValue.trim());
      setInputValue('');
    }
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addItem();
    if (e.key === 'Escape') {
      setInputValue('');
      setIsAdding(false);
    }
  };

  const isEmpty = items.length === 0 && !isAdding;

  return (
    <div className={`notebook-card ${isEmpty ? 'is-empty' : ''}`}>
      <div className="notebook-header">
        <h3 className="notebook-title">{title}</h3>
        <button className="add-btn" onClick={() => setIsAdding(true)} title="Додати пункт">
          +
        </button>
      </div>

      <div className="notebook-content">
        {isEmpty ? (
          <div className="notebook-placeholder">
            Тут ви можете залишати помітки або формувати список закупок для вашого проєкту.
          </div>
        ) : (
          <ul className="notebook-list">
            {items.map((item) => (
              <li key={item.id} className="notebook-item">
                <div className="item-marker" />
                <span className="item-text">{item.text}</span>
                <button className="remove-btn" onClick={() => onRemoveItem && onRemoveItem(item.id)}>
                  ✕
                </button>
              </li>
            ))}
            {isAdding && (
              <li className="notebook-item adding">
                <div className="item-marker" />
                <input 
                  autoFocus
                  className="notebook-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => {
                      setInputValue('');
                      setIsAdding(false);
                    }, 200);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Введіть текст..."
                />
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notebook;