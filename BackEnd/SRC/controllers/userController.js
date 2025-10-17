
// import pool from "../db.js";

// export const addFavoriteCategory = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { categoryId } = req.body;

//     if (!categoryId) {
//       return res.status(400).json({ success: false, message: "Category is required" });
//     }

//     await pool.query(
//       `INSERT INTO user_favorite_categories (user_id, category_id) 
//        VALUES ($1, $2) 
//        ON CONFLICT (user_id, category_id) DO NOTHING`,
//       [userId, categoryId]
//     );

//     res.json({ success: true, message: "Category added to favorites" });
//   } catch (err) {
//     console.error("Add Favorite Category Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// export const getFavoriteCategories = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const { rows: userRows } = await pool.query(
//       "SELECT favorite_category FROM users WHERE id = $1",
//       [userId]
//     );
//     const mainCategory = userRows[0]?.favorite_category || null;

//     const { rows: extraRows } = await pool.query(
//       `SELECT c.id, c.name 
//        FROM user_favorite_categories ufc
//        JOIN categories c ON ufc.category_id = c.id
//        WHERE ufc.user_id = $1`,
//       [userId]
//     );

//     const allCategories = [
//       ...(mainCategory ? [{ id: null, name: mainCategory }] : []),
//       ...extraRows
//     ];

//     res.json({ success: true, categories: allCategories });
//   } catch (err) {
//     console.error("Get Favorite Categories Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// export const getRecommendedBooks = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const { rows: categories } = await pool.query(
//       `
//       SELECT favorite_category AS name FROM users WHERE id = $1
//       UNION
//       SELECT c.name FROM user_favorite_categories ufc
//       JOIN categories c ON ufc.category_id = c.id
//       WHERE ufc.user_id = $1
//       `,
//       [userId]
//     );

//     if (categories.length === 0) {
//       return res.json({ success: true, books: [] });
//     }

//     const categoryNames = categories.map(c => c.name);

//     const { rows: books } = await pool.query(
//       `SELECT b.id, b.title, b.book_cover, b.book_file, b.published_year,
//               u.first_name || ' ' || u.last_name AS author_name, b.category
//        FROM books b
//        JOIN users u ON b.author_id = u.id
//        WHERE b.category = ANY($1::text[])
//        ORDER BY b.created_at DESC
//        LIMIT 20`,
//       [categoryNames]
//     );

//     res.json({ success: true, books });
//   } catch (err) {
//     console.error("Get Recommended Books Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
