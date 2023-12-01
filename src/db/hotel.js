const db = require('../config/db_config');
const sequelize = db.sequelize;
const Career_level = db.tbl_career_level;

const getAll = async () => {
    try {
        const data = await sequelize.query(`select a.*,b.name as city_name from dbo.tbl_hotel as a inner join dbo.tbl_city as b ON a.city = b.id`, {
            type: sequelize.QueryTypes.SELECT
        });
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate the error to the calling code
    }
};

module.exports = { getAll };
