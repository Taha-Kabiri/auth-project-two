const multer = require("multer");
const { mkdirp } = require("mkdirp");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdirp("./public/uploads/images").then((made) => {
      cb(null, "./public/uploads/images");
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
