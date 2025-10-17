import pool from '../db.js';
import cloudinary from '../utils/cloudinary.js';
import { notifyReaders, io } from '../../Server.js';
const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });

export const addBook = async (req, res) => {
  try {
    console.log("Incoming form data:", req.body);
console.log("Incoming files:", req.files);
    const { title, published_year, category, description } = req.body;
    const coverFile = req.files?.cover?.[0];
    const bookFile = req.files?.file?.[0];

    if (!coverFile || !bookFile) {
      return res.status(400).json({ message: "Cover and PDF file are required" });
    }

    const uploadedCover = await uploadBuffer(coverFile.buffer, {
      folder: "books/covers",
    });

    const uploadedFile = await uploadBuffer(bookFile.buffer, {
      folder: "books/files",
      resource_type: "raw",
      format: "pdf",
      use_filename: true,
      unique_filename: false,
    });

    const bookCoverUrl = uploadedCover.secure_url;
    const bookFileUrl = uploadedFile.secure_url;

    const result = await pool.query(
      `INSERT INTO books (title, published_year, category, description, book_cover, book_file, author_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        published_year,
        category,
        description,
        bookCoverUrl,
        bookFileUrl,
        req.user.id,
      ]
    );

    const book = result.rows[0];

    const readerRes = await pool.query(
      `SELECT id FROM users WHERE role = 'reader'`
    );

    for (const reader of readerRes.rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, message, is_read, created_at)
         VALUES ($1, $2, false, NOW())`,
        [
          reader.id,
          `A new book "${book.title}" was added in category "${book.category}".`,
        ]
      );
    }


    notifyReaders({
      id: book.id,
      title: book.title,
      category: book.category,
      author_name: `${req.user.firstname} ${req.user.lastname}`,
      book_cover: book.book_cover,
      book_file: book.book_file,
      published_year: book.published_year,
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error("Add book error:", error);
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

export const createNotificationsForAllReaders = async (book, authorName, category) => {
  try {

    const readersResult = await pool.query(
      `SELECT id FROM users 
       WHERE role = 'reader' 
       AND favorite_category = $1`,
      [category]
    );

    const readers = readersResult.rows;

    if (readers.length === 0) {
      console.log(`No readers found for category: ${category}`);
      return;
    }

    console.log(`Creating notifications for ${readers.length} readers in category: ${category}`);

    for (const reader of readers) {
      await pool.query(
        `INSERT INTO notifications (reader_id, book_id, message)
         VALUES ($1, $2, $3)`,
        [reader.id, book.id, `New book "${book.title}" by ${authorName} in your favorite category ${category}`]
      );
    }

    console.log(` Created ${readers.length} notifications for book: ${book.title}`);
  } catch (error) {
    console.error('Error creating notifications:', error);
    
  }
};

export const getMyBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching books for user ID:", userId);

    const { rows } = await pool.query(
      `SELECT
         b.id,
         b.title,
         b.category,
         b.description,
         b.book_cover AS "coverUrl",
         b.book_file AS "book_file",
         b.published_year,
         b.created_at,
         b.author_id,
         u.first_name,
         u.last_name
       FROM books b
       JOIN users u ON b.author_id = u.id
       WHERE b.author_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    const books = rows.map(b => ({
      id: b.id,
      title: b.title,
      category: b.category,
      description: b.description,
      coverUrl: b.coverUrl,       
      book_file: b.book_file,     
      publishedYear: b.published_year,
      author_name: `${b.first_name} ${b.last_name}`
    }));

    res.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id;

    const { rowCount } = await pool.query(
      "DELETE FROM books WHERE id = $1 AND author_id = $2",
      [bookId, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Book not found or not yours" });
    }

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    console.error("DELETE BOOK ERROR:", err);
    res.status(500).json({ message: "Failed to delete book" });
  }
};

export const getReaderNotifications = async (req, res) => {
  try {
    const readerId = req.user.id;

    const { rows } = await pool.query(
      `SELECT 
        n.id,
        n.message,
        n.is_read,
        n.created_at,
        
        b.title,
        b.category,
        b.book_cover,
        b.book_file,
        u.first_name as author_firstname,
        u.last_name as author_lastname
       FROM notifications n
       JOIN books b ON n.book_id = b.id
       JOIN users u ON b.author_id = u.id
       WHERE n.role = 'reader'
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [readerId]
    );

    res.json({
      success: true,
      notifications: rows,
      unreadCount: rows.filter(n => !n.is_read).length
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const readerId = req.user.id;
    const notificationId = req.params.id;

    const { rowCount } = await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND reader_id = $2`,
      [notificationId, readerId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Error updating notification" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const readerId = req.user.id;

    await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE reader_id = $1 AND is_read = false`,
      [readerId]
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ success: false, message: "Error updating notifications" });
  }
};