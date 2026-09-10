const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

function signToken(admin) {
  return jwt.sign({ sub: admin._id.toString(), role: admin.role }, jwtSecret, { expiresIn: jwtExpiresIn });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: signToken(admin), admin: { id: admin._id, email: admin.email, role: admin.role } });
}

async function me(req, res) { res.json({ admin: req.admin }); }
module.exports = { login, me };
