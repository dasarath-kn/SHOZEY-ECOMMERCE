const multer = require('multer')
const path = require('path')

// const p=require('../public/productimages')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/productimages"));
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' + file.originalname);
    cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
});

const upload = multer({ storage: storage });


const banner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/bannerimages"));
  },
  filename: function (req, file, cb) {
    cb(null, "-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadbanner = multer({ storage: banner });


module.exports = { upload,uploadbanner }