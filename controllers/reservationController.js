const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// Crear nueva reserva
exports.createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bookId, returnDate } = req.body;

  try {
    const book = await Book.findById(bookId);
    
    if (!book || !book.isActive) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ msg: 'Book is not available' });
    }

    const reservation = new Reservation({
      user: req.user.id,
      book: bookId,
      returnDate
    });

    await reservation.save();
    
    // Marcar libro como no disponible
    book.isAvailable = false;
    await book.save();

    res.status(201).json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Obtener reservas del usuario actual
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('book', 'title author')
      .sort({ reservationDate: -1 });

    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Obtener historial de reservas de un libro (para administradores)
exports.getBookReservationHistory = async (req, res) => {
  try {
    const reservations = await Reservation.find({ book: req.params.bookId })
      .populate('user', 'name email')
      .sort({ reservationDate: -1 });

    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Devolver un libro (terminar reserva)
exports.returnBook = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Verificar que el usuario es dueño de la reserva o tiene permisos
    if (reservation.user.toString() !== req.user.id && !req.user.permissions.updateBooks) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    reservation.status = 'returned';
    reservation.returnDate = Date.now();
    await reservation.save();

    // Marcar libro como disponible
    const book = await Book.findById(reservation.book);
    book.isAvailable = true;
    await book.save();

    res.json({ msg: 'Book returned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};