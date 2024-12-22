const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File will be saved in: ./public/uploads");
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    console.log("File will be saved as:", filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadMiddleware = multer({ storage, fileFilter });

module.exports = uploadMiddleware;