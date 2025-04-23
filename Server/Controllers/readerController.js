import { Reader } from "../Models/ReaderModel";

export const getReaderData = async (req, res) => {
    try {
      const { readerId } = req.body;
      console.log("User ID:", readerId); 
      const user = await UserModel.findById(readerId);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      return res.json({
        success: true,
        readerData: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
        },
      });
    } catch (error) {
      console.error("Error in getUserData:", error);
      res.status(500).json({ error: "Error getting user data", message: error.message });
    }
  };