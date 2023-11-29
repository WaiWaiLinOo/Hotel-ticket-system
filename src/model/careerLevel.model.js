module.exports = (sequelize, Sequelize) => {
    const careerLevel = sequelize.define('tbl_career_level', {
        career_level_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        career_level: {
            type: Sequelize.INTEGER
        },
        remark: {
            type: Sequelize.STRING
        },
        active: {
            type: Sequelize.INTEGER
        }
    },
        {
            freezeTableName: true,
            tableName: 'tbl_career_level'
        });

    return careerLevel;
}



