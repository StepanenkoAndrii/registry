const router = require('express').Router();
const formController = require('../controllers/FormController');

// router.get('/admin', (req, res) => {res.render('adminPage')});
router.get('/registeredUser', formController.getUserById);
router.get('/new', formController.getFormsData);
router.get('/all', formController.getForms);
router.get('/filtered', formController.getFilteredForms);
router.get('/:id', formController.getFormById);
router.get('/:id/edit', formController.getEditFormById);
router.get('/', formController.getHomePage);
router.post('/', formController.addForm);
router.post('/:id/edit', formController.updateForm);

module.exports = router;