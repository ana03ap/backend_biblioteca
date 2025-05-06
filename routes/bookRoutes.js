const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const { canCreateBooks, canUpdateBooks, canDeleteBooks } = require('../middleware/permissions');
const bookController = require('../controllers/bookController');

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', bookController.getBooks);

// @route   GET api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', bookController.getBookById);

// @route   POST api/books
// @desc    Create a book
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    canCreateBooks,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('author', 'Author is required').not().isEmpty(),
      check('genre', 'Genre is required').not().isEmpty(),
      check('publisher', 'Publisher is required').not().isEmpty(),
      check('publicationDate', 'Publication date is required').isISO8601()
    ]
  ],
  bookController.createBook
);

// @route   PUT api/books/:id
// @desc    Update book
// @access  Private (Admin)
router.put(
  '/:id',
  [
    auth,
    canUpdateBooks,
    [
      check('title', 'Title is required').optional().not().isEmpty(),
      check('author', 'Author is required').optional().not().isEmpty(),
      check('genre', 'Genre is required').optional().not().isEmpty(),
      check('publisher', 'Publisher is required').optional().not().isEmpty(),
      check('publicationDate', 'Publication date is required').optional().isISO8601()
    ]
  ],
  bookController.updateBook
);

// @route   DELETE api/books/:id
// @desc    Delete book
// @access  Private (Admin)
router.delete('/:id', [auth, canDeleteBooks], bookController.deleteBook);

module.exports = router;