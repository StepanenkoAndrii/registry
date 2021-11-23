const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController');

router.get('/users', userController.getPersons);

module.exports = router;