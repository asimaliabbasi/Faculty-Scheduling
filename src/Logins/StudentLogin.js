import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Ensure the CSS file is imported

const StudentLogin = () => {
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Client-side validation
    if (!rollNo || !password) {
      setError('Both Roll Number and Password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the roll number and student name in localStorage
        localStorage.setItem('rollNo', rollNo);
        localStorage.setItem('studentName', data.name); // Assuming the response contains student name
        setSuccessMessage('Login successful!');
        setError('');
        navigate('/student-dashboard'); // Redirect to student dashboard
      } else {
        setError(data.message || 'Invalid roll number or password');
        setSuccessMessage('');
      }
    } catch (error) {
      setError('Failed to connect to the server');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Student Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Roll Number:</label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
            placeholder="Enter your Roll Number"
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
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default StudentLogin;
