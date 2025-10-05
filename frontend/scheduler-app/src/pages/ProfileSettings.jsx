import React from 'react'
import './ProfileSettings.css'
import profilePic from '../assets/default-profile.jpg'
const ProfileSettings = () => {
    const updateProfile = (email, password, picture, major) => {
        // Logic to update the profile
    }
    return (
        <div className="profile-page">
            <h1>Profile Settings</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                const { email, password, picture, major } = e.target.elements;
                updateProfile(email.value, password.value, picture.files[0], major.value);
            }}>
                <label>Update your profile information below:</label>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" placeholder="Email" />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="Password"  />
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <img src={profilePic} alt="Profile" />
                    <input type="file" name="picture" placeholder="Profile Picture"  />
                </div>
                <div>
                    <label>Major:</label>
                    <input type="text" name="major" placeholder="Major" />
                </div>
                <button type="submit">Update Profile</button>

            </form>
        </div>
    )
}

export default ProfileSettings
