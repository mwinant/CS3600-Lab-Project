import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [name, setName] = useState('');
  const [classes, setClasses] = useState([]);
  const [semester, setSemester] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.name) setName(u.name);
        if (Array.isArray(u?.classes)) setClasses(u.classes);
        // Default to the semester of the first class, or Fall 2025 if none
        if (u?.classes?.length) {
          setSemester(u.classes[0].semester || '');
        } else {
          setSemester('Fall 2025');
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Welcome{ name ? `, ${name}` : ',' } </h2>

      <div className="widgets">
        <div className="widget hoverable">
          <h3>Classes</h3>
          <ul>
            {classes.length > 0 ? (
              classes.map((cls) => (
                <li key={cls.id} title="Click to view details">
                  {cls.title}
                </li>
              ))
            ) : (
              <li>No classes added yet</li>
            )}
          </ul>
        </div>

        <div className="widget hoverable">
          <h3>Semester Info</h3>
          <p>{semester || 'No semester selected'}</p>
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
