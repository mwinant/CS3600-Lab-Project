import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'
import notificationBell from '../assets/notification-bell.svg'
const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1>Class Scheduler</h1>
            </div>
            <div className="navbar-center">
                <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/signin">Sign In</Link></li>
                </ul>
            </div>
            <div className="navbar-right">
                <div className="notification-bell">
                    <img src={notificationBell} alt="Notification Bell" className="img" />
                    <span className="badge">0</span>
                </div>
                <div className="hamburger-menu" onClick={toggleMobileMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
