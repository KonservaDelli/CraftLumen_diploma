import React, { useState, useEffect } from 'react';
import BaseInput from '../../ui/input/BaseInput';
import SearchInput from '../../ui/input/SearchInput';
import TextArea from '../../ui/input/TextArea';
import DeadlineProject from '../../ui/date/DeadlineProject';
import UploadButton from '../../ui/button/UploadButton';
import Button from '../../ui/button/Button';

const ManualCreateModal = ({ isOpen, onClose, onCreate }) => {
  const [characterName, setCharacterName] = useState("");
  const [sections, setSections] = useState("");
  const [eventQuery, setEventQuery] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const isFormValid = characterName.trim() !== "" && sections.trim() !== "";
  const filteredSuggestions = realEvents
    .map(ev => ev.title)
    .filter(title => title && title.toLowerCase().includes(eventQuery.toLowerCase()));

  // автоматичне заповнення дедлайн по обрані події
  const handleEventSelect = (eventName) => {
    setEventQuery(eventName);
    const foundEvent = realEvents.find(ev => ev.title === eventName);
    if (foundEvent) {
      setDeadline(foundEvent.start_date || foundEvent.display_date || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    
    const sectionsArray = sections
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== "")
      .map((name, index) => ({
        id: index + 1,
        title: name,
        tasks: []
      }));

    await onCreate({
      title: characterName,
      sections: JSON.stringify(sectionsArray),
      event: eventQuery || null,
      endDate: deadline || null,
      image: selectedFile
    });

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
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">СТВОРЕННЯ ПРОЄКТУ</h2>

        <form onSubmit={handleSubmit} className="modal-form-content">
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

          <div className="modal-input-group">
            <label className="modal-label">Зв'язати з подією</label>
            <SearchInput 
              placeholder="Почніть вводити назву події..."
              value={eventQuery}
              onSearch={setEventQuery}
              suggestions={filteredSuggestions}
              onSuggestionSelect={handleEventSelect}
              showIcon={false}
            />
          </div>

          <div className="modal-input-group">
            <label className="modal-label">Дедлайн закінчення проєкту</label>
            <DeadlineProject 
              value={deadline} 
              onChange={setDeadline} 
              placeholder="dd.mm.yyyy"
            />
          </div>

          <div className="modal-input-group">
            <label className="modal-label">Референс персонажа</label>
            <UploadButton 
              label={selectedFile ? `Обрано: ${selectedFile.name}` : "Завантажити референс"} 
              onFileSelect={setSelectedFile}
              accept="image/*"
            />
          </div>

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