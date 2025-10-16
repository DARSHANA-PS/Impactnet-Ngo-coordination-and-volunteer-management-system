const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/ngoController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
