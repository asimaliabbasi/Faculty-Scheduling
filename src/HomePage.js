import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleNavigation = (panel) => {
    navigate(`/${panel}`); // Use navigate to go to the specific route
  };

  return (
    <div className="home-page-container">
      <h1>Welcome! Please choose a panel to login:</h1>
      <div>
        <button onClick={() => handleNavigation('admin-login')}>Admin Panel</button>
        <button onClick={() => handleNavigation('student-login')}>Student Panel</button> {/* Updated student login route */}
        <button onClick={() => handleNavigation('teacher-login')}>Teacher Panel</button> {/* Updated teacher login route */}
      </div>
    </div>
  );
};

export default HomePage;
