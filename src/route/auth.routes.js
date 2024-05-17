const router = require("express").Router();
const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");
const { signUpValidation } = require("../helpers/validation");

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

router.post(
  "/user-file-upload",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  controller.userDataUpload.single("file"),
  controller.userFileUpload,
  signUpValidation,
  controller.signup
);

router.post("/api/auth/signin", controller.signin);
router.post("/api/auth/refreshtoken", controller.refreshToken);

router.post("/api/auth/signout", controller.signout);

module.exports = router;
