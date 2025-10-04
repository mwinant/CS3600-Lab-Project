import React, { useState } from 'react';
import './SignIn.css';
const SignIn = () => {
   const sendSignInData = (email, password) => {
    // TODO: Implement sign-in logic in backend
  }
  return (
    <div className="signin-page">
      <h1>Sign In</h1>
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