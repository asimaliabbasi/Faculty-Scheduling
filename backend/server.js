const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection details
const url = 'mongodb+srv://asimali12932:revldlucky@cluster0.82ei4.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'sad';

let db, adminCollection, studentsCollection, teachersCollection, meetingsCollection; // Add meetingsCollection here

// MongoDB connection
MongoClient.connect(url)
    .then(client => {
        db = client.db(dbName);
        adminCollection = db.collection('new');
        studentsCollection = db.collection('students');
        teachersCollection = db.collection('teachers');
        meetingsCollection = db.collection('meetings');  // Add this line to define meetingsCollection
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


// Admin login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await adminCollection.findOne({ username });
        if (!admin || admin.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, username: admin.username }, 'secretkey', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// CRUD Operations for Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await studentsCollection.find().toArray();
        res.status(200).json(students);
    } catch (err) {
        console.error('Fetch students error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const student = req.body;
        const result = await studentsCollection.insertOne(student);
        res.status(201).json({ ...student, _id: result.insertedId });
    } catch (err) {
        console.error('Add student error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    // Remove _id field to prevent MongoDB immutable field error
    delete updatedData._id;

    try {
        const result = await studentsCollection.updateOne(
            { _id: new ObjectId(id) }, 
            { $set: updatedData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error('Update student error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await studentsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Delete student error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// CRUD Operations for Teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await teachersCollection.find().toArray();
        res.status(200).json(teachers);
    } catch (err) {
        console.error('Fetch teachers error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/teachers', async (req, res) => {
    try {
        const teacher = req.body;
        const result = await teachersCollection.insertOne(teacher);
        res.status(201).json({ ...teacher, _id: result.insertedId });
    } catch (err) {
        console.error('Add teacher error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/teachers/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    // Remove _id field to prevent MongoDB immutable field error
    delete updatedData._id;

    try {
        const result = await teachersCollection.updateOne(
            { _id: new ObjectId(id) }, 
            { $set: updatedData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json({ message: 'Teacher updated successfully' });
    } catch (err) {
        console.error('Update teacher error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/teachers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await teachersCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        console.error('Delete teacher error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Student login route
app.post('/api/students/login', async (req, res) => {
    const { rollNo, password } = req.body;

    try {
        // Find the student by roll number
        const student = await studentsCollection.findOne({ rollNo });
        if (!student) {
            return res.status(400).json({ message: 'Student not found' });
        }

        // Check if the password matches
        if (student.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Send response with student name and success message
        res.status(200).json({ message: 'Login successful', name: student.name });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Teacher login route
app.post('/api/teachers/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Find the teacher by name
        const teacher = await teachersCollection.findOne({ name });
        if (!teacher) {
            return res.status(400).json({ message: 'Teacher not found' });
        }

        // Check if the password matches
        if (teacher.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Send response with teacher name and success message
        res.status(200).json({ message: 'Login successful', name: teacher.name });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to schedule a meeting
app.post('/api/meetings', async (req, res) => {
    const { studentName, studentRollNo, meetingDate, meetingTime, description, teacherName } = req.body;

    try {
        // Insert the meeting data into the 'meetings' collection
        const newMeeting = {
            studentName,
            studentRollNo,  // Using studentRollNo instead of studentEmail
            meetingDate,
            meetingTime,
            description,
            teacherName,  // Added teacherName to the meeting data
            scheduledAt: new Date(), // Optional: to track when the meeting is scheduled
        };

        const result = await meetingsCollection.insertOne(newMeeting);

        if (result.acknowledged) {
            res.status(201).json({ message: 'Meeting scheduled successfully!' });
        } else {
            res.status(400).json({ message: 'Failed to schedule meeting.' });
        }
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ message: 'An error occurred while scheduling the meeting.' });
    }
});


app.post('/api/students/login', async (req, res) => {
    const { rollNo, password } = req.body;
  
    try {
      // Query the database for the student with the given rollNo and password
      const student = await Student.findOne({ rollNo, password });
  
      if (student) {
        // Return the student details (excluding password)
        res.status(200).json({ name: student.name });
      } else {
        res.status(400).json({ message: 'Invalid roll number or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error connecting to the database' });
    }
  });
  


app.get('/api/meetings', async (req, res) => {
    const { studentName } = req.query;
    try {
        const query = studentName ? { studentName } : {};
        const meetings = await meetingsCollection.find(query).toArray();
        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Error fetching meetings' });
    }
});

app.get('/api/meetings', async (req, res) => {
    const { studentName } = req.query;
    if (!studentName) {
        return res.status(400).json({ message: 'Student name is required' });
    }

    try {
        const meetings = await meetingsCollection.find({ studentName }).toArray();
        if (meetings.length > 0) {
            res.status(200).json(meetings);
        } else {
            res.status(404).json({ message: 'No meetings found' });
        }
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Error fetching meetings' });
    }
});

  
  
  

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
