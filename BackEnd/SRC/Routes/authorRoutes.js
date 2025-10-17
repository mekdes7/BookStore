import express from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { registerAuthor, loginAuthor } from "../controllers/authorController.js";
import { getMyBooks } from "../controllers/bookController.js";

const router = express.Router();

router.post("/register", registerAuthor);
router.post("/login", loginAuthor);

router.get("/my-books", authenticate, getMyBooks);
router.get("/profile", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, created_at
       FROM authors
       WHERE id = $1`,
      [req.user.id]  
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    const author = result.rows[0];
    res.json({
      id: author.id,
      firstName: author.first_name,
      lastName: author.last_name,
      email: author.email,
      createdAt: author.created_at
    });
  } catch (err) {
    console.error("Error fetching author profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;