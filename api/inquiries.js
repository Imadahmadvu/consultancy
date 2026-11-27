const connectDB = require('./_db');
const Inquiry = require('../backend/models/Inquiry');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();

    if (req.method === 'GET') {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.status(200).json({ count: inquiries.length, data: inquiries });
    }

    if (req.method === 'POST') {
      const { name, email, phone, topic, message } = req.body || {};
      if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: 'Please fill all required fields.' });
      }

      const inquiry = await Inquiry.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        topic: topic || 'General Consultancy',
        message: message.trim()
      });

      return res.status(201).json({
        message: 'Inquiry submitted successfully!',
        data: inquiry
      });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Inquiries API error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};