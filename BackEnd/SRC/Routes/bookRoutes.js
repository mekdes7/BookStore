import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js'; 
import { addBook, getMyBooks, deleteBook, getReaderNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../controllers/bookController.js';
import pool from '../db.js';

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),
  authenticate, 
  addBook
);

router.get('/my-books', authenticate, getMyBooks);
router.delete('/:id', authenticate, deleteBook);

router.get('/test', (req, res) => {
  res.json({ message: 'Books API is working!', timestamp: new Date().toISOString() });
});


router.get("/recommended", authenticate, async (req, res) => {
  try {
    const { categories } = req.query;
    if (!categories) {
      return res.status(400).json({ success: false, message: "No categories provided" });
    }

    const result = await pool.query(
      `SELECT b.id, b.title, b.published_year, b.book_cover, b.book_file, b.category,
              u.first_name AS author_firstname, u.last_name AS author_lastname
       FROM books b
       JOIN users u ON b.author_id = u.id
       WHERE b.category = $1`,
      [categories]
    );

    res.json({ success: true, books: result.rows });
  } catch (err) {
    console.error("Error fetching recommended books:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.get("/reader-books", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.title, b.book_cover, b.book_file, b.published_year, b.category,
              u.first_name || ' ' || u.last_name as author_name
       FROM reader_books rb
       JOIN books b ON rb.book_id = b.id
       JOIN users u ON b.author_id = u.id
       WHERE rb.user_id = $1`,
      [req.user.id]
    );

    res.json({ success: true, books: result.rows });
  } catch (err) {
    console.error("Error fetching reader books:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/love", authenticate, async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  try {
  
    const existing = await pool.query(
      `SELECT * FROM loved_books WHERE user_id = $1 AND book_id = $2`,
      [userId, bookId]
    );

    if (existing.rows.length > 0) {
     
      await pool.query(
        `DELETE FROM loved_books WHERE user_id = $1 AND book_id = $2`,
        [userId, bookId]
      );
      return res.json({ success: true, loved: false });
    } else {
     
      await pool.query(
        `INSERT INTO loved_books (user_id, book_id) VALUES ($1, $2)`,
        [userId, bookId]
      );
      return res.json({ success: true, loved: true });
    }
  } catch (err) {
    console.error("Error toggling loved book:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/loved", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.title, b.book_cover, b.book_file, b.published_year, b.category,
              u.first_name || ' ' || u.last_name as author_name
       FROM loved_books lb
       JOIN books b ON lb.book_id = b.id
       JOIN users u ON b.author_id = u.id
       WHERE lb.user_id = $1`,
      [req.user.id]
    );

    res.json({ success: true, books: result.rows });
  } catch (err) {
    console.error("Error fetching loved books:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/loved/count", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM loved_books WHERE user_id = $1`,
      [req.user.id]
    );
    res.json({ success: true, count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error("Error counting loved books:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get('/notifications', authenticate, getReaderNotifications);
router.patch('/notifications/:id/read', authenticate, markNotificationAsRead);
router.patch('/notifications/read-all', authenticate, markAllNotificationsAsRead);
//router.delete('/notifications/:id', authenticate, deleteNotification);

export default router;