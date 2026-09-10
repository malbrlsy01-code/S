const router = require('express').Router();
const c = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
router.post('/', c.create);
router.get('/', protect, c.list);
router.get('/:id', protect, c.get);
router.patch('/:id', protect, c.update);
router.delete('/:id', protect, c.remove);
module.exports = router;
