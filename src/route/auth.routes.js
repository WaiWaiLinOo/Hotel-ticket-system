const router = require("express").Router();
const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");
const { signUpValidation } = require("../helpers/validation");
// const path = require("path");
const path = require("node:path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const filefilter = (req, file, cb) => {
  (file.mimetype == "image/jpeg" || file.mimetype == "image/png")
    ? cb(null, true)
    : cb(null, false);
};

const upload = multer({ 
  storage: storage,
  fileFilter: filefilter
 });

// const upload = multer({ dest: "../public/images" });

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// router.post(
//   "/api/auth/signup",
//   [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
//   upload.single("image"),
//   signUpValidation,
//   controller.signup
// );

const storageConfig = multer.diskStorage({
  // destinations is uploads folder 
  // under the project directory
destination: path.join(__dirname, "uploads"),
filename: (req, file, res) => {
      // file name is prepended with current time
      // in milliseconds to handle duplicate file names
    res(null, Date.now() + "-" + file.originalname);
},
});

const fileFilterConfig = function(req, file, cb) {
  if (file.mimetype === "image/jpeg"
      || file.mimetype === "image/png") {
      cb(null, true);
  } else {
      cb(null, false);
  }
};

const uploads = multer({ dest: 'uploads/' });

router.post("/upload", uploads.single("file"), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded. Please attach a JPEG file under 5 MB.');
  }
  res.status(201).send("File uploaded successfully");
});

router.post("/api/auth/signin", controller.signin);
router.post("/api/auth/refreshtoken", controller.refreshToken);

router.post("/api/auth/signout", controller.signout);

module.exports = router;
