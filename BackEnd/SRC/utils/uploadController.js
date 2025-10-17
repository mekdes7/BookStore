
import { uploadFile } from './cloudinary.js';

export const handleBookUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

   
    const result = await uploadFile(req.file.path, req.file.originalname);

    res.json({
      message: "Upload successful!",
      data: result 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File upload failed" });
  }
};