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

module.exports = { upload }