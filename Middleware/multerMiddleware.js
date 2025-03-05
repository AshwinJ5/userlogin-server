const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './Uploads');
  },
  filename: (req, file, callback) => {
    const filename = `IMG${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(new Error("Please upload jpeg/jpg/png format "));
  }
};

const multerConfig = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = multerConfig;
