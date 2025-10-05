import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ClassForm from './ClassForm';
import './ClassCalendar.css';

function ClassCalendar({ classes, setClasses }) {
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleAddClass = (newClass) => {
    setClasses([...classes, newClass]);
  };

  const filteredEvents = selectedSemester
    ? classes
        .filter((cls) => cls.semester === selectedSemester)
        .map((cls) => ({
          title: cls.title,
          start: `${cls.date}T${cls.time}`,
          id: cls.id,
        }))
    : [];

  const handleExport = () => {
    const header = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Class Scheduler//EN'
    ];

    const events = filteredEvents.map((event) => {
      const start = new Date(event.start);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

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
      <ClassForm
        onAddClass={handleAddClass}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
      />

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
          initialDate="2025-10-06"
          showNonCurrentDates={false}
          dayHeaderFormat={{ weekday: 'short' }}
          height="auto"
        />
      ) : (
        <p className="calendar-placeholder">Please select a semester to view your schedule.</p>
      )}
    </div>
  );
}

export default ClassCalendar;

