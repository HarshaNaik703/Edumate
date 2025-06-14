const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// MongoDB connection
mongoose.connect('mongodb://localhost/edumate', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    phone: { type: String, unique: true, required: true },
    name: String,
    password: String,
    usn: String,
    class: String,
    branch: String,
    role: { type: String, enum: ['student', 'teacher'] }
});
const User = mongoose.model('User', userSchema);

// Material Schema
const materialSchema = new mongoose.Schema({
    title: String,
    type: { type: String, enum: ['notes', 'question_paper', 'study_material'] },
    filePath: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ userId: String, review: String, rating: Number }]
});
const Material = mongoose.model('Material', materialSchema);

// File upload setup
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware to verify user
const verifyUser = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'Invalid user' });
    next();
};

// Routes
// Signup
app.post('/signup', async (req, res) => {
    const { phone, name, password, usn, class: className, branch, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ phone, name, password: hashedPassword, usn, class: className, branch, role });
        await user.save();
        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
        res.status(400).json({ error: 'Phone number already exists' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { phone, password, role } = req.body;
    const user = await User.findOne({ phone, role });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
    res.json({ message: 'Login successful', userId: user._id });
});

// Upload material
app.post('/upload', verifyUser, upload.single('file'), async (req, res) => {
    const { title, type, userId } = req.body;
    const material = new Material({
        title,
        type,
        filePath: req.file.path,
        uploadedBy: userId
    });
    await material.save();
    res.json({ message: 'File uploaded' });
});

// Get materials
app.get('/materials', async (req, res) => {
    const materials = await Material.find().populate('uploadedBy', 'name');
    res.json(materials);
});

// Add review
app.post('/materials/:id/review', verifyUser, async (req, res) => {
    const { userId, review, rating } = req.body;
    const material = await Material.findById(req.params.id);
    material.reviews.push({ userId, review, rating });
    await material.save();
    res.json({ message: 'Review added' });
});

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
