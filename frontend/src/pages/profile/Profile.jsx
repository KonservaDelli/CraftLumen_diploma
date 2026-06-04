import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout.jsx'; 
import InfoUser from '../../components/features/profile/InfoUser.jsx';
import Statistics from '../../components/features/profile/Statistics.jsx';
import SelectEvent from '../../components/features/profile/SelectEvent.jsx';
import api from '../../services/api'; 
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ nickname: '', email: '', password: '', avatarUrl: '' });
  const [stats, setStats] = useState({ active: 0, completed: 0 });
  const [nearestProject, setNearestProject] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get('/api/profile');
        const profileData = profileRes.data;
        
        setUser({
          nickname: profileData.nickname,
          email: profileData.email,
          password: '••••••••',
          avatarUrl: profileData.avatarUrl || '' 
        });

        const projectsRes = await api.get('/api/projects');
        const projectsData = projectsRes.data;

        let activeCount = 0;
        let completedCount = 0;
        let activeProjectsWithDeadline = [];

        projectsData.forEach(project => {
          const allTasks = project.sections?.flatMap(s => s.tasks || []) || [];
          
          let realProgress = 0;
          if (allTasks.length > 0) {
            const completedTasks = allTasks.filter(t => t.completed).length;
            realProgress = Math.round((completedTasks / allTasks.length) * 100);
          }

          if (realProgress === 100) {
            completedCount++;
          } else {
            activeCount++;
            if (project.end_date) {
              activeProjectsWithDeadline.push(project);
            }
          }
        });

        setStats({ active: activeCount, completed: completedCount });

        if (activeProjectsWithDeadline.length > 0) {
          const sorted = activeProjectsWithDeadline.sort((a, b) => {
            const dateA = new Date(a.end_date.split('.').reverse().join('-'));
            const dateB = new Date(b.end_date.split('.').reverse().join('-'));
            return dateA - dateB;
          });
          
          setNearestProject({
            title: sorted[0].title,
            endDate: sorted[0].end_date
          });
        } else {
          setNearestProject(null);
        }

        const eventsRes = await api.get('/api/external-events');
        const eventsData = eventsRes.data;

        const connectedEventNames = projectsData
          .map(p => p.event_name)
          .filter(name => name && name.trim() !== '');

        const filteredEvents = eventsData.filter(event => 
          connectedEventNames.some(name => event.title.toLowerCase().includes(name.toLowerCase()))
        );

        setUserEvents(filteredEvents.map(e => ({
          title: e.title,
          date: e.display_date
        })));

      } catch (error) {
        console.error("Помилка завантаження профілю:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async (updatedFields, avatarFile) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedFields.email)) {
      alert("Введіть коректну адресу електронної пошти!");
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('email', updatedFields.email);
      formData.append('nickname', updatedFields.nickname);
      
      if (updatedFields.password && updatedFields.password !== '••••••••' && updatedFields.password.trim() !== '') {
        formData.append('password', updatedFields.password);
      }

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await api.put('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const result = response.data;
        setUser({ 
          email: updatedFields.email,
          nickname: updatedFields.nickname,
          password: '••••••••', 
          avatarUrl: result.avatarUrl
        });
        
        setTimeout(() => {
          window.location.reload(); 
        }, 100);
        
        return true;
      } else {
        alert("Помилка при збереженні профілю на сервері.");
        return false;
      }
    } catch (error) {
      console.error("Помилка оновлення профілю:", error);
      alert("Не вдалося зв'язатися з сервером.");
      return false;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ color: 'var(--text-light)', textAlign: 'center', paddingTop: '100px', fontFamily: 'Tektur' }}>
          <h2>Синхронізація з базою даних...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="profile-page-container">
        <div className="profile-page-header">
          <h1 className="profile-page-title">Профіль</h1>
          <div className="profile-header-line"></div>
        </div>
        
        <div className="profile-section-full">
          <InfoUser 
            user={user} 
            nearestProject={nearestProject} 
            onSave={handleSaveProfile} 
          />
        </div>

        <div className="profile-section-grid">
          <div className="profile-stats-column">
            <Statistics 
              activeProjects={stats.active} 
              completedProjects={stats.completed} 
              futureEvents={userEvents.length} 
            />
          </div>

          <div className="profile-events-column">
            <SelectEvent events={userEvents} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;