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
            <li title="Click to view details">CS 3600 Database Systems</li>
            <li title="Click to view details">MATH 335 Linear Algebra</li>
            <li title="Click to view details">CS 1234 Demo Class</li>
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
