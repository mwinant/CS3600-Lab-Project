import React, { useState } from 'react';
import ClassForm from '../components/ClassForm';
import ClassCalendar from '../components/ClassCalendar';

const Home = () => {
  const [classes, setClasses] = useState([]);

  const addClass = (newClass) => {
    setClasses([...classes, newClass]);
    // 🔧 TODO: Send newClass to backend
  };

  return (
    <div className="home-page">
      <ClassForm onAddClass={addClass} />
      <ClassCalendar classes={classes} />
    </div>
  );
};

export default Home;