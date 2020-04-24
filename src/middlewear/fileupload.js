const multer = require("multer");
const imgUpload = multer({
  //   dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("File must be a Image."));
    }
    cb(undefined, true);
  },
});

module.exports = imgUpload;
