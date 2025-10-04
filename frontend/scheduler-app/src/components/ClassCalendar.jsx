import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


function ClassCalendar({ classes }) {
  const events = classes.map((cls) => ({
    title: cls.title,
    start: `${cls.date}T${cls.time}`,
  }));

  return (
<FullCalendar
  plugins={[timeGridPlugin, interactionPlugin]}
  initialView="timeGridWeek"
  weekends={false}
  events={events}
  slotMinTime="07:00:00"
  slotMaxTime="21:00:00"
  allDaySlot={false} 
  headerToolbar={false} // hides navigation and date
  initialDate="2025-10-06" // any Monday
  showNonCurrentDates={false}
  dayHeaderFormat={{ weekday: 'short' }} // shows Mon, Tue, etc.
  height="auto"
/>
  );
}

export default ClassCalendar;
