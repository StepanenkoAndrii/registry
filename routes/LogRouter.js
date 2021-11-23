const router = require('express').Router();
const authController = require('../controllers/AuthController');

router.get('/', (req, res) => res.render('login'));
router.post('/data', authController.getLoginData);
router.get('/logout', authController.logout);

module.exports = router;