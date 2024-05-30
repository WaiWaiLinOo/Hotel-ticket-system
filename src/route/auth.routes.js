const router = require("express").Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const { checkDuplicateUsernameOrEmail,checkRolesExisted } = require("../middleware/verifySignUp");
const controller = require("../controller/auth.controller");
const { signUpValidation } = require("../helpers/validation");
const { forgotPassword, resetPassword } = require("../controller/resetPassword.controller");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/api/auth/signup",
  controller.userDataUpload.single("image"),
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  // controller.userFileUpload,
  signUpValidation,
  controller.signup
);

router.post("/forgotPassword", forgotPassword);
router.post("/api/auth/signin", controller.signin);
router.post("/api/auth/refreshtoken", controller.refreshToken);

router.post("/api/auth/signout", controller.signout);
router.post("/resetPassword", resetPassword);

module.exports = router;
