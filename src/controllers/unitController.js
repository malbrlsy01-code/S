const Unit = require('../models/Unit');

async function list(req, res) {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  res.json(await Unit.find(filter).sort({ createdAt: -1 }));
}
async function get(req, res) {
  const unit = await Unit.findById(req.params.id);
  if (!unit) return res.status(404).json({ message: 'Unit not found' });
  res.json(unit);
}
async function create(req, res) { res.status(201).json(await Unit.create(req.body)); }
async function update(req, res) {
  const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!unit) return res.status(404).json({ message: 'Unit not found' });
  res.json(unit);
}
async function remove(req, res) {
  const unit = await Unit.findByIdAndDelete(req.params.id);
  if (!unit) return res.status(404).json({ message: 'Unit not found' });
  res.json({ message: 'Unit deleted' });
}
module.exports = { list, get, create, update, remove };
