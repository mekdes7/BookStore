import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export const registerReader = async (req, res) => {
  try {
    const { first_name, last_name, email, password, favorite_category } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const existing = await pool.query("SELECT * FROM readers WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Reader already exists" });

    await pool.query(
      "INSERT INTO readers (first_name, last_name, email, password, favorite_category) VALUES ($1, $2, $3, $4, $5)",
      [first_name, last_name, email, hashed, favorite_category]
    );

    res.status(201).json({ message: "Reader registered successfully" });
  } catch (err) {
    console.error("Register Reader Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const loginReader = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reader = await pool.query("SELECT * FROM readers WHERE email = $1", [email]);

    if (reader.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, reader.rows[0].password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: reader.rows[0].id, role: "reader", name: reader.rows[0].name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, reader: reader.rows[0] });
  } catch (err) {
    console.error("Login Reader Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
