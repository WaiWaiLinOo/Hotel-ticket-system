// const { verifySignUp } = require("../middleware");
// const controller = require("../controller/auth.controller");

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.post(
//     "/api/auth/signup",
//     [
//       verifySignUp.checkDuplicateUsernameOrEmail,
//       verifySignUp.checkRolesExisted
//     ],
//     controller.signup
//   );

//   app.post("/api/auth/signin", controller.signin);

//   app.post("/api/auth/signout", controller.signout);
// };
const router = require("express").Router();
const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/api/auth/signup",
  // [
  //   verifySignUp.checkDuplicateUsernameOrEmail,
  //   verifySignUp.checkRolesExisted
  // ],
  controller.signup
);

router.post("/api/auth/signin", controller.signin);
router.post("/api/auth/refreshtoken", controller.refreshToken);

router.post("/api/auth/signout", controller.signout);

module.exports = router;
