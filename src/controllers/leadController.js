const Lead = require('../models/Lead');

async function create(req, res) {
  const lead = await Lead.create({ ...req.body, source: req.body.source || 'website' });
  res.status(201).json({ message: 'Lead received successfully', lead });
}
async function list(req, res) {
  const filter = req.query.status ? { status: req.query.status } : {};
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const [items, total] = await Promise.all([
    Lead.find(filter).populate('unit', 'code title type status').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Lead.countDocuments(filter)
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
async function get(req, res) {
  const lead = await Lead.findById(req.params.id).populate('unit');
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json(lead);
}
async function update(req, res) {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('unit');
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json(lead);
}
async function remove(req, res) {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ message: 'Lead deleted' });
}
module.exports = { create, list, get, update, remove };
