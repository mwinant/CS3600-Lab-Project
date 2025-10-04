import React, { useState } from 'react';

function ClassForm({ onAddClass }) {
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClass = {
      title,
      date,
      time,
      id: Date.now()
    };
    onAddClass(newClass);
    setTitle('');
    setDate('');
    setTime('');
  };

  return (
    <form className="class-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Class Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
        <option value="">Select Semester</option>
        <option value="Fall 2025">Fall 2025</option>
        <option value="Spring 2026">Spring 2026</option>
      </select>

      <button type="submit">Add Class</button>
    </form>
  );
}

export default ClassForm;

