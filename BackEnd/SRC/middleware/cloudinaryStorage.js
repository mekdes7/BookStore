import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'bookstore/files';
    if (file.mimetype.startsWith('image/')) {
      folder = 'bookstore/covers';
    }

    return {
      folder,
      resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
