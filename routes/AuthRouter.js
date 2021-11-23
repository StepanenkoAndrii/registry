const router = require('express').Router();
const regRouter = require('./RegRouter');
const logRouter = require('./LogRouter');

router.use('/registration', regRouter);
router.use('/login', logRouter);

module.exports = router;