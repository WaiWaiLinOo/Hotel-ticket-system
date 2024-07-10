const router = require("express").Router();
const { authJwt } = require("../middleware");
const {
  getAllController,
  getAllControllerTownship,
  getHotelDataById,
  createHotelList,
  updateHotelList,
  deleteHotelDataById,
} = require("../controller/hotel.controller");
const { uploadMiddleware, createImages, getAllImagesData, getImageDataById, updatedDataImage, deleteImageDataById } = require("../controller/hotelImage.controller");

// Additional middleware
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
// router.use((req, res, next) => {
//   console.log('Incoming Request:', {
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//     body: req.body
//   });
//   next();
// });


// Route definitions
router.get("/all", [authJwt.verifyToken], getAllController);
router.get("/alltownship", [authJwt.verifyToken], getAllControllerTownship);
router.get("/hotel-id/:id", [authJwt.verifyToken], getHotelDataById);
router.post("/create", [authJwt.verifyToken], createHotelList);
router.patch("/update", [authJwt.verifyToken], updateHotelList);
router.delete("/delete/:id", [authJwt.verifyToken], deleteHotelDataById);

// Log incoming request
router.post('/upload-images', (req, res, next) => {
  console.log('Request received:', req.headers);
  next();
}, uploadMiddleware, createImages);

router.get("/all-images", getAllImagesData);
router.get("/image-id/:id", getImageDataById);
router.patch("/update-image", updatedDataImage);
router.delete("/delete-image/:id",deleteImageDataById)

module.exports = router;
