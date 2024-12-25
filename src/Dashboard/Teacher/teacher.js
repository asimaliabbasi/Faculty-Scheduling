import React, { useState, useEffect } from 'react';
import './teacher.css'; // Import the CSS file

const TeacherDashboard = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    studentName: '',
    studentRollNo: '',
    meetingDate: '',
    meetingTime: '',
    description: '',
    teacherName: '', // Add teacherName field to the meeting details state
  });
  const [error, setError] = useState('');
  const [teacherName, setTeacherName] = useState('');

  // UseEffect to retrieve teacher name from localStorage
  useEffect(() => {
    const storedTeacherName = localStorage.getItem('teacherName');
    if (storedTeacherName) {
      setTeacherName(storedTeacherName);
      setMeetingDetails((prevState) => ({
        ...prevState,
        teacherName: storedTeacherName, // Set teacher name in the meeting details state
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    const { studentName, studentRollNo, meetingDate, meetingTime, description, teacherName } = meetingDetails;
  
    if (!studentName || !studentRollNo || !meetingDate || !meetingTime || !description || !teacherName) {
      setError('All fields are required.');
      return;
    }
  
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingDetails), // This already includes teacherName
      });
  
      if (response.ok) {
        alert('Meeting scheduled successfully!');
        setMeetingDetails({
          studentName: '',
          studentRollNo: '',
          meetingDate: '',
          meetingTime: '',
          description: '',
          teacherName: teacherName, // Ensure teacherName is reset after form submission
        });
      } else {
        setError('Failed to schedule meeting.');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setError('An error occurred while scheduling the meeting.');
    }
  };
  

  return (
    <div className="teacher-dashboard">
    <h2 className="teacher-dashboard__welcome">Welcome, {teacherName}</h2>
    <h3 className="teacher-dashboard__title">Schedule a Meeting</h3>

      {error && <p className="error-message">{error}</p>}

      <form className="meeting-form" onSubmit={handleScheduleMeeting}>
        <div className="form-group">
          <label htmlFor="studentName">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={meetingDetails.studentName}
            onChange={handleInputChange}
            required
            id="studentName"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="studentRollNo">Student Roll No</label>
          <input
            type="text"
            name="studentRollNo"
            value={meetingDetails.studentRollNo}
            onChange={handleInputChange}
            required
            id="studentRollNo"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="meetingDate">Meeting Date</label>
          <input
            type="date"
            name="meetingDate"
            value={meetingDetails.meetingDate}
            onChange={handleInputChange}
            required
            id="meetingDate"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="meetingTime">Meeting Time</label>
          <input
            type="time"
            name="meetingTime"
            value={meetingDetails.meetingTime}
            onChange={handleInputChange}
            required
            id="meetingTime"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={meetingDetails.description}
            onChange={handleInputChange}
            required
            id="description"
            className="form-control"
          />
        </div>

        <button type="submit" className="submit-button">Schedule Meeting</button>
      </form>
    </div>
  );
};

export default TeacherDashboard;
