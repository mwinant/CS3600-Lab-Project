import React, { useState } from 'react';

function ClassForm({ onAddClass }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

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
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <button type="submit">Add Class</button>
    </form>
  );
}

export default ClassForm;

