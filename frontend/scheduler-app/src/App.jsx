import React, { useState } from 'react';
import ClassForm from './components/ClassForm';
import ClassCalendar from './components/ClassCalendar';

function App() {
  const [classes, setClasses] = useState([]);

  const addClass = (newClass) => {
    setClasses([...classes, newClass]);
    // 🔧 TODO: Send newClass to backend
  };

  return (
    <div className="app-container">
      <header>
        <h1>Class Scheduler</h1>
      </header>
      <main>
        <ClassForm onAddClass={addClass} />
        <ClassCalendar classes={classes} />
      </main>
    </div>
  );
}

export default App;


