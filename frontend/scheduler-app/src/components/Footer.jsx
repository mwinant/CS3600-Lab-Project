import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Class Scheduler</p>
      <div className="footer-links">
        <a href="/account">Account</a>
        <a href="/signin">Sign In</a>
        <a href="/calendar">Calendar</a>
        <a href="/admin">Admin Panel</a>
      </div>
    </footer>
  );
};

export default Footer;
