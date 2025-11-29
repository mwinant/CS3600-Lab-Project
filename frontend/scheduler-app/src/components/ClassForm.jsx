import React, { useState } from 'react';
import { useEffect } from 'react';
import './ClassForm.css';

function ClassForm({ selectedSemester, setSelectedSemester, setClasses, onAdded }) {
  const [availableCourses, setAvailableCourses] = useState([]);
  // Fetch available courses from backend
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/courses');
        if (res.ok) {
          const data = await res.json();
          // Group courses by title and semester, merge dates into days array
          const grouped = {};
          (Array.isArray(data) ? data : []).forEach(course => {
            const key = `${course.title}-${course.semester}`;
            if (!grouped[key]) {
              grouped[key] = {
                ...course,
                days: [],
                start_time: course.start_time || course.time || '',
                end_time: course.end_time || '',
              };
            }
            // Add day from date
            if (course.date) {
              const day = new Date(course.date).toLocaleDateString('en-US', { weekday: 'short' });
              if (!grouped[key].days.includes(day)) {
                grouped[key].days.push(day);
              }
            }
          });
          setAvailableCourses(Object.values(grouped));
        }
      } catch (e) {
        setAvailableCourses([]);
      }
    }
    fetchCourses();
  }, []);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [days, setDays] = useState({});
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  // weekdays only (no weekends)
  const dayList = ['Mon','Tue','Wed','Thu','Fri'];

  const toggleDay = (d) => {
    setDays(prev => ({ ...prev, [d]: !prev[d] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Try to find course in catalog first
    let usedCatalog = false;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/courses/search?title=${encodeURIComponent(title)}&semester=${encodeURIComponent(selectedSemester)}`
      );

      if (res.ok) {
        const course = await res.json();
        if ((course.date || Array.isArray(course.date)) && (course.time || course.start_time) && course.semester === selectedSemester) {
          // Normalize catalog class to always have start_time, end_time, and days array
          let daysArr = [];
          if (Array.isArray(course.date)) {
            daysArr = course.date.map(dateStr => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }));
          } else if (course.date) {
            daysArr = [new Date(course.date).toLocaleDateString('en-US', { weekday: 'short' })];
          }
          const normalizedCourse = {
            ...course,
            days: daysArr,
            start_time: course.start_time || course.time || '',
            end_time: course.end_time || '',
          };
          setClasses(prev => {
            const alreadyAdded = prev.some(cls => cls.id === normalizedCourse.id);
            const updated = alreadyAdded ? prev : [...prev, normalizedCourse];
            // Persist to localStorage
            try {
              const raw = localStorage.getItem('user');
              const u = raw ? JSON.parse(raw) : {};
              u.classes = updated;
              localStorage.setItem('user', JSON.stringify(u));
            } catch (e) {}
            return updated;
          });
          setMessage(`Added "${normalizedCourse.title}" to your calendar.`);
          setTitle('');
          usedCatalog = true;
          if (onAdded) onAdded();
          return;
        }
      } else if (res.status !== 404) {
        // Only log errors that are not 404 (not found)
        console.error(`Error fetching course: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      // ignore catalog failures — fall back to manual add
    }

    // Manual recurring class add
    const selectedDays = Object.keys(days).filter(d => days[d]);
    if (selectedDays.length && startTime) {
      // Robust id: title-semester-days-startTime
      const newClass = {
        id: `${title.trim()}-${selectedSemester}-${selectedDays.join(',')}-${startTime}`,
        title: title.trim(),
        semester: selectedSemester,
        days: selectedDays, // e.g. ['Mon','Wed']
        start_time: startTime,
        end_time: endTime ? endTime : '',
        location: location || '',
      };
      setClasses(prev => {
        const already = prev.some(cls => cls.id === newClass.id);
        const updated = already ? prev : [...prev, newClass];
        // Persist to localStorage
        try {
          const raw = localStorage.getItem('user');
          const u = raw ? JSON.parse(raw) : {};
          u.classes = updated;
          localStorage.setItem('user', JSON.stringify(u));
        } catch (e) {}
        return updated;
      });
      setMessage(`Added "${newClass.title}" to your calendar.`);
      setTitle('');
      setDays({});
      setStartTime('');
      setEndTime('');
      setLocation('');
      if (onAdded) onAdded();
    } else {
      setMessage('Please select at least one day and a start time to add a custom class.');
    }
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

        <div className="days-row">
          {dayList.map(d => (
            <label key={d} className="day-checkbox">
              <input type="checkbox" checked={!!days[d]} onChange={() => toggleDay(d)} /> {d}
            </label>
          ))}
        </div>

        <div className="time-row">
          <label>
            Start
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </label>
          <label>
            End
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </label>
        </div>

        <input
          type="text"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="submit">Add Class</button>
      </form>

      {message && <p className="search-message">{message}</p>}
    </div>
  );
}

export default ClassForm;
