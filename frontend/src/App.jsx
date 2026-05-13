import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/authorization/Register';
import Login from './pages/authorization/Login';
import Home from './pages/home/Home';
import Projects from './pages/projects/Projects';
import Events from './pages/events/Events';
import Profile from './pages/profile/Profile';

function App() {
  return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
  );
}

export default App;