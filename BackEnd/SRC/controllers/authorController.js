import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export const registerAuthor = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body; 
    const hashed = await bcrypt.hash(password, 10);

    const existing = await pool.query("SELECT * FROM authors WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Author already exists" });

    await pool.query(
      "INSERT INTO authors (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
      [firstName, lastName, email, hashed] 
    );

    res.status(201).json({ message: "Author registered successfully" });
  } catch (err) {
    console.error("Register Author Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await pool.query("SELECT * FROM authors WHERE email = $1", [email]);

    if (author.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, author.rows[0].password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { 
        id: author.rows[0].id, 
        role: "author", 
        name: `${author.rows[0].first_name} ${author.rows[0].last_name}` 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      token, 
      author: {
        id: author.rows[0].id,
        firstName: author.rows[0].first_name,
        lastName: author.rows[0].last_name,
        email: author.rows[0].email,
        createdAt: author.rows[0].created_at
      } 
    });
  } catch (err) {
    console.error("Login Author Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};