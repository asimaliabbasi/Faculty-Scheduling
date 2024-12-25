import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Ensure the CSS file is imported

const TeacherLogin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setTeacherName('');

    // Validate fields before sending request
    if (!name || !password) {
      setError('Name and Password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/teachers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful!');
        setTeacherName(data.name); // Set teacher name from response
        setError('');

        // Store teacher name in localStorage
        localStorage.setItem('teacherName', data.name);

        // Navigate to the teacher's dashboard after successful login
        navigate('/teacher-dashboard');
      } else {
        setError(data.message || 'Invalid name or password');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Teacher Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your Name"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your Password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        {teacherName && <p className="welcome">Welcome, {teacherName}!</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default TeacherLogin;
