import React, { useState } from 'react';
import './SignUp.css';
const SignUp = () => {
  const sendSignUpData = (username, email, password) => {
    // TODO: Implement sign-up logic in backend
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