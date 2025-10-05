import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Welcome, Mikayla</h2>

      <div className="widgets">
        <div className="widget hoverable">
          <h3>Classes</h3>
          <ul>
            <li title="Click to view details">Math 101 – Monday 9:00 AM</li>
            <li title="Click to view details">Biology 202 – Tuesday 11:00 AM</li>
            <li title="Click to view details">History 305 – Wednesday 2:00 PM</li>
          </ul>
        </div>

        <div className="widget hoverable">
          <h3>Semester Info</h3>
          <p>Fall 2025</p>
        </div>

        <div className="widget hoverable">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/calendar"> View Calendar</a></li>
            <li><a href="/account"> Account</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
