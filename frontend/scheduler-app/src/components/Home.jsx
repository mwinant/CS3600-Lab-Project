import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="dashboard">
      <h2>Welcome, Mikayla 👋</h2>
      <p className="subtitle">Your semester at a glance</p>

      <div className="widgets">
        <div className="widget">
          <h3>📅 Upcoming Classes</h3>
          <ul>
            <li>Math 101 – Monday 9:00 AM</li>
            <li>Biology 202 – Tuesday 11:00 AM</li>
            <li>History 305 – Wednesday 2:00 PM</li>
          </ul>
        </div>

        <div className="widget">
          <h3>🎓 Semester Info</h3>
          <p>Fall 2025</p>
          <p>Start: Sept 1 · End: Dec 15</p>
        </div>

        <div className="widget">
          <h3>🧭 Quick Links</h3>
          <ul>
            <li><a href="/calendar">View Calendar</a></li>
            <li><a href="/signup">Sign Up</a></li>
            <li><a href="/signin">Sign In</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
