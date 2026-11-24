const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, topic, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'Please fill all required fields.' });
        }

        const savedInquiry = await Inquiry.create({
            name,
            email,
            phone,
            topic,
            message
        });

        res.status(201).json({
            message: 'Inquiry submitted successfully!',
            data: savedInquiry
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;