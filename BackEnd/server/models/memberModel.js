const db = require('../config/db');

exports.getAllMembers = async () => {
  const [rows] = await db.query('SELECT * FROM members');
  return rows;
};

exports.createMember = async (data) => {
  const { name, email } = data;
  const [result] = await db.query(
    'INSERT INTO members (name, email, is_active) VALUES (?, ?, ?)',
    [name, email, true]
  );
  return { id: result.insertId, ...data, is_active: true };
}; 