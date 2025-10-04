import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function ClassCalendar({ classes }) {
  const events = classes.map((cls) => ({
    title: cls.title,
    date: cls.date,
  }));

  return (
    <div className="class-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={(info) => alert(`Clicked date: ${info.dateStr}`)}
      />
    </div>
  );
}

export default ClassCalendar;

