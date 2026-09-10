const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  type: { type: String, enum: ['Commercial', 'Residential', 'Hotel'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  floor: { type: String, default: '' },
  area: { type: Number, min: 0 },
  price: { type: Number, min: 0 },
  status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
  view: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);
