const router = require("express").Router();
const { authJwt } = require("../middleware");
const {
  getAllController,
  getAllControllerTownship,
  getHotelDataById,
  createHotelList,
  updateHotelList,
  deleteHotelDataById
} = require("../controller/hotel.controller");

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
})
router.get("/all", [authJwt.verifyToken], getAllController);
router.get("/alltownship", [authJwt.verifyToken], getAllControllerTownship);
router.get("/hotel-id/:id", [authJwt.verifyToken], getHotelDataById);
router.post("/create", [authJwt.verifyToken], createHotelList);
router.patch("/update", [authJwt.verifyToken], updateHotelList);
router.delete("/delete/:id", [authJwt.verifyToken], deleteHotelDataById);
module.exports = router;
