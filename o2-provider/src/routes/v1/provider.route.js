const express = require('express');
const validate = require('../../middlewares/validate');
const providerValidation = require('../../validations/provider.validation');
const providerController = require('../../controllers/provider.controller');

const router = express.Router();

router.route('/register').post(validate(providerValidation.registerProvider), providerController.registerProvider);

// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
