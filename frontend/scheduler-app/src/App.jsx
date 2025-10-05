import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ClassCalendar from './components/ClassCalendar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import './pages/Pages.css';
import Account from './pages/Account';
import Footer from './components/Footer';

function App() {
  const [classes, setClasses] = useState([]);
  
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<ClassCalendar classes={classes} />} />
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


