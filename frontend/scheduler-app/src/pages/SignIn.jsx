import React, { useState } from 'react';
import './SignIn.css';
import axios from 'axios';

const API = 'http://localhost:8000/api';
const SignIn = () => {
   const sendSignInData = (email, password) => {
     axios.post(`${API}/login`, { email, password })
       .then(response => {
         console.log('Sign-in successful:', response.data);
          window.location.href = '/';
       })
       .catch(error => {
         console.error('Error signing in:', error);
         window.location.href = '/';
       });
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
    </div>
  );
};

export default SignIn;