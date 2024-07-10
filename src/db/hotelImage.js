const db = require("../config/db_config");
const sequelize = db.sequelize;
const { images : Image } = db;

const saveImage = async (files) => {
  try {
    const promises = files.map(async (file) => {

      const { originalname, mimetype, path } = file;
      console.log("file====",file)
   
      const query = `
        INSERT INTO image (type, name, data)
        VALUES (?, ?, ?)
      `;
      const values = [mimetype, originalname, path];

      // Execute the raw query
      const [result, metadata] = await sequelize.query(query, {
        replacements: values,
        type: sequelize.QueryTypes.INSERT,
      });

      // Assuming your database returns the inserted row ID, fetch the newly inserted image
      const newImageId = result;
      const newImage = await Image.findByPk(newImageId);

      return newImage;
    });

    // // Wait for all images to be saved
    const savedImages = await Promise.all(promises);
    return savedImages;

  }catch (error) {
    console.error("Error saving images:", error);
    throw error; // Propagate the error to the calling code
  }
};

const getAllImages = async () => {
  try {
    const images = await sequelize.query(`SELECT * FROM image`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

const getImageById = async (imageId) => {
  try {
    const image = await sequelize.query(
      `SELECT * FROM image WHERE id = :id`,
      {
        replacements: { id: imageId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    return image;
  } catch (error) {
    console.error(`Error fetching image with ID ${imageId}:`, error);
    throw error;
  }
};

const updateImage = async (imageId, newData) => {
  try {
    const image = await Image.findByPk(imageId);
    
    if (image) {
      await image.update(newData);
      return image;
    } else {
      throw new Error(`Image with ID ${imageId} not found`);
    }
  } catch (error) {
    console.error(`Error updating image with ID ${imageId}:`, error);
    throw error;
  }
};

const getDeleteImageById = async (id) => {
  try {
    const data = await sequelize.query(
      `
        DELETE FROM image WHERE id = :id
        `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.DELETE,
      }
    );
    console.log("id delete== ", data);
    if(data == undefined){
      return getAllImages()
    }else{
      return console.log("error in deleting")
    }
    // return data;
  } catch (error) {
    console.error("Error deleting data with id", error);
    throw error;
  }
};

module.exports = {
  saveImage,
  getAllImages,
  getImageById,
  updateImage,
  getDeleteImageById,
};
