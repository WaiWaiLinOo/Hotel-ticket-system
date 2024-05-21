const db = require("../config/db_config");
const sequelize = db.sequelize;
const ROLES = db.Roles;
const User = db.tbl_user;

exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    const { username, email } = req.body 

    if (!username && !email) {
      return res.status(400).send({
        message: "Username and email are required!"
      });
    }
    // let user = await sequelize.query(
    //   `SELECT * FROM users WHERE username = '${username}';`,
    // );
    let user = await User.findOne({ where: { username } });

    if (user) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    // Email
    user = await User.findOne({
      where: {
        email
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      // message: "Unable to validate Username!"
      message: error
    });
  }
};

exports.checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }

  next();
};

// const verifySignUp = {
//   checkDuplicateUsernameOrEmail,
//   checkRolesExisted
// };

// module.exports = verifySignUp;