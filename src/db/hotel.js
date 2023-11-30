const db = require('../config/db_config');
const sequelize = db.sequelize;
const Career_level = db.tbl_career_level;

const getAll = async () => {
    try {
        const data = await sequelize.query(`Select * from [Hotel_Map].[dbo].[tbl_city]`, {
            type: sequelize.QueryTypes.SELECT
        });
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate the error to the calling code
    }
};

module.exports = { getAll };
