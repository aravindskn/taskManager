//Middlewear for File Upload
const multer = require("multer");
const imgUpload = multer({
  //Parser for upload
  //   dest: "avatars",
  limits: {
    fileSize: 1000000, //Limit file upload size
  },
  //Validate File
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("File must be a Image."));
    }
    cb(undefined, true);
  },
});

module.exports = imgUpload;
