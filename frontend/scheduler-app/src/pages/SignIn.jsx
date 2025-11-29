import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const sendSignInData = async (email, password) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || 'Sign in failed');
        return;
      }
      // store user and redirect to homepage
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setMsg('Sign in failed.');
    }
  }

  return (
    <div className="signin-page">
      <h1>Sign In</h1>
      <p>Don't have an account? <a href="/signup">Sign up here</a>.</p>
      <form onSubmit={(e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        sendSignInData(email.value, password.value);
      }}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default SignIn;