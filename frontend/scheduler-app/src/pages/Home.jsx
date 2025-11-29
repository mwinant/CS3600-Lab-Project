import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && u.name) setName(u.name);
      }
    } catch (e) {
      // ignore parse errors and keep name empty
    }
  }, []);
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Welcome{ name ? `, ${name}` : ',' } </h2>

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
