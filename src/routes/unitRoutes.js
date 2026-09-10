const router = require('express').Router();
const c = require('../controllers/unitController');
const { protect } = require('../middleware/auth');
router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', protect, c.create);
router.patch('/:id', protect, c.update);
router.delete('/:id', protect, c.remove);
module.exports = router;
