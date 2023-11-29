const db = require('../config/db_config');
const sequelize = db.sequelize;
const Career_level = db.tbl_career_level;
exports.testController = async (req,res) =>{
    sequelize.query(`Select * from [Marter_FA].[dbo].[tbl_career_level]`, {
        type: sequelize.QueryTypes.SELECT
    }).then(async data => {
        res.json(data)
    })
}