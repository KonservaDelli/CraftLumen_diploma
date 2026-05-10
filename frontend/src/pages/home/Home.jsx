import React from 'react';
import './Home.css';
import Timeline from '../../components/features/home/timeline/Timeline.jsx';

const Home = () => {
  return (
    <div className="dashboard-container">
      <Timeline progress={100} festivalName="Atlas Weekend" />
    </div>
  );
};

export default Home;