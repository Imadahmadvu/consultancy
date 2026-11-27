const bcrypt = require('bcryptjs');
const connectDB = require('../_db');
const User = require('../../backend/models/User');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    await connectDB();
    const { fullName, email, phone, password, country, studyInterest } = req.body || {};

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Full name, email, phone, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Is email se account pehle se maujood hai.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      country: country || '',
      studyInterest: studyInterest || ''
    });

    return res.status(201).json({
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
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};