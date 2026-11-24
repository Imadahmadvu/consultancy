const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, country, studyInterest } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Full name, email, phone, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'Is email se account pehle se maujood hai.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      country: country || '',
      studyInterest: studyInterest || ''
    });

    res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        country: newUser.country,
        studyInterest: newUser.studyInterest
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        studyInterest: user.studyInterest
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

module.exports = router;
