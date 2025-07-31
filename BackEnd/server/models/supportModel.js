const db = require('../config/db');

exports.getSupportInfo = async () => {
  const [rows] = await db.query('SELECT * FROM support_info');
  return rows[0] || {};
};

exports.createSupportMessage = async (data) => {
  const { name, email, message } = data;
  const [result] = await db.query(
    'INSERT INTO support_messages (name, email, message, created_at) VALUES (?, ?, ?, NOW())',
    [name, email, message]
  );
  return { id: result.insertId, ...data, created_at: new Date() };
}; 