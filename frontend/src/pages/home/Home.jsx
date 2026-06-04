import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Calendar from '../../components/features/home/calendar/Calendar';
import TodoList from '../../components/features/home/toDoList/TodoList';
import Timeline from '../../components/features/home/timeline/Timeline';
import api from '../../services/api'; 
import './Home.css';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projectsData, setProjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //Завантаження даних
  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        
        if (isMounted) {
          setProjectsData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProjects();
    return () => { isMounted = false; };
  }, []);

  // Прогрес для таймлайнів
  const calculateProgress = (sections = []) => {
    const allTasks = sections.flatMap(s => s.tasks || []);
    if (allTasks.length === 0) return 0;
    const completedCount = allTasks.filter(t => t.completed).length;
    return Math.round((completedCount / allTasks.length) * 100);
  };

  const parseTaskDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('.')) return null;
    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
  };

  //3 найближчих проєктів
  const topDeadlineProjects = useMemo(() => {
    if (!projectsData || projectsData.length === 0) return [];

    return [...projectsData]
      .sort((a, b) => {
        const dateA = parseTaskDate(a.end_date);
        const dateB = parseTaskDate(b.end_date);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA - dateB;
      })
      .slice(0, 3);
  }, [projectsData]);

  const handleToggleTask = async (taskId) => {
    try {
      await api.patch(`/api/tasks/${taskId}/toggle`);
      
      setProjectsData(prevData => 
        prevData.map(project => ({
          ...project,
          sections: project.sections.map(section => ({
            ...section,
            tasks: section.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }))
        }))
      );
    } catch (error) {
      console.error("Помилка при перемиканні завдання:", error);
    }
  };

  const filteredProjects = useMemo(() => {
    if (!projectsData || projectsData.length === 0) return [];

    const targetDate = new Date(selectedDate).setHours(0, 0, 0, 0);

    return projectsData.map(project => {
      const allTasks = project.sections ? project.sections.flatMap(s => s.tasks || []) : [];

      const activeTasks = allTasks.filter(task => {
        const taskDateStr = task.end_date || task.start_date;
        const taskDateObj = parseTaskDate(taskDateStr);
        if (!taskDateObj) return false;

        const taskTime = taskDateObj.setHours(0, 0, 0, 0);
        return targetDate === taskTime;
      }).map(task => {
        const taskDateStr = task.end_date || task.start_date;
        const dateObj = parseTaskDate(taskDateStr);
        const months = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
        const displayDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;

        return {
          id: task.id,
          text: task.title,
          completed: task.completed,
          displayDate: displayDate
        };
      });

      return {
        id: project.id,
        title: project.title,
        festival: project.event_name || "Без події",
        tasks: activeTasks
      };
    }).filter(project => project.tasks.length > 0);
  }, [selectedDate, projectsData]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="loader">
          Синхронізація розкладу...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <h1 className="page-title-home">Dashboard</h1>
          <TodoList projects={filteredProjects} onToggleTask={handleToggleTask} />
        </div>

        <div className="dashboard-right">
          <div className="calendar-wrapper">
             <Calendar onDateChange={setSelectedDate} />
          </div>
          
          <div className="timelines-section">
            {topDeadlineProjects.map((project) => {
              const currentProgress = calculateProgress(project.sections);
              return (
                <Timeline 
                  key={project.id} 
                  progress={currentProgress} 
                  festivalName={project.event_name || "Без події"}
                  projectName={project.title}
                />
              );
            })}
            {topDeadlineProjects.length === 0 && (
              <p className="no-timelines">Активних проєктів не знайдено</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;