import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'
import notificationBell from '../assets/notification-bell.svg'
const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        // initialize user from localStorage so Sign Out appears when signed in
        try {
            const raw = localStorage.getItem('user');
            if (raw) setUser(JSON.parse(raw));
        } catch (e) {
            setUser(null);
        }

        const onStorage = (e) => {
            if (e.key === 'user') {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch (_) {
                    setUser(null);
                }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const signOut = () => {
        // clear stored user and go to sign-in page
        try {
            localStorage.removeItem('user');
        } catch (e) {
            // ignore
        }
        setUser(null);
        navigate('/signin');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1>Class Scheduler</h1>
            </div>
            <div className="navbar-center">
                <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/account">Account</Link></li>
                </ul>
            </div>
            <div className="navbar-right">
                <div className="notification-bell">
                    <img src={notificationBell} alt="Notification Bell" className="img" />
                    <span className="badge">0</span>
                </div>
                <div className="user-area">
                    {user ? (
                        <>
                            <button className="signout-btn" onClick={signOut}>Sign Out</button>
                        </>
                    ) : (
                        <>
                        </>
                    )}
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
