const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');
require('../src/config/env');

(async () => {
  try {
    await connectDB();
    const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first');

    // Keep one admin account in sync with .env. This also hashes a new password
    // through the Admin model's pre-save hook.
    let admin = await Admin.findOne({ email }).select('+password');
    if (!admin) admin = await Admin.findOne().select('+password');

    if (admin) {
      admin.email = email;
      admin.password = password;
      await admin.save();
      console.log('Admin updated:', admin.email);
    } else {
      admin = await Admin.create({ email, password });
      console.log('Admin created:', admin.email);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
