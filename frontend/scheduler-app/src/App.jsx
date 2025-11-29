import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ClassCalendar from './components/ClassCalendar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import './pages/Pages.css';
import Account from './pages/Account';
import Footer from './components/Footer';

function App() {
  const [classes, setClasses] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && Array.isArray(u.classes)) {
          return u.classes;
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    return [];
  });

  // persist classes to localStorage user whenever they change
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw) || {};
        u.classes = classes;
        localStorage.setItem('user', JSON.stringify(u));
      }
    } catch (e) {
      // ignore
    }
  }, [classes]);
  
  const ConditionalNavBar = () => {
    const location = useLocation();
    // hide NavBar on Sign In / Sign Up pages
    if (location.pathname === '/signin' || location.pathname === '/signup') return null;
    return <NavBar />;
  };

  return (
    <Router>
      <div className="app-container">
        <ConditionalNavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<ClassCalendar classes={classes} setClasses={setClasses} />} />
            <Route path="/account" element={<Account />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


