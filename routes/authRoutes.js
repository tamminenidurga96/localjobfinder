const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ✅ REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Login request:", email, password); // <-- Add this line
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // <-- Add this line
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // create token
    const token = jwt.sign({ id: user._id, role: user.role }, 'secret123', { expiresIn: '1d' });
    res.json({ message: 'Login successful!', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

module.exports = router;
