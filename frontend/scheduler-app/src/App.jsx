import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ProfileSettings from './pages/ProfileSettings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


