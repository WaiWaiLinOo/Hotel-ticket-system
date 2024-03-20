const db = require("../config/db_config");
const sequelize = db.sequelize;
const Career_level = db.tbl_career_level;

const getAll = async () => {
  try {
    const data = await sequelize.query(
      `select a.*,b.name as city_name from tbl_hotel as a inner join tbl_city as b ON a.city = b.id`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error to the calling code
  }
};

const getAllTownship = async () => {
  try {
    const data = await sequelize.query(
      `select a.*,b.name as city_name, c.name as township_name from tbl_hotel as a inner join tbl_city as b ON a.city = b.id
         inner join tbl_township as c ON a.township = c.id 
        order by a.id desc`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetchind data:", error);
    throw error;
  }
};

const getHotelById = async (id) => {
  try {
    const data = await sequelize.query(
      `
            SELECT a.*, b.name AS city_name, c.name AS township_name 
            \nFROM tbl_hotel AS a INNER JOIN tbl_city AS b ON a.city = b.id INNER JOIN tbl_township
             AS c ON a.township = c.id WHERE a.id = :id
        `,
      {
        replacements: { id }, // Use parameterized query
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log("id == ", data);
    return data;
  } catch (error) {
    console.error("Error fetching data with id", error);
    throw error; // Rethrow the error for handling by the caller
  }
};

const getCreateHotel = async (row) => {
  console.log("row-===", row);
  try {
    const data = await sequelize.query(
      `
            INSERT INTO tbl_hotel (name, phone, email, facebook, main_street, between_street1, between_street2, township, city)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      {
        replacements: [
          row.name,
          row.phone,
          row.email,
          row.facebook,
          row.main_street,
          row.between_street1,
          row.between_street2,
          row.township,
          row.city,
        ],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    console.log("data==", data);

    const id = data[0];
    return getAllTownship(id);
  } catch (error) {
    console.error("Error creating hotel:", error);
    throw error;
  }
};

const getUpdateHotel = async (row) => {
  console.log("rowupdate==", row);
  try {
    const data = await sequelize.query(
      `
        UPDATE  tbl_hotel SET name=?, phone=?, email=?, facebook=?, main_street=?, between_street1=?, between_street2=?, township=?, city=? 
        WHERE id =?
        `,
      {
        replacements: [
          row.name,
          row.phone,
          row.email,
          row.facebook,
          row.main_street,
          row.between_street1,
          row.between_street2,
          row.township,
          row.city,
          row.id,
        ],
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    if (data) {
      const id = row.id;
      console.log("id==", id);
      return getAllTownship(id);
    }
  } catch (error) {
    console.error("Error updating hotel:", error);
    throw error;
  }
};

const getDeleteHotelById = async (id) => {
  try {
    const data = await sequelize.query(
      `
        DELETE FROM tbl_hotel WHERE id = :id
        `,
      {
        replacements: { id },
        type: sequelize.QueryTypes.DELETE,
      }
    );
    console.log("id delete== ", data);
    if(data == undefined){
      return getAllTownship()
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
  getAll,
  getAllTownship,
  getHotelById,
  getCreateHotel,
  getUpdateHotel,
  getDeleteHotelById,
};
