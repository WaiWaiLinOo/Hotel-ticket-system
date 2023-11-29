
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV
require('dotenv').config({ path: `.env.${env}` })
const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DIALECT,
    define: {
      timestamps: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      options: {
        connectTimeout: 30000, // or a higher value
        requestTimeout: 30000, // or a higher value
        encrypt: false,
      },
      useUTC: false, // for reading from database
    },
    timezone: '+06:30', // for writing to database
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tbl_career_level = require('../model/careerLevel.model')(sequelize, Sequelize);
module.exports = db