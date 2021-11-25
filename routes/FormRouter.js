const router = require('express').Router();
const formController = require('../controllers/FormController');

router.get('/viewRegistrator/:id', formController.viewRegistrator);
router.get('/profile/:id', formController.getUserById);
router.get('/activate/:id', formController.activateRegistrator);
router.get('/deactivate/:id', formController.deactivateRegistrator);
router.get('/created/:id', formController.deactivateCreation);
router.get('/updated/:id', formController.deactivateUpdate);
router.get('/allLogs', formController.getAllLogs);
router.get('/filteredLogs', formController.getFilteredLogs);
router.get('/new', formController.getFormsData);
router.get('/all', formController.getForms);
router.get('/filtered', formController.getFilteredForms);
router.get('/registrators', formController.getRegistrators);
router.get('/:id', formController.getFormById);
router.get('/:id/edit', formController.getEditFormById);
router.get('/', formController.getHomePage);
router.post('/', formController.addForm);
router.post('/:id/edit', formController.updateForm);
router.post('/:id/delete', formController.deleteForm);
router.post('/:id/update', formController.updateLogForm);

module.exports = router;