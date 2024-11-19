const multer = require('multer');
const path = require('path');


// Set up memory storage for multer (keep file in memory)
const storage = multer.memoryStorage();

// Check file type (only allow CSV files)
const fileFilter = (req, file, cb) => {
  const filetypes = /csv/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
