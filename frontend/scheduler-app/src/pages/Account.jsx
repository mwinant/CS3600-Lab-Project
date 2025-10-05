import React from 'react';
import './Account.css';

const Account = () => {
  return (
    <div className="account-page">
      <h2>Account Settings</h2>

      <div className="account-section">
        <h3>Change Username</h3>
        <input type="text" placeholder="New username" />
        <button>Update</button>
      </div>

      <div className="account-section">
        <h3>Change Password</h3>
        <input type="password" placeholder="Current password" />
        <input type="password" placeholder="New password" />
        <button>Update</button>
      </div>

      <div className="account-section">
        <h3>Preferences</h3>
        <label>
          <input type="checkbox" />
          Enable notifications
        </label>
      </div>

      <div className="account-section">
        <button className="logout-btn">Log Out</button>
      </div>
    </div>
  );
};

export default Account;
