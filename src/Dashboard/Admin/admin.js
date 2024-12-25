import React, { useState, useEffect } from 'react';
import './Admin.css'; // Assuming you have a CSS file for styling

const Admin = () => {
  const [view, setView] = useState('students');  // 'students' | 'teachers'
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    department: '',
    section: '',
    password: '',
  });
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    department: '',
    role: '',
    password: '',
  });

  const [editStudent, setEditStudent] = useState(null);
  const [editTeacher, setEditTeacher] = useState(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    const response = await fetch('http://localhost:5000/api/students');
    const data = await response.json();
    setStudents(data);
  };

  const fetchTeachers = async () => {
    const response = await fetch('http://localhost:5000/api/teachers');
    const data = await response.json();
    setTeachers(data);
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });
    const data = await response.json();
    setStudents([...students, data]);
    setNewStudent({ name: '', rollNo: '', department: '', section: '', password: '' });
    setShowAddStudentForm(false);
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTeacher),
    });
    const data = await response.json();
    setTeachers([...teachers, data]);
    setNewTeacher({ name: '', department: '', role: '', password: '' });
    setShowAddTeacherForm(false);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/students/${editStudent._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editStudent),
    });
    const data = await response.json();
    setStudents(students.map((student) => (student._id === data._id ? data : student)));
    setEditStudent(null);
    setView('students');
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/teachers/${editTeacher._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editTeacher),
    });
    const data = await response.json();
    setTeachers(teachers.map((teacher) => (teacher._id === data._id ? data : teacher)));
    setEditTeacher(null);
    setView('teachers');
  };

  const handleDeleteStudent = async (id) => {
    const response = await fetch(`http://localhost:5000/api/students/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setStudents(students.filter((student) => student._id !== id));
    }
  };

  const handleDeleteTeacher = async (id) => {
    const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setTeachers(teachers.filter((teacher) => teacher._id !== id));
    }
  };

  const closePopup = () => {
    setShowAddStudentForm(false);
    setShowAddTeacherForm(false);
    setEditStudent(null);
    setEditTeacher(null);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-controls">
        <button onClick={() => setView('students')}>Manage Students</button>
        <button onClick={() => setView('teachers')}>Manage Teachers</button>
      </div>

      {view === 'students' && (
        <div className="data-section">
          <h2>Students</h2>
          <button onClick={() => setShowAddStudentForm(true)}>Add New Student</button>
          {showAddStudentForm && (
            <div className="popup-form">
              <h3>Add New Student</h3>
              <form onSubmit={handleCreateStudent}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Roll No"
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Section"
                  value={newStudent.section}
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  required
                />
                <div className="form-buttons">
                  <button type="submit">Add Student</button>
                  <button type="button" className="close-btn" onClick={closePopup}>Close</button>
                </div>
              </form>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Section</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.department}</td>
                  <td>{student.section}</td>
                  <td>{student.password}</td>
                  <td>
                    <button onClick={() => setEditStudent(student)}>Edit</button>
                    <button onClick={() => handleDeleteStudent(student._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'teachers' && (
        <div className="data-section">
          <h2>Teachers</h2>
          <button onClick={() => setShowAddTeacherForm(true)}>Add New Teacher</button>
          {showAddTeacherForm && (
            <div className="popup-form">
              <h3>Add New Teacher</h3>
              <form onSubmit={handleCreateTeacher}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={newTeacher.department}
                  onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newTeacher.role}
                  onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                  required
                />
                <div className="form-buttons">
                  <button type="submit">Add Teacher</button>
                  <button type="button" className="close-btn" onClick={closePopup}>Close</button>
                </div>
              </form>
            </div>
          )}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.role}</td>
                  <td>{teacher.password}</td>
                  <td>
                    <button onClick={() => setEditTeacher(teacher)}>Edit</button>
                    <button onClick={() => handleDeleteTeacher(teacher._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editStudent && (
        <div className="popup-form">
          <h3>Edit Student</h3>
          <form onSubmit={handleUpdateStudent}>
            <input
              type="text"
              placeholder="Name"
              value={editStudent.name}
              onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Roll No"
              value={editStudent.rollNo}
              onChange={(e) => setEditStudent({ ...editStudent, rollNo: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={editStudent.department}
              onChange={(e) => setEditStudent({ ...editStudent, department: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Section"
              value={editStudent.section}
              onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={editStudent.password}
              onChange={(e) => setEditStudent({ ...editStudent, password: e.target.value })}
              required
            />
            <div className="form-buttons">
              <button type="submit">Update Student</button>
              <button type="button" className="close-btn" onClick={closePopup}>Close</button>
            </div>
          </form>
        </div>
      )}

      {editTeacher && (
        <div className="popup-form">
          <h3>Edit Teacher</h3>
          <form onSubmit={handleUpdateTeacher}>
            <input
              type="text"
              placeholder="Name"
              value={editTeacher.name}
              onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={editTeacher.department}
              onChange={(e) => setEditTeacher({ ...editTeacher, department: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={editTeacher.role}
              onChange={(e) => setEditTeacher({ ...editTeacher, role: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={editTeacher.password}
              onChange={(e) => setEditTeacher({ ...editTeacher, password: e.target.value })}
              required
            />
            <div className="form-buttons">
              <button type="submit">Update Teacher</button>
              <button type="button" className="close-btn" onClick={closePopup}>Close</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
