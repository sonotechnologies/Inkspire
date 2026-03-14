const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../uploads/avatars");

// create folder automatically if missing
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      "avatar-" +
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }

});

const upload = multer({ storage });

module.exports = upload;