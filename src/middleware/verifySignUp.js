const db = require("../config/db_config");
const ROLES = db.Roles;
const User = db.tbl_user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    let user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!"
      });
    }

    // Email
    user = await User.findOne({
      where: {
        email: req.body.email
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

checkRolesExisted = (req, res, next) => {
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

// checkRolesExisted = async (req, res, next) => {
//   try {
//     const roles = await ROLES.findAll();
//     const roleNames = roles.map(role => role.name);
//     console.log("role==",roles,roleNames)

//     if (req.body.roles) {
//       for (let i = 0; i < req.body.roles.length; i++) {
//         if (!roleNames.includes(req.body.roles[i])) {
//           res.status(400).send({
//             message: "Failed! Role does not exist = " + req.body.roles[i]
//           });
//           return;
//         }
//       }
//     }
//     next();
//   } catch (error) {
//     console.error("Error checking roles:", error);
//     res.status(500).send({
//       message: "Internal server error"
//     });
//   }
// };


const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;