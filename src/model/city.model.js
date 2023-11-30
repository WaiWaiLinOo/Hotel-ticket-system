const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const city = sequelize.define('tbl_city', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        active: {
            type: Sequelize.INTEGER
        }
    },
        {
            freezeTableName: true,
            tableName: 'tbl_city'
        });

    return city;
}



