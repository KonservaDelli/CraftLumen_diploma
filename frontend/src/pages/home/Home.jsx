import React, { useState, useMemo } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Calendar from '../../components/features/home/calendar/Calendar';
import TodoList from '../../components/features/home/toDoList/TodoList';
import Timeline from '../../components/features/home/timeline/Timeline';
import './Home.css';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projectsData, setProjectsData] = useState([
    {
      id: "p1",
      title: "Сейлор мун",
      festival: "Акіхабара 2026",
      tasks: [
        { id: "t1", text: "Пошити спідницю", completed: false, startDate: "2026-05-10", endDate: "2026-05-15" },
        { id: "t2", text: "Крафт брошки", completed: true, startDate: "2026-05-11", endDate: "2026-05-11" }
      ]
    },
    {
      id: "p2",
      title: "Stand Up",
      festival: "",
      tasks: [
        { id: "t3", text: "Пошити ", completed: false, startDate: "2026-05-10", endDate: "2026-05-26" },
        { id: "t4", text: "Крафт брошки", completed: false, startDate: "2026-05-11", endDate: "2026-05-11" }
      ]
    },
    {
      id: "p3",
      title: "Stand",
      festival: "",
      tasks: [
        { id: "t5", text: "Пошити ", completed: false, startDate: "2026-05-10", endDate: "2026-05-26" },
        { id: "t6", text: "Крафт", completed: false, startDate: "2026-05-11", endDate: "2026-05-12" }
      ]
    }
  ]);
  //Прогрес таймлайнів
  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(t => t.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  };
  //Стан
  const handleToggleTask = (taskId) => {
    setProjectsData(prevData => 
      prevData.map(project => ({
        ...project,
        tasks: project.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    );
  };
  //Фільтрування завдань
  const filteredProjects = useMemo(() => {
    const targetDate = new Date(selectedDate).setHours(0, 0, 0, 0);
    return projectsData.map(project => ({
      ...project,
      tasks: project.tasks.filter(task => {
        const start = new Date(task.startDate).setHours(0, 0, 0, 0);
        const end = new Date(task.endDate).setHours(23, 59, 59, 999);
        return targetDate >= start && targetDate <= end;
      }).map(task => ({
        ...task,
        displayDate: task.startDate === task.endDate 
          ? `${new Date(task.startDate).getDate()} травня`
          : `${new Date(task.startDate).getDate()}-${new Date(task.endDate).getDate()} травня`
      }))
    })).filter(project => project.tasks.length > 0);
  }, [selectedDate, projectsData]);

  return (
    <MainLayout>
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <h1 className="page-title">Dashboard</h1>
          <TodoList projects={filteredProjects} onToggleTask={handleToggleTask} />
        </div>

        <div className="dashboard-right">
          <div className="calendar-wrapper">
             <Calendar onDateChange={setSelectedDate} />
          </div>
          
          <div className="timelines-section">
            {projectsData.slice(0, 3).map((item) => {
              const currentProgress = calculateProgress(item.tasks);
              return (
                <Timeline 
                  key={item.id} 
                  progress={currentProgress} 
                  festivalName={item.festival}
                  projectName={item.title}
                />
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
