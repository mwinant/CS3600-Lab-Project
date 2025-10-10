import React, { useState } from 'react';
import './ClassForm.css';

function ClassForm({ selectedSemester, setSelectedSemester, setClasses }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const parseMeetingTimes = (course) => {
    if (!course.meetingTimes) return { days: [], startTime: null, endTime: null };
    const dayMap = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };

    // collect day numbers (handles multiple days separated by commas)
    const days = Array.from(course.meetingTimes.matchAll(/(Monday|Tuesday|Wednesday|Thursday|Friday)/gi))
      .map(m => dayMap[m[0][0].toUpperCase() + m[0].slice(1)] || dayMap[m[0]])
      .filter(Boolean);

    // find first time range like 10:00AM-11:00 or 10:00-11:00
    const timeMatch = course.meetingTimes.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/);
    const to24 = (t) => {
      if (!t) return null;
      const d = new Date(`1970-01-01T00:00:00`);
      // try parsing with Date by normalizing AM/PM
      const norm = t.replace(/\s+/g, '');
      const m = norm.match(/(\d{1,2}):(\d{2})(AM|PM|am|pm)?/);
      if (!m) return null;
      let h = parseInt(m[1], 10);
      const min = m[2];
      const ampm = m[3] ? m[3].toUpperCase() : null;
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2,'0')}:${min}:00`;
    };

    const startTime = timeMatch ? to24(timeMatch[1]) : null;
    const endTime = timeMatch ? to24(timeMatch[2]) : null;
    return { days: days.length ? days : [], startTime, endTime };
  };
  const translateSemesterToTime = (semester) => {
    const m = semester.match(/(Spring|Summer|Fall)\s+(\d{4})/);
      if (!m) return null;
      const term = m[1];
      const year = Number(m[2]);
      let startMonth, endMonth;
  
      switch (term) {
        case 'Fall':
          startMonth = 7; // August
          endMonth = 11; // December
          break;
        case 'Spring':
          startMonth = 0; // January
          endMonth = 4; // May
          break;
        case 'Summer':
          startMonth = 5; // June
          endMonth = 6; // July
          break;
        default:
          startMonth = 7;
          endMonth = 11;
      }
      //You may think haha the 31st isnt a day in some months but my friend it works because the end month always has 31 days coincidentally
      return {
        start: new Date(year, startMonth, 1),
        end: new Date(year, endMonth, 31)
      };
    };
  const grabDatesofClasses = (semester,days) => {
    //grab the dates from the event
    let dates = [];
    //make an array based on the semester it is in
    const { start, end } = translateSemesterToTime(semester);
    const currentDate = start;
    while (currentDate <= end) {
      const day = currentDate.getDay();
      if (days.includes(day)) {
        dates.push(currentDate.toISOString().split('T')[0]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };
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
          const { days, startTime, endTime } = parseMeetingTimes(course);
          const dates = grabDatesofClasses(course.semester, days);
          setClasses(prev => {
            const additions = [];
            for (let date of dates) {
              const classInstance = {
                ...course,
                title: course.name,
                date,
                time: startTime,
                endTime
              };
              const alreadyAdded = prev.some(cls => cls.id === classInstance.id && cls.date === classInstance.date && cls.time === classInstance.time);
              if (!alreadyAdded) additions.push(classInstance);
            }
            return additions.length ? [...prev, ...additions] : prev;
          });
          setMessage(`Added "${course.name || course.title}" to your calendar.`);
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
          {/* Add options for each semester */}
          <option value="">Select Semester</option>
          <option value="Fall 2025">Fall 2025</option>
          <option value="Spring 2026">Spring 2026</option>
          <option value="Summer 2026">Summer 2026</option>
          <option value="Fall 2026">Fall 2026</option>
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
