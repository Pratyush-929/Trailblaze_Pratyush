const Support = require('../models/supportModel');

exports.getSupportInfo = async (req, res) => {
  try {
    const info = await Support.getSupportInfo();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch support info' });
  }
};

exports.createSupportMessage = async (req, res) => {
  try {
    const message = await Support.createSupportMessage(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}; 