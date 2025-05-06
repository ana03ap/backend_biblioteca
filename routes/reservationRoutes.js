const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const reservationController = require('../controllers/reservationController');

// @route   POST api/reservations
// @desc    Crear nueva reserva
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('bookId', 'Book ID is required').not().isEmpty(),
      check('returnDate', 'Return date is required').isISO8601()
    ]
  ],
  reservationController.createReservation
);

// @route   GET api/reservations/me
// @desc    Obtener reservas del usuario actual
// @access  Private
router.get('/me', auth, reservationController.getUserReservations);

// @route   GET api/reservations/book/:bookId
// @desc    Obtener historial de reservas de un libro
// @access  Private (Admin)
router.get('/book/:bookId', auth, reservationController.getBookReservationHistory);

// @route   PUT api/reservations/:id/return
// @desc    Devolver un libro
// @access  Private
router.put('/:id/return', auth, reservationController.returnBook);

module.exports = router;