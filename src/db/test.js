const db = require('../config/db_config');
const sequelize = db.sequelize;
const Career_level = db.tbl_career_level;

const testData = async () => {
    try {
        const data = await sequelize.query(`Select * from [Marter_FA].[dbo].[tbl_career_level]`, {
            type: sequelize.QueryTypes.SELECT
        });
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate the error to the calling code
    }
};

module.exports = { testData };
