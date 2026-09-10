const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  email: { type: String, trim: true, lowercase: true, maxlength: 150 },
  unitType: { type: String, enum: ['Commercial', 'Residential', 'Hotel', ''], default: '' },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
  message: { type: String, default: '', maxlength: 2000 },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'closed'], default: 'new' },
  source: { type: String, default: 'website' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
