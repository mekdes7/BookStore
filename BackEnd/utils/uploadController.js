import cloudinary from './cloudinary.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",   
      folder: "books",        
      use_filename: true,
      unique_filename: false,
      access_mode: "public"   
    });

    res.json({
      fileName: result.original_filename,
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File upload failed" });
  }
};
