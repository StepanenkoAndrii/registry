const router = require('express').Router();
const formController = require('../controllers/FormController');

router.get('/new', formController.getFormsData);
router.get('/all', formController.getForms);
router.get('/filtered', formController.getFilteredForms);
router.get('/:id', formController.getFormById);
router.get('/', formController.getHomePage);
router.post('/', formController.addForm);

module.exports = router;