import multer from 'multer';
import path from 'path';

//Cài đặt storage cho multer để lưu trữ file ảnh
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Upload file
const upload = multer({ storage: storage });

export { upload };
