const router = require('express').Router();

const auth = require('../controllers/authController');

router.post('/registrar', auth.registrar);
router.post('/login', auth.login);

module.exports = router;
