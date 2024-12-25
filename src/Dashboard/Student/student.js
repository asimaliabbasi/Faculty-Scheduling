import React, { useState, useEffect } from 'react';
import './student.css';

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');

  // UseEffect to retrieve student name from localStorage and fetch meetings data
  useEffect(() => {
    const storedStudentName = localStorage.getItem('studentName');
    if (storedStudentName) {
      setStudentName(storedStudentName);
      // Fetch meetings data based on student name
      fetchMeetings(storedStudentName);
    } else {
      setError('Student not logged in');
    }
  }, []);

  const fetchMeetings = async (studentName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meetings?studentName=${studentName}`);
      const data = await response.json();

      if (response.ok) {
        setMeetings(data);  // Store the meetings data
      } else {
        setError('No meetings found for this student');
      }
    } catch (error) {
      setError('Error fetching meetings');
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Welcome, {studentName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display meetings in a table */}
      <h3>Scheduled Meetings</h3>
      {meetings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Meeting Date</th>
              <th>Meeting Time</th>
              <th>Description</th>
              <th>Teacher Name</th> {/* Added Teacher Name column */}
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting, index) => (
              <tr key={index}>
                <td>{meeting.studentName}</td>
                <td>{meeting.meetingDate}</td>
                <td>{meeting.meetingTime}</td>
                <td>{meeting.description}</td>
                <td>{meeting.teacherName}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No meetings scheduled</p>
      )}
    </div>
  );
};

export default StudentDashboard;
