// import multer from 'multer';

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// export default upload;
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
 
  fileFilter: (req, file, cb) => {
   
    if (file.fieldname === 'cover') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for cover'), false);
      }
    } else if (file.fieldname === 'file') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for book file'), false);
      }
    } else {
      cb(new Error('Unexpected field'), false);
    }
  }
});

export default upload;