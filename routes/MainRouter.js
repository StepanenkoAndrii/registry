const router = require('express').Router();
// const userRouter = require('./UserRouter');
const formRouter = require('./FormRouter');
const authRouter = require('./AuthRouter');

// router.use('/users', userRouter);

// router.get('/', (req, res) => {res.render('home')});
router.use('/auth', authRouter);
router.use('/forms', formRouter);
router.use('/', formRouter);

module.exports = router;