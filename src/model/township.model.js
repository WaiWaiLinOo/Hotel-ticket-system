const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const township = sequelize.define('tbl_township', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        city_id: {
            type: Sequelize.INTEGER
        },
        active: {
            type: Sequelize.INTEGER
        }
    },
        {
            freezeTableName: true,
            tableName: 'tbl_township'
        });

    return township;
}



