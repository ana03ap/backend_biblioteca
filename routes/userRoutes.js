const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const userController = require('../controllers/userController');

// @route   GET api/users/me
// @desc    Obtener perfil de usuario actual
// @access  Private
router.get('/me', auth, userController.getProfile);

// @route   PUT api/users/:id
// @desc    Actualizar usuario
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Name is required').optional().not().isEmpty(),
      check('email', 'Please include a valid email').optional().isEmail()
    ]
  ],
  userController.updateUser
);

// @route   DELETE api/users/:id
// @desc    Desactivar usuario
// @access  Private
router.delete('/:id', auth, userController.deactivateUser);

module.exports = router;