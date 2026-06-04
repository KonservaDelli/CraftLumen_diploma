import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import MainLayout from '../../components/layout/MainLayout';
import SearchInput from '../../components/ui/input/SearchInput';
import DeadlineProject from '../../components/ui/date/DeadlineProject';
import UserAvatar from '../../components/ui/icon/UserAvatar';
import EventCard from '../../components/features/events/EventCard';

const Events = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [eventsList, setEventsList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/api/profile')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
      })
      .catch(err => console.error("Помилка завантаження аватарки:", err));
  }, []);

  // Отримання даних
  const fetchEvents = useCallback(() => {
    return fetch('http://127.0.0.1:8000/api/external-events')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Не вдалося завантажити події з сервера`);
        }
        return res.json();
      })
      .then(data => {
        setEventsList(data);
        setError(null);
      })
      .catch(err => {
        console.error("Помилка завантаження подій:", err);
        setError("Не вдалося завантажити події. Перевірте з'єднання з сервером.");
      });
  }, []);

  useEffect(() => {
    fetchEvents().finally(() => setIsLoading(false));
  }, [fetchEvents]);

  const parseDateString = (dateStr) => {
    if (!dateStr || !dateStr.includes('.')) return new Date(8640000000000000);
    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
  };

  const sortedAndFilteredEvents = eventsList
    .filter(event => {
      const title = event.title ? event.title.toLowerCase() : "";
      const description = event.description ? event.description.toLowerCase() : "";
      
      const matchesSearch = title.includes(searchQuery.toLowerCase()) ||
                            description.includes(searchQuery.toLowerCase());
      
      const startDate = event.start_date || "";
      const matchesDate = filterDate === "" || startDate.includes(filterDate);
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      return parseDateString(a.start_date) - parseDateString(b.start_date);
    });

  return (
    <MainLayout>
      <div className="events-page-container">
        <header className="events-header">
          <h1 className="events-page-title">Бібліотека подій</h1>
          <UserAvatar src={avatarUrl} size={70} onClick={() => navigate('/profile')} />
        </header>

        <div className="events-toolbar">
          <div className="search-section">
            <SearchInput 
              value={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Пошук подій..."
            />
          </div>
          <div className="date-section">
            <DeadlineProject 
              value={filterDate}
              onChange={setFilterDate}
              placeholder="dd.mm.yyyy"
            />
          </div>
        </div>

        <div className="events-grid">
          {isLoading ? (
            <div className="events-status-message">
              <p>Завантаження бази даних...</p>
            </div>
          ) : error ? (
            <div className="events-status-message error-message">
              <p>{error}</p>
            </div>
          ) : sortedAndFilteredEvents.length > 0 ? (
            sortedAndFilteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="no-results">
              <p>Наразі косплей-події не знайдено</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;