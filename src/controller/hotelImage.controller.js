const db = require("../config/db_config");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const response = require("../config/response");
const { saveImage, getAllImages, getImageById, updateImage, getDeleteImageById } = require("../db/hotelImage");

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
exports.uploadMiddleware = (req, res, next) => {
  console.log('Multer middleware initiated');
  // Use multer upload instance
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

exports.createImages = async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  try {
    const imageData = await saveImage(files);

    res.json(response({
      success: true,
      message: "ImageFile upload successful!",
      payload: imageData
    }));

  } catch (error) {
    console.log("Error creating images:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllImagesData = async (req, res) => {
  try {
    const data = await getAllImages();

    res.json(response({
      success: true,
      message: "Fetching images successful!",
      payload: data
    }));

  } catch (error) {
    console.log("Error fetching images:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getImageDataById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getImageById(id);
    res.json(
      response({
        success: true,
        message: "Success!",
        payload: data,
      })
    );
  } catch (error) {
    console.error("Error in imageDataById", error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.updatedDataImage = async (req, res) => {

  const updatePromises = req.body.map(async (imageData) => {
    const { id, ...newData } = imageData;
    console.log("id==", id);
    console.log("newData==", newData);

    try {
      const updatedImage = await updateImage(id, newData);
      return {
        success: true,
        message: `Image with ID ${id} updated successfully!`,
        payload: updatedImage,
      };
    } catch (error) {
      console.log(`Error updating image with ID ${id}:`, error);
      return { success: false, message: error.message };
    }
  });

  try {
    const results = await Promise.all(updatePromises);
    res.json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating images' });
  }
};

exports.deleteImageDataById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("iddeltete>>>===", id)
    const data = await getDeleteImageById(id, uploadDir);
    res.json(
      response({
        success: true,
        message: "Successful delete image!",
        payload: data,
      })
    );
  } catch (error) {
    console.error("Error in deleting image by Id", error);
    res.status(500).json({ success: false, message: error });
  }
};

exports.deleteImageDataByIds = async (req, res) => {
  console.log("re===", req.body.map(value => value.id))
  const ids = req.body.map(value => value.id);
  console.log("ids to delete>>>===", ids);

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid IDs array" });
  }

  try {
    const deletePromises = ids.map(id => getDeleteImageById(id, uploadDir));
    const results = await Promise.all(deletePromises);

    res.json(
      response({
        success: true,
        message: "Images deleted successfully!",
        payload: results,
      })
    );
  } catch (error) {
    console.error("Error in deleting images by IDs", error);
    res.status(500).json({ success: false, message: error });
  }
};
