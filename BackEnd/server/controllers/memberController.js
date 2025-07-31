 const Member = require('../models/memberModel');

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.getAllMembers();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const member = await Member.createMember(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create member' });
  }
};