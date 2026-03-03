const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const authOwner = require('../middleware/authOwnerOrAdmin.middleware');
const controller = require('../controllers/employee.controller');

router.get('/me', auth, controller.getProfile);
router.get('/', auth, role('ADMIN'), controller.getAllEmployees);
router.get('/:id', auth, authOwner, controller.getEmployeeById);
router.put('/:id', auth, authOwner, controller.updateUser);
router.delete('/:id', auth, authOwner, controller.deleteUser);

module.exports = router;