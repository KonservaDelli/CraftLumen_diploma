import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import BaseInput from '../../ui/input/BaseInput';
import SearchInput from '../../ui/input/SearchInput';
import DeadlineProject from '../../ui/date/DeadlineProject';
import Button from '../../ui/button/Button';
import './AiCreateModal.css';

const AiCreateModal = ({ isOpen, onClose, onGenerate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [characterName, setCharacterName] = useState("");
  const [eventQuery, setEventQuery] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [realEvents, setRealEvents] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchEvents = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/external-events');
          if (response.ok) {
            const data = await response.json();
            setRealEvents(data);
          }
        } catch (err) {
          console.error("Не вдалося завантажити події для модального вікна:", err);
        }
      };
      fetchEvents();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFormValid = selectedFile !== null && characterName.trim() !== "";
  const availableSuggestions = realEvents
    .map(e => e.title)
    .filter(title => title && title.toLowerCase().includes(eventQuery.toLowerCase()));

  const handleEventSelect = (eventName) => {
    setEventQuery(eventName);
    const foundEvent = realEvents.find(e => e.title === eventName);
    if (foundEvent) {
      setDeadlineDate(foundEvent.start_date || foundEvent.display_date || "");
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    onGenerate?.({
      image: selectedFile,
      title: characterName,
      event: eventQuery || null,
      endDate: deadlineDate || null
    });

    setSelectedFile(null);
    setCharacterName("");
    setEventQuery("");
    setDeadlineDate("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">AI СТВОРЕННЯ ПРОЄКТУ</h2>

        <div className="modal-form-content">
          <div className="modal-row-upload">
            <ImageUpload onFileSelect={setSelectedFile} />
          </div>
          <div className="modal-inputs-stack">
            <div className="modal-input-group">
              <label className="modal-label">
                Назва персонажа <span className="important-star">*</span>
              </label>
              <BaseInput 
                placeholder="Введіть назву персонажа..." 
                value={characterName} 
                onChange={setCharacterName} 
              />
            </div>

            <div className="modal-input-group">
              <label className="modal-label">Зв'язати з подією</label>
              <SearchInput 
                placeholder="Почніть вводити назву події..." 
                showIcon={false}
                suggestions={availableSuggestions}
                onSearch={setEventQuery}
                onSuggestionSelect={handleEventSelect}
                value={eventQuery}
              />
            </div>
            
            <div className="modal-input-group">
              <label className="modal-label">Кінцева дата виконання (optional)</label>
              <DeadlineProject 
                value={deadlineDate} 
                onChange={setDeadlineDate} 
                placeholder="dd.mm.yyyy"
              />
            </div>
          </div>

          <div className="modal-actions-row">
            <Button 
              text="ГЕНЕРУВАТИ" 
              variant="generate" 
              iconName="magic-icon2.png" 
              onClick={handleSubmit} 
              className={!isFormValid ? "btn-disabled" : ""}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiCreateModal;