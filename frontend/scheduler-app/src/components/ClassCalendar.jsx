import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ClassForm from './ClassForm';
import './ClassCalendar.css';

function ClassCalendar({ classes, setClasses }) {
  const handleRemoveClass = (id) => {
    const updated = classes.filter(cls => cls.id !== id);
    setClasses(updated);
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : {};
      u.classes = updated;
      localStorage.setItem('user', JSON.stringify(u));
    } catch (e) {}
  };

  const logLocalStorageClasses = () => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        console.log('localStorage user.classes:', u.classes);
      } else {
        console.log('No user object in localStorage');
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  };

  const [selectedSemester, setSelectedSemester] = useState('Fall 2025');
  const [showForm, setShowForm] = useState(false);

  const getDateForWeekday = (weekdayIndex) => {
    const now = new Date();
    const todayIndex = now.getDay();
    const diff = weekdayIndex - todayIndex;
    const target = new Date(now);
    target.setDate(now.getDate() + diff);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const dayNameToIndex = { 'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 'Sat':6 };

  const normalizeDay = (d) => {
    if (!d) return null;
    const s = String(d).trim().toLowerCase();
    if (s.startsWith('m')) return 'Mon';
    if (s.startsWith('tu')) return 'Tue';
    if (s.startsWith('w')) return 'Wed';
    if (s.startsWith('th')) return 'Thu';
    if (s.startsWith('f')) return 'Fri';
    if (s.startsWith('sa')) return 'Sat';
    if (s.startsWith('su')) return 'Sun';
    return null;
  };

  const filteredEvents = selectedSemester
    ? classes
        .filter((cls) => cls.semester === selectedSemester)
        .flatMap((cls) => {
          if (Array.isArray(cls.days) && cls.start_time) {
            const dayMap = {
              'Mon': 1, 'Monday': 1,
              'Tue': 2, 'Tues': 2, 'Tuesday': 2,
              'Wed': 3, 'Wednesday': 3,
              'Thu': 4, 'Thur': 4, 'Thursday': 4,
              'Fri': 5, 'Friday': 5,
              'Sat': 6, 'Saturday': 6,
              'Sun': 0, 'Sunday': 0
            };
            return cls.days.map((d) => {
              if (!d) return null;
              const dayStr = String(d).trim();
              const idx = dayMap[dayStr] !== undefined ? dayMap[dayStr] : dayNameToIndex[normalizeDay(dayStr)];
              if (idx === undefined) return null;
              const date = getDateForWeekday(idx);
              return {
                title: cls.title + (cls.location ? ` · ${cls.location}` : ''),
                start: `${date}T${cls.start_time}`,
                end: cls.end_time ? `${date}T${cls.end_time}` : undefined,
                id: `${cls.id}-${dayStr}`
              };
            }).filter(Boolean);
          }

          if ((cls.start_time || cls.time) && cls.days === undefined) {
            return [{
              title: cls.title + (cls.location ? ` · ${cls.location}` : ''),
              start: `${cls.date || ''}T${cls.start_time || cls.time}`,
              end: cls.end_time ? `${cls.date || ''}T${cls.end_time}` : undefined,
              id: cls.id
            }];
          }

          return [];
        })
    : [];

  const handleExport = () => {
    const header = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Class Scheduler//EN'
    ];

    const events = filteredEvents.map((event) => {
      const start = new Date(event.start);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return [
        'BEGIN:VEVENT',
        `UID:${event.id || start.getTime()}@classscheduler`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        `SUMMARY:${event.title}`,
        'END:VEVENT'
      ].join('\n');
    });

    const footer = ['END:VCALENDAR'];
    const icsContent = [...header, ...events, ...footer].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'class_schedule.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return (
    <div className="calendar-container">
      <div style={{marginBottom: '1rem'}}>
        <h4>Your Classes</h4>
        <ul style={{listStyle: 'none', padding: 0}}>
          {classes.filter(cls => cls.semester === selectedSemester).map(cls => (
            <li key={cls.id} style={{marginBottom: '0.5rem'}}>
              <span>{cls.title} {cls.date ? `(${cls.date})` : ''} {cls.days ? `(${cls.days.join(', ')})` : ''} {cls.start_time || cls.time} {cls.end_time ? `- ${cls.end_time}` : ''}</span>
              <button style={{marginLeft: '1rem', color: 'white', background: '#e74c3c', border: 'none', borderRadius: '4px', padding: '0.2rem 0.6rem', cursor: 'pointer'}} onClick={() => handleRemoveClass(cls.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <button style={{marginBottom: '1rem'}} onClick={logLocalStorageClasses}>Debug: Log Classes in localStorage</button>
      <div className="form-toggle-row">
        <button className="toggle-form-btn" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Close' : 'Add Class'}
        </button>
      </div>
      {showForm && (
        <ClassForm
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          setClasses={setClasses}
          onAdded={() => setShowForm(false)}
        />
      )}

      {selectedSemester && (
        <button onClick={handleExport} className="export-btn">
          Export Calendar (.ics)
        </button>
      )}

      {selectedSemester ? (
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          weekends={false}
          events={filteredEvents}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          headerToolbar={false}
          // Use today's date instead of hard-coded
          initialDate={new Date().toISOString().split('T')[0]}
          showNonCurrentDates={false}
          dayHeaderFormat={{ weekday: 'short' }}
          height="auto"
          eventColor="#87E1F5"
        />
      ) : (
        <p className="calendar-placeholder">Please select a semester to view your schedule.</p>
      )}
    </div>
  );
}

export default ClassCalendar;
