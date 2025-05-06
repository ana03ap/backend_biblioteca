const User = require('../models/User');
const { generateToken } = require('../config/auth');
const { validationResult } = require('express-validator');

// Obtener perfil de usuario actual
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email } = req.body;
  const userFields = {};

  if (name) userFields.name = name;
  if (email) userFields.email = email;

  try {
    let user = await User.findById(req.params.id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verificar que el usuario es dueño del perfil o tiene permisos
    if (user._id.toString() !== req.user.id && !req.user.permissions.updateUsers) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Desactivar usuario (soft delete)
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verificar que el usuario es dueño del perfil o tiene permisos
    if (user._id.toString() !== req.user.id && !req.user.permissions.deleteUsers) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ msg: 'User deactivated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};