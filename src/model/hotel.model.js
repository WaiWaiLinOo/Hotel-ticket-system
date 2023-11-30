const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const hotel = sequelize.define('tbl_hotel', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        facebook: {
            type: Sequelize.STRING
        },
        main_street: {
            type: Sequelize.INTEGER
        },
        between_street1: {
            type: Sequelize.INTEGER
        },
        between_street2: {
            type: Sequelize.INTEGER
        },
        township: {
            type: Sequelize.INTEGER
        },
        city: {
            type: Sequelize.INTEGER
        },
        active: {
            type: Sequelize.INTEGER
        }
    },
        {
            freezeTableName: true,
            tableName: 'tbl_hotel'
        });

    return hotel;
}



