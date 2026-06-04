import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import BaseInput from '../../ui/input/BaseInput';
import SearchInput from '../../ui/input/SearchInput';
import DeadlineProject from '../../ui/date/DeadlineProject';
import Button from '../../ui/button/Button';
import './AiCreateModal.css';

const mockEvents = [
  { name: "Akhibara 2026", date: "02.06.2026" },
  { name: "Comic Con Ukraine", date: "15.09.2026" },
  { name: "Atlas Weekend", date: "10.07.2026" },
  { name: "Fancon", date: "6.07.2026" }
];

const AiCreateModal = ({ isOpen, onClose, onGenerate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [characterName, setCharacterName] = useState("");
  const [eventQuery, setEventQuery] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");

  if (!isOpen) return null;

  const isFormValid = selectedFile !== null && characterName.trim() !== "";
  const availableSuggestions = mockEvents
    .map(e => e.name)
    .filter(name => name.toLowerCase().includes(eventQuery.toLowerCase()));

  const handleEventSelect = (eventName) => {
    setEventQuery(eventName);
    const foundEvent = mockEvents.find(e => e.name === eventName);
    if (foundEvent) {
      setDeadlineDate(foundEvent.date);
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