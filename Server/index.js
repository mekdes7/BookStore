import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Books } from './Models/bookModels.js';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve static files

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
// 1. First, modify your POST endpoint to store correct paths
app.post('/books', upload.single('bookCover'), async (req, res) => {
    try {
      // Debug the received file
      console.log('Received file:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path
      });
  
      const newBook = {
        title: req.body.title,
        author: req.body.author,
        publishYear: req.body.publishYear,
        bookCover: `/uploads/${req.file.filename}` // Standardized path format
      };
  
      const book = await Books.create(newBook);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // 2. Update GET endpoints to return full URLs
  app.get('/books', async (req, res) => {
    try {
      const books = await Books.find({});
      
      const booksWithFullUrls = books.map(book => ({
        ...book.toObject(),
        bookCover: book.bookCover 
          ? `${req.protocol}://${req.get('host')}${book.bookCover}`
          : null
      }));
  
      res.status(200).json({
        count: booksWithFullUrls.length,
        data: booksWithFullUrls
      });
      
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  
  app.get('/books/:id', async (req, res) => {
    try {
      const book = await Books.findById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
  
      const bookWithFullUrl = {
        ...book.toObject(),
        bookCover: book.bookCover 
          ? `${req.protocol}://${req.get('host')}${book.bookCover}`
          : null
      };
  
      res.status(200).json(bookWithFullUrl);
      
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  app.put('/books/:id', upload.single('bookCover'), async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, publishYear } = req.body; // Don't extract bookCover from body
  
      if (!title || !author || !publishYear) {
        return res.status(400).send({ 
          message: 'Send all required fields: title, author, publishYear' 
        });
      }
  
      const existingBook = await Books.findById(id);
      if (!existingBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const updateData = {
        title,
        author,
        publishYear,
        bookCover: existingBook.bookCover, // Default to old image if none uploaded
      };
  
      if (req.file) {
        updateData.bookCover = `/uploads/${req.file.filename}`; // Update image if new file is uploaded
      }
  
      const result = await Books.findByIdAndUpdate(id, updateData, { new: true });
  
      return res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  });
  
  app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Books.findById(id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Extract image path
        if (book.bookCover) {
            const imagePath = path.join(path.resolve(), book.bookCover);
            
            // Check if the file exists before trying to delete it
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the image file
                console.log('Image deleted:', imagePath);
            }
        }

        // Delete the book from the database
        await Books.findByIdAndDelete(id);

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});
const PORT = process.env.PORT || 3000
const MONGOURL = process.env.MONGOURL

mongoose.connect(MONGOURL)
    .then(() => {
        console.log('App is connected to the database')
        app.listen(PORT, () => {
            console.log(`server is running in port:${PORT} `)
        })
    })
    .catch((err) => {
        console.log(err)
    })