// src/controllers/books.js
/*
import { getAllBooks, getBookById } from '../models/books.js';

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export { getBooksHandler, getBookByIdHandler };

*/

import {
  getAllBooks as getAllBooksFromDb,
  getBookById as getBookByIdFromDb,
  createBook as createBookFromDb,
  updateBook as updateBookFromDb,
  deleteBook as deleteBookFromDb,
  authorExists,
} from '../models/books.js';

const getAllBooks = async (req, res) => {
  try {
    const books = await getAllBooksFromDb();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books.' });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookByIdFromDb(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book.' });
  }
};

const createBook = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdFromDb(id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists.' });
    }

    if (!(await authorExists(authorId))) {
      return res.status(400).json({ message: 'Author not found.' });
    }

    const createdBook = await createBookFromDb({
      id,
      authorId,
      title,
      publicationDate,
    });

    return res.status(201).json(createdBook);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create book.' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body;

    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdFromDb(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (!(await authorExists(authorId))) {
      return res.status(400).json({ message: 'Author not found.' });
    }

    const updatedBook = await updateBookFromDb(id, {
      authorId,
      title,
      publicationDate,
    });

    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update book.' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await getBookByIdFromDb(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    await deleteBookFromDb(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete book.' });
  }
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};