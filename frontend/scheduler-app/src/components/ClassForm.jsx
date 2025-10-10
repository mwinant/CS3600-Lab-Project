import React, { useState } from 'react';
import './ClassForm.css';

function ClassForm({ selectedSemester, setSelectedSemester, setClasses }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // First try searching by course name
    fetch(`http://localhost:8000/api/courses/search/${encodeURIComponent(title)}`)
      .then(res => {
        if (!res.ok) throw new Error('Course not found');
        return res.json();
      })
      .then(course => {
        if (course.meetingTimes && course.semester === selectedSemester) {
          setClasses(prev => {
            const alreadyAdded = prev.some(cls => cls.id === course.id);
            return alreadyAdded ? prev : [...prev, course];
          });
          setMessage(`Added "${course.title}" to your calendar.`);
        } else {
          setMessage(`Course found but missing date/time or semester mismatch.`);
        }
      })
      .catch(() => setMessage('Course not found.'));
    
    setTitle('');
  };

  return (
    <div className="class-form-wrapper">
      <div className="semester-selector">
        <label htmlFor="semester">Semester:</label>
        <select
          id="semester"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          required
        >
          <option value="">Select Semester</option>
          <option value="Fall 2023">Fall 2023</option>
          <option value="Spring 2024">Spring 2024</option>
          <option value="Summer 2024">Summer 2024</option>
          <option value="Fall 2024">Fall 2024</option>
          <option value="Spring 2025">Spring 2025</option>
          <option value="Fall 2025">Fall 2025</option>
          <option value="Spring 2026">Spring 2026</option>
        </select>
      </div>

      <form className="class-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit">Add Class</button>
      </form>

      {message && <p className="search-message">{message}</p>}
    </div>
  );
}

export default ClassForm;
