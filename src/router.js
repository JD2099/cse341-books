// src/router.js
import express from 'express';
import { getBookByIdHandler } from './controllers/books.js';

const router = express.Router();

router.get('/books/:id', getBookByIdHandler);

export default router;