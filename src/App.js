import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AdminLogin from './Logins/AdminLogin';
import StudentLogin from './Logins/StudentLogin';
import TeacherLogin from './Logins/TeacherLogin';
import Admin from './Dashboard/Admin/admin';
import StudentDashboard from './Dashboard/Student/student';
import TeacherDashboard from './Dashboard/Teacher/teacher';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
