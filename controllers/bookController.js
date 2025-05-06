const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const { validationResult } = require('express-validator');

// Crear libro
exports.createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, publisher, genre, publicationDate } = req.body;

  try {
    const book = new Book({ title, author, publisher, genre, publicationDate });
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Obtener todos los libros con filtros
exports.getBooks = async (req, res) => {
  try {
    const { genre, author, publisher, title, isAvailable } = req.query;
    const filter = { isActive: true };
    
    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    if (publisher) filter.publisher = publisher;
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (isAvailable !== undefined) filter.isAvailable = isAvailable;

    const books = await Book.find(filter);
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Obtener un libro por ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, isActive: true });
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Actualizar libro
exports.updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, publisher, genre, publicationDate, isAvailable } = req.body;
  const bookFields = {};

  if (title) bookFields.title = title;
  if (author) bookFields.author = author;
  if (publisher) bookFields.publisher = publisher;
  if (genre) bookFields.genre = genre;
  if (publicationDate) bookFields.publicationDate = publicationDate;
  if (isAvailable !== undefined) bookFields.isAvailable = isAvailable;

  try {
    let book = await Book.findById(req.params.id);
    if (!book || !book.isActive) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: bookFields },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Eliminar libro (soft delete)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.isActive) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    await Book.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};