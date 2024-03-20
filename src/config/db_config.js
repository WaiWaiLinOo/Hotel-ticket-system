
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV
require('dotenv').config({ path: `.env.${env}` })
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.PASSWORD, {
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
    timezone: '+06:30', // for writing to database
  });  
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tbl_city = require('../model/city.model')(sequelize, Sequelize);
db.tbl_township = require('../model/township.model')(sequelize, Sequelize);
db.tbl_hotel = require('../model/hotel.model')(sequelize, Sequelize);
db.tbl_user = require('../model/user.model')(sequelize, Sequelize);
db.tbl_role = require('../model/role.model')(sequelize, Sequelize);
db.refreshToken = require("../model/refreshToken.model")(sequelize, Sequelize);
// db.tbl_role.belongsToMany(db.tbl_user, {
//   through: "user_roles",
//   foreignKey: "roleId",
//   otherKey: "userId"
// });
// db.tbl_user.belongsToMany(db.tbl_role, {
//   through: "user_roles",
//   foreignKey: "userId",
//   otherKey: "roleId"
// });

db.tbl_role.hasOne(db.tbl_user, {foreignKey: 'role_id'});
db.tbl_user.belongsTo(db.tbl_role);

db.refreshToken.belongsTo(db.tbl_user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.tbl_user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

//The where option is an empty object, which means it will match all records, 
// and truncate: true truncates the table after deleting records.
// db.refreshToken.destroy({ where: {}, truncate: true })
//   .then(() => {
//     console.log('Refresh tokens table truncated.');
//   })
//   .catch((error) => {
//     console.error('Error truncating refresh tokens table:', error);
//   });

// db.Roles = ["user", "admin", "moderator"]
module.exports = db