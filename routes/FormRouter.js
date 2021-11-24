const router = require('express').Router();
const formController = require('../controllers/FormController');

router.get('/viewRegistrator/:id', formController.viewRegistrator);
router.get('/profile/:id', formController.getUserById);
router.get('/activate/:id', formController.activateRegistrator);
router.get('/deactivate/:id', formController.deactivateRegistrator);
router.get('/new', formController.getFormsData);
router.get('/all', formController.getForms);
router.get('/filtered', formController.getFilteredForms);
router.get('/registrators', formController.getRegistrators);
router.get('/:id', formController.getFormById);
router.get('/:id/edit', formController.getEditFormById);
router.get('/', formController.getHomePage);
router.post('/', formController.addForm);
router.post('/:id/edit', formController.updateForm);

module.exports = router;