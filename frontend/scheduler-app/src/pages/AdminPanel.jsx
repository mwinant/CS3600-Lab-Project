import React, { useState } from 'react';
import './AdminPanel.css';

function AdminPanel() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const addCourse = (Classname, Classcode, Classdescription, meetingtimes, semester) => {
        setLoading(true);
        setMessage('');
        
        fetch('http://localhost:8000/api/courses',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: Classname,
                    code: Classcode,
                    description: Classdescription,
                    meetingTimes: meetingtimes,
                    semester: semester
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Course added:', data);
                setMessage('Course added successfully!');
                // Clear the form
                document.querySelector('form').reset();
                // Hide all time inputs
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
                    const timeInput = document.getElementById(`time_${day}`);
                    if (timeInput) timeInput.style.display = 'none';
                });
            })
            .catch(error => {
                console.error('Error adding course:', error);
                setMessage('Error adding course: ' + error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    //add database connection here but this is a placeholder
    const semesters = [ 'Fall 2025', 'Spring 2026', 'Summer 2026', 'Fall 2026'];
    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
            
            <form onSubmit={(e) => {
                e.preventDefault();
                const Classname = e.target.Classname.value;
                const Classcode = e.target.Classcode.value;
                const Classdescription = e.target.Classdescription.value;
                
                // Collect meeting times from checkboxes and time inputs
                const meetingtimes = Array.from(e.target.querySelectorAll('input[name^="day_"]:checked'))
                    .map(checkbox => {
                        const day = checkbox.name.replace('day_', '');
                        const timeInput = document.getElementById(`time_${day}`);
                        return `${day}: ${timeInput.value}`;
                    })
                    .join(', ') || 'No meeting times selected';
                
                const semester = e.target.semester.value;
                addCourse(Classname, Classcode, Classdescription, meetingtimes, semester);
            }}>
                <div>
                    <label>Class Name:</label>
                    <input type="text" name="Classname" required />
                </div>
                <div>
                    <label>Class Code:</label>
                    <input type="text" name="Classcode" required />
                </div>
                <div>
                    <label>Class Description:</label>
                    <textarea name="Classdescription" required />
                </div>
                <div>
                    <label>Meeting Times:</label>

                    <div className="meeting-days">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                            <div key={day}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name={`day_${day}`}
                                        onChange={e => {
                                            const timeInput = document.getElementById(`time_${day}`);
                                            if (timeInput) timeInput.style.display = e.target.checked ? 'inline-block' : 'none';
                                        }}
                                    />
                                    {day}
                                </label>
                                <input
                                    type="text"
                                    id={`time_${day}`}
                                    name={`time_${day}`}
                                    placeholder="Meeting time (e.g. 10:00AM-11:00AM)"
                                    style={{ display: 'none', marginLeft: '10px' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label>Semester:</label>
                    <select name="semester" required>
                        {semesters.map((sem) => (
                            <option key={sem} value={sem}>
                                {sem}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding Course...' : 'Add Course'}
                </button>
            </form>
            <p>Manage courses, users, and settings from this panel.</p>
        </div>
    );
}

export default AdminPanel;
