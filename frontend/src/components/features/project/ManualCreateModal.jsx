import React, { useState } from 'react';
import BaseInput from '../../ui/input/BaseInput';
import SearchInput from '../../ui/input/SearchInput';
import TextArea from '../../ui/input/TextArea';
import DeadlineProject from '../../ui/date/DeadlineProject';
import UploadButton from '../../ui/button/UploadButton';
import Button from '../../ui/button/Button';

// Фейковий список подій для пошукового інпуту
const MOCK_EVENTS = [
  "Fancon 2026",
  "Comic Con Ukraine 2026",
  "Anicon 2026",
  "Akihabara 2026"
];

const ManualCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [characterName, setCharacterName] = useState("");
  const [sections, setSections] = useState("");
  const [eventQuery, setEventQuery] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Обов'язкові поля для активації кнопки створення
  const isFormValid = characterName.trim() !== "" && sections.trim() !== "";

  // Відфільтровані підказки подій для SearchInput
  const filteredSuggestions = MOCK_EVENTS.filter(ev =>
    ev.toLowerCase().includes(eventQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    
    // Передаємо всі зібрані дані вгору до батьківського компонента
    await onCreate({
      title: characterName,
      sections: sections,
      event: eventQuery,
      endDate: deadline,
      image: selectedFile
    });

    // Скидаємо поля після успішного закриття
    setCharacterName("");
    setSections("");
    setEventQuery("");
    setDeadline("");
    setSelectedFile(null);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Хрестик для виходу з попапу */}
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">СТВОРЕННЯ ПРОЄКТУ</h2>

        <form onSubmit={handleSubmit} className="modal-form-content">
          
          {/* 1. Поле для назви персонажа (Обов'язкове) */}
          <div className="modal-input-group">
            <label className="modal-label">
              Ім'я персонажа<span className="important-star">*</span>
            </label>
            <BaseInput 
              placeholder="Введіть ім'я персонажа..." 
              value={characterName} 
              onChange={setCharacterName} 
            />
          </div>

          {/* 2. Велике поле для розділів завдань (Обов'язкове) */}
          <div className="modal-input-group">
            <label className="modal-label">
              Розділи проєкту (через кому або з нового рядка)<span className="important-star">*</span>
            </label>
            <TextArea 
              placeholder="Крафт, Пошиття, Перука, Взуття, Аксесуари..." 
              value={sections} 
              onChange={setSections}
              rows={4}
            />
          </div>

          {/* 3. Поле прив'язаної події (Пошукове, Необов'язкове) */}
          <div className="modal-input-group">
            <label className="modal-label">Прив'язати фестиваль / подію</label>
            <SearchInput 
              placeholder="Почніть вводити назву події..."
              value={eventQuery}
              onSearch={setEventQuery}
              suggestions={filteredSuggestions}
              onSuggestionSelect={setEventQuery}
              showIcon={false}
            />
          </div>

          {/* 4. Поле дати закінчення проєкту (Необов'язкове) */}
          <div className="modal-input-group">
            <label className="modal-label">Дедлайн закінчення проєкту</label>
            <DeadlineProject 
              value={deadline} 
              onChange={setDeadline} 
              placeholder="dd.mm.yyyy"
            />
          </div>

          {/* 5. Кнопка завантаження референсу персонажа (Необов'язкове, без прев'ю) */}
          <div className="modal-input-group">
            <label className="modal-label">Референс персонажа</label>
            <UploadButton 
              label={selectedFile ? `Обрано: ${selectedFile.name}` : "Завантажити референс"} 
              onFileSelect={setSelectedFile}
              accept="image/*"
            />
          </div>

          {/* 6. Кнопка створення проєкту */}
          <div className="modal-actions-row">
            <Button 
              text={isSubmitting ? "Створення..." : "Створити проєкт"} 
              variant="generate"
              type="submit"
              className={!isFormValid || isSubmitting ? "btn-disabled" : ""}
              onClick={handleSubmit}
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default ManualCreateModal;