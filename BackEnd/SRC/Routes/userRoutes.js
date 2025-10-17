
// import express from "express";
// import { authenticate } from "../middleware/authMiddleware.js";
// import { addFavoriteCategory, getFavoriteCategories, getRecommendedBooks } from "../controllers/userController.js";

// const router = express.Router();

// router.get("/me", authenticate, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const userResult = await pool.query(
//       `SELECT id, first_name, email, favorite_category FROM users WHERE id = $1`,
//       [userId]
//     );

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const user = userResult.rows[0];

//     const categoryResult = await pool.query(
//       `SELECT c.name 
//        FROM user_favorite_categories ufc
//        JOIN categories c ON ufc.category_id = c.id
//        WHERE ufc.user_id = $1`,
//       [userId]
//     );

//     const additionalCategories = categoryResult.rows.map((row) => row.name);

//     res.json({
//       success: true,
//       user: {
//         id: user.id,
//         firstName: user.first_name,
//         email: user.email,
//         favoriteCategory: user.favorite_category,
//         additionalCategories,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// router.post("/favorites", authenticate, addFavoriteCategory);
// router.get("/favorites", authenticate, getFavoriteCategories);
// router.get("/recommended", authenticate, getRecommendedBooks);

// export default router;
