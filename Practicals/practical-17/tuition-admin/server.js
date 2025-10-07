const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection with more detailed error handling
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://meetkoriya:meetkoriya@lamacluster.smdospn.mongodb.net/tuitionDB?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Student schema and model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  class: String,
  email: String,
  phone: String
});

const Student = mongoose.model('Student', studentSchema);

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add new student
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(400).json({ error: 'Failed to add student', details: err.message });
  }
});

// Update student by id
app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update student' });
  }
});

// Delete student by id
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete student' });
  }
});

app.listen(PORT, () => {
  console.log(`Tuition Admin server running on http://localhost:${PORT}`);
});
