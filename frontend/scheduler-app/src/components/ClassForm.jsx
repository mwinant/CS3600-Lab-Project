import React, { useState } from 'react';
import './ClassForm.css';

function ClassForm({ onAddClass, selectedSemester, setSelectedSemester }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClass = {
      title,
      date,
      time,
      semester: selectedSemester,
      id: Date.now()
    };
    onAddClass(newClass);
    setTitle('');
    setDate('');
    setTime('');
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
    </div>
  );
}

export default ClassForm;


