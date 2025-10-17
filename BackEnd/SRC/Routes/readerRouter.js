import express from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { registerReader, loginReader } from "../controllers/readerController.js";

const router = express.Router();

router.post("/register", registerReader);
router.post("/login", loginReader);

router.get("/profile", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, favorite_category, created_at
       FROM readers
       WHERE id = $1`,
      [req.user.id]  
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reader not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching reader profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/:readerId/notifications', async (req, res) => {
  const { readerId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE reader_id = $1 
       ORDER BY created_at DESC`,
      [readerId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1`,
      [id]
    );
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;