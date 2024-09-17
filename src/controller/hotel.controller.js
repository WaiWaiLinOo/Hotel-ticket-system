const { getAll, getAllTownship, getHotelById, getCreateHotel, getUpdateHotel, getDeleteHotelById } = require("../db/hotel");
const response = require("../config/response");

exports.getAllController = async (req, res) => {
  try {
    const data = await getAll();
    res.json(
      response({
        success: true,
        message: "Success!",
        payload: data,
      })
    );
  } catch (error) {
    console.error("Error in testController:", error);
    res.status(500).json({ success: false, message: error });
  }
};
exports.getAllControllerTownship = async (req, res) => {
  try {
    const data = await getAllTownship();
    res.json(
      response({
        success: true,
        message: "Success!",
        payload: data,
      })
    );
  } catch (error) {
    console.error("Error in testControllerTownShip", error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.getHotelDataById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getHotelById(id);
    res.json(
      response({
        success: true,
        message: "Success!",
        payload: data,
      })
    );
  } catch (error) {
    console.error("Error in testControllerTownShipId", error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.createHotelList = async (req, res) => {
  try {
    var hotel = req.body;
    const hotelData = await getCreateHotel(hotel);
    res.json({
      success: true,
      message: "Hotel created successfully!",
      payload: hotelData
    });
  } catch (error) {
    console.log("Error creating hotel:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHotelList = async (req, res) => {
  try {
    var hotel = req.body;
    console.log("hotel==", hotel);
    const hotelData = await getUpdateHotel(hotel);
    res.json({
      success: true,
      message: "Hotel updated successfully!",
      payload: hotelData
    });
  } catch (error) {
    console.log("Error updating hotel:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHotelDataById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("iddeltete>>>===",id)
    const data = await getDeleteHotelById(id);
    res.json(
      response({
        success: true,
        message: "Successful delete!",
        payload: data,
      })
    );
  } catch (error) {
    console.error("Error in deleting testControllerTownShipId", error);
    res.status(500).json({ success: false, message: error });
  }
};

