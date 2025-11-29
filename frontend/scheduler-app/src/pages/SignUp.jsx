import React, { useState } from 'react';
import './SignUp.css';

const SignUp = () => {
  const [msg, setMsg] = useState('');

  const sendSignUpData = async (username, email, password) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password, password_confirmation: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.errors ? Object.values(data.errors).flat().join(' ') : data.message || 'Sign up failed');
        return;
      }
      setMsg('Sign up successful.');
      // optionally store user:
      localStorage.setItem('user', JSON.stringify(data.user));
      // redirect or update app state as needed
    } catch (err) {
      setMsg('Sign up failed.');
    }
  }

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        const { username, email, password } = e.target.elements;
        sendSignUpData(username.value, email.value, password.value);
      }}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default SignUp;