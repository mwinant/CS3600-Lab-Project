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

  const [selectedSeason, setSelectedSeason] = useState('Spring');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState(false);

  // Derive selectedSemester from season and year
  const selectedSemester = `${selectedSeason} ${selectedYear}`;

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
              // Handle both full day names (Mon) and short format (m, tu, th, w, f)
              let idx = dayMap[dayStr];
              if (idx === undefined) {
                idx = dayNameToIndex[normalizeDay(dayStr)];
              }
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
    // Get classes for the selected semester from React state
    const selectedClasses = classes.filter(cls => cls.semester === selectedSemester);
    
    console.log('=== EXPORT DEBUG ===');
    console.log('Selected semester:', selectedSemester);
    console.log('Total classes in state:', classes.length);
    console.log('Selected classes count:', selectedClasses.length);
    if (selectedClasses.length > 0) {
      console.log('First course:', JSON.stringify(selectedClasses[0], null, 2));
    }
    
    if (selectedClasses.length === 0) {
      alert('No courses to export for this semester');
      return;
    }

    const events = [];

    selectedClasses.forEach(course => {
      console.log('\nProcessing:', course.title);
      
      // Make sure all required fields exist
      if (!course.start_date) {
        console.log('  Missing start_date');
        return;
      }
      if (!course.end_date) {
        console.log('  Missing end_date');
        return;
      }
      if (!course.start_time) {
        console.log('  Missing start_time');
        return;
      }
      if (!course.end_time) {
        console.log('  Missing end_time');
        return;
      }
      if (!course.days) {
        console.log('  Missing days');
        return;
      }

      // Ensure days is an array
      const days = Array.isArray(course.days) ? course.days : String(course.days).split('');
      console.log('  Days array:', days);
      
      // Parse "2026-01-14" format (YYYY-MM-DD)
      const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
      const startMatch = course.start_date.match(dateRegex);
      const endMatch = course.end_date.match(dateRegex);
      
      console.log('  Start date string:', course.start_date, 'match:', startMatch);
      console.log('  End date string:', course.end_date, 'match:', endMatch);
      
      if (!startMatch || !endMatch) {
        console.log('  Could not parse dates');
        return;
      }
      
      const startDate = new Date(parseInt(startMatch[1]), parseInt(startMatch[2]) - 1, parseInt(startMatch[3]));
      const endDate = new Date(parseInt(endMatch[1]), parseInt(endMatch[2]) - 1, parseInt(endMatch[3]));
      
      console.log('  Date range:', startDate.toISOString(), 'to', endDate.toISOString());

      // Parse times - format should be "HH:MM"
      const timeRegex = /(\d{1,2}):(\d{2})/;
      const startTimeMatch = course.start_time.match(timeRegex);
      const endTimeMatch = course.end_time.match(timeRegex);
      
      if (!startTimeMatch || !endTimeMatch) {
        console.log('  Could not parse times. start_time:', course.start_time, 'end_time:', course.end_time);
        return;
      }

      const startHour = startTimeMatch[1].padStart(2, '0');
      const startMin = startTimeMatch[2];
      const endHour = endTimeMatch[1].padStart(2, '0');
      const endMin = endTimeMatch[2];
      
      console.log(`  Times: ${startHour}:${startMin} - ${endHour}:${endMin}`);

      // Map day characters to day of week (0=Sun, 1=Mon, etc.)
      const dayMap = { 'm': 1, 'tu': 2, 'w': 3, 'th': 4, 'f': 5, 'sa': 6, 'su': 0 };
      const meetingDayNumbers = new Set();
      
      days.forEach(day => {
        const normalized = String(day).toLowerCase().trim();
        const dayNum = dayMap[normalized];
        console.log('    Day:', day, '-> normalized:', normalized, '-> number:', dayNum);
        if (dayNum !== undefined) {
          meetingDayNumbers.add(dayNum);
        }
      });
      
      console.log('  Meeting day numbers:', Array.from(meetingDayNumbers));

      // Generate events for each day in range
      let eventCount = 0;
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dow = d.getDay();
        
        if (meetingDayNumbers.has(dow)) {
          eventCount++;
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          
          // Use local time without Z suffix to avoid timezone conversion
          events.push({
            title: course.title,
            dtstart: `${yyyy}${mm}${dd}T${startHour}${startMin}00`,
            dtend: `${yyyy}${mm}${dd}T${endHour}${endMin}00`
          });
        }
      }
      
      console.log(`  Created ${eventCount} events`);
    });

    console.log('Total events:', events.length);
    console.log('===================\n');

    if (events.length === 0) {
      alert('No events generated - check browser console for details');
      return;
    }

    // Build ICS with timezone support
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Class Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-TIMEZONE:America/Los_Angeles',
      'BEGIN:VTIMEZONE',
      'TZID:America/Los_Angeles',
      'BEGIN:STANDARD',
      'DTSTART:20231105T020000',
      'TZOFFSETFROM:-0700',
      'TZOFFSETTO:-0800',
      'TZNAME:PST',
      'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
      'END:STANDARD',
      'BEGIN:DAYLIGHT',
      'DTSTART:20240310T020000',
      'TZOFFSETFROM:-0800',
      'TZOFFSETTO:-0700',
      'TZNAME:PDT',
      'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
      'END:DAYLIGHT',
      'END:VTIMEZONE'
    ];

    events.forEach((evt, i) => {
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:evt${Date.now()}-${i}@classscheduler`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      lines.push(`DTSTART;TZID=America/Los_Angeles:${evt.dtstart}`);
      lines.push(`DTEND;TZID=America/Los_Angeles:${evt.dtend}`);
      lines.push(`SUMMARY:${evt.title}`);
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    const ics = lines.join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/courses/search?title=${encodeURIComponent(searchTerm)}&semester=${encodeURIComponent(selectedSemester)}`
      );
      const data = await res.json();
      console.log('Search results from API:', data);
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddSearchResult = (course) => {
    console.log('Adding course from search:', course);
    console.log('  start_date:', course.start_date);
    console.log('  end_date:', course.end_date);
    
    // Parse days - can be array from search or string from form
    let daysArray = [];
    if (Array.isArray(course.days)) {
      daysArray = course.days;
    } else if (course.days && typeof course.days === 'string') {
      daysArray = course.days.split('');
    } else {
      daysArray = ['Mon'];
    }
    
    const newClass = {
      id: Date.now(),
      title: course.name || course.title,
      semester: selectedSemester,
      start_time: course.start_time || '09:00',
      end_time: course.end_time || '10:00',
      days: daysArray,
      start_date: course.start_date || null,
      end_date: course.end_date || null,
      location: course.location || ''
    };
    
    console.log('Creating newClass:', newClass);
    
    const updated = [...classes, newClass];
    setClasses(updated);
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : {};
      u.classes = updated;
      localStorage.setItem('user', JSON.stringify(u));
    } catch (e) {}
    setSearchResults([]);
    setSearchTerm('');
  };

  const formatDays = (days) => {
    if (!days) return '';
    if (typeof days === 'string') {
      const dayMap = { 'm': 'Mon', 'w': 'Wed', 'f': 'Fri', 'tu': 'Tue', 'th': 'Thu' };
      return days.split('').map(d => dayMap[d] || d).join(', ');
    }
    if (Array.isArray(days)) {
      const dayMap = { 'm': 'Mon', 'w': 'Wed', 'f': 'Fri', 'tu': 'Tue', 'th': 'Thu', 'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu', 'Fri': 'Fri' };
      return days.map(d => dayMap[d] || d).join(', ');
    }
    return '';
  };

  const parseTimeFormat = (timeStr) => {
    if (!timeStr) return '09:00';
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (!match) return '09:00';
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3]?.toLowerCase();
    
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const parseMonthDay = (dateStr) => {
    const match = dateStr.match(/(\w+)\s+(\d{1,2})/);
    if (!match) return null;
    const months = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 };
    const month = months[match[1].toLowerCase()];
    const day = parseInt(match[2]);
    return { month, day };
  };

  const generateCoursesForDateRange = (course) => {
    const startDateObj = parseMonthDay(course.start_date);
    const endDateObj = parseMonthDay(course.end_date);
    
    if (!startDateObj || !endDateObj) return [];

    const year = 2026;
    const startDate = new Date(year, startDateObj.month, startDateObj.day);
    const endDate = new Date(year, endDateObj.month, endDateObj.day);

    const dayMap = { 'm': 1, 'w': 3, 'f': 5, 'tu': 2, 'th': 4 };
    const coursesGenerated = [];

    // Convert days array to string if needed (e.g., ['m', 'w', 'f'] -> 'mwf')
    let daysStr = '';
    if (Array.isArray(course.days)) {
      daysStr = course.days.join('').toLowerCase();
    } else {
      daysStr = (course.days || '').toLowerCase();
    }

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      
      // Check if this day matches the course days
      let matches = false;
      
      if (daysStr.includes('tu') && dayOfWeek === 2) matches = true;
      else if (daysStr.includes('th') && dayOfWeek === 4) matches = true;
      else if (daysStr.includes('m') && dayOfWeek === 1 && !daysStr.includes('tu')) matches = true;
      else if (daysStr.includes('w') && dayOfWeek === 3 && !daysStr.includes('th')) matches = true;
      else if (daysStr.includes('f') && dayOfWeek === 5) matches = true;

      if (matches) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        
        coursesGenerated.push({
          id: Date.now() + Math.random(),
          title: course.title,
          semester: course.semester || selectedSemester,
          date: `${yyyy}-${mm}-${dd}`,
          start_time: parseTimeFormat(course.start_time),
          end_time: parseTimeFormat(course.end_time),
          location: course.location || ''
        });
      }
    }

    return coursesGenerated;
  };

  const handleImportJSON = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const coursesData = JSON.parse(text);

      if (!Array.isArray(coursesData)) {
        alert('Invalid JSON format. Expected an array of courses.');
        setImporting(false);
        return;
      }

      // Send to backend for database import
      const response = await fetch('http://localhost:8000/api/courses/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ courses: coursesData })
      });

      const result = await response.json();
      
      if (!response.ok) {
        alert('Database import error: ' + (result.message || 'Unknown error'));
        console.error('Backend error:', result);
        setImporting(false);
        return;
      }

      console.log('Database import result:', result);

      // Just show success message - courses are in database now
      alert(`Successfully imported ${result.imported} courses to database!\n\nSearch for them in the search bar to add to your schedule.`);
    } catch (err) {
      console.error('Import error:', err);
      alert('Error importing JSON: ' + err.message);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
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
      {/* <button style={{marginBottom: '1rem'}} onClick={logLocalStorageClasses}>Debug: Log Classes in localStorage</button> */}
      
      <div style={{marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
        <div>
          <label style={{marginRight: '0.5rem', fontWeight: 'bold'}}>Season:</label>
          <select 
            value={selectedSeason} 
            onChange={(e) => setSelectedSeason(e.target.value)}
            style={{padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}}
          >
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
          </select>
        </div>
        <div>
          <label style={{marginRight: '0.5rem', fontWeight: 'bold'}}>Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}}
          >
            {Array.from({length: 10}, (_, i) => {
              const year = new Date().getFullYear() + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
        <div style={{fontSize: '1rem', fontWeight: 'bold', color: '#333'}}>
          Selected: {selectedSemester}
        </div>
      </div>
      
      <div style={{marginBottom: '1rem'}}>
        <label style={{display: 'inline-block', marginRight: '0.5rem'}}>
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            style={{display: 'none'}}
            ref={(input) => { window.fileInput = input; }}
          />
          <button
            onClick={() => window.fileInput?.click()}
            style={{padding: '0.5rem 1rem', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
            disabled={importing}
          >
            {importing ? 'Importing...' : 'Import JSON'}
          </button>
        </label>
      </div>
      
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'flex-start', flexWrap: 'wrap'}}>
        <input
          type="text"
          placeholder="Search courses by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{flex: 1, minWidth: '200px', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px'}}
        />
        <button onClick={handleSearch} style={{padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div style={{marginBottom: '1rem', padding: '0.5rem', background: '#f9f9f9', borderRadius: '4px'}}>
          {searchResults.map((course, idx) => (
            <div key={idx} style={{marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem'}}>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 'bold'}}>{course.name || course.title}</div>
                <div style={{fontSize: '0.9rem', color: '#666'}}>
                  {formatDays(course.days)}
                </div>
                <div style={{fontSize: '0.9rem', color: '#666'}}>
                  {course.start_date && course.end_date && `${course.start_date} - ${course.end_date}`}
                </div>
                <div style={{fontSize: '0.9rem', color: '#666'}}>
                  {course.start_time && course.end_time && `${course.start_time} - ${course.end_time}`}
                </div>
              </div>
              <button onClick={() => handleAddSearchResult(course)} style={{padding: '0.3rem 0.8rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap'}}>
                Add
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="form-toggle-row">
        <button className="toggle-form-btn" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Close' : 'Add Class'}
        </button>
      </div>
      {showForm && (
        <ClassForm
          selectedSemester={selectedSemester}
          setSelectedSemester={() => {}}
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
