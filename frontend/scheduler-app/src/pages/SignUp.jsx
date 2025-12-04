import React, { useState } from 'react';
import './SignUp.css';
import axios from 'axios';

const API = 'http://localhost:8000/api';

const SignUp = () => {

  const sendSignUpData = (username, email, password) => {
    axios.post(`${API}/signup`, { username, email, password })
      .then(response => {
        console.log('Sign-up successful:', response.data);
        // redirect to home on successful sign-up
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error signing up:', error);
      });
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
    </div>
  );
};

export default SignUp;