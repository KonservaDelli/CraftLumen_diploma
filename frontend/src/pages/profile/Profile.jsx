import React from 'react';
import './Profile.css';
import MainLayout from '../../components/layout/MainLayout';

const Profile = () => {
  return (
    <MainLayout>
      <div className="profile-container">
        <h1 className="page-title">Сторінка Профілю</h1>
      </div>
    </MainLayout>
  );
};

export default Profile;