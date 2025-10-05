import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ClassForm from './ClassForm';
import './ClassCalendar.css'; // optional styling

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
        }))
    : [];

  return (
    <div className="calendar-container">
      <ClassForm
        onAddClass={handleAddClass}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
      />

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
