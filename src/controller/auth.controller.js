const db = require("../config/db_config");
const config = require("../config/auth.config");
// const User = db.tbl_user;
// const Role = db.tbl_role;

const { tbl_user: User, tbl_role: Role, refreshToken: RefreshToken} = db;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// exports.signup = async (req, res) => {
//   console.log("req==usersignup==",req)
//   // Save User to Database
//   try {
//     const user = await User.create({
//       username: req.body.username,
//       email: req.body.email,
//       password: bcrypt.hashSync(req.body.password, 8),
//     });

//     if (req.body.roles) {
//       const roles = await Role.findAll({
//         where: {
//           name: {
//             [Op.or]: req.body.roles,
//           },
//         },
//       });

//       const result = user.setRoles(roles);
//       if (result) res.send({ message: "User registered successfully!" });
//     } else {
//       // user has role = 1
//       const result = user.setRoles([1]);
//       if (result) res.send({ message: "User registered successfully!" });
//     }
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// exports.signin = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where: {
//         username: req.body.username,
//       },
//     });

//     if (!user) {
//       return res.status(404).send({ message: "User Not found." });
//     }

//     const passwordIsValid = bcrypt.compareSync(
//       req.body.password,
//       user.password
//     );

//     if (!passwordIsValid) {
//       return res.status(401).send({
//         message: "Invalid Password!",
//       });
//     }

//     const token = jwt.sign({ id: user.id },
//                            config.secret,
//                            {
//                             algorithm: 'HS256',
//                             allowInsecureKeySizes: true,
//                             expiresIn: 86400, // 24 hours
//                            });

//     let authorities = [];
//     const roles = await user.getRoles();
//     for (let i = 0; i < roles.length; i++) {
//       authorities.push("ROLE_" + roles[i].name.toUpperCase());
//     }

//     req.session.token = token;

//     return res.status(200).send({
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       roles: authorities,
//     });
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// };

// exports.signup = (req, res) => {
//   // Save User to Database
//   User.create({
//     username: req.body.username,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password, 8),
//     role_id: req.body.role_id,
//     active: req.body.active
//   })
//     .then(user => {
//       if (req.body.roles) {
//         Role.findAll({
//           where: {
//             name: {
//               [Op.or]: req.body.roles
//             }
//           }
//         }).then(roles => {
//           console.log("user==",user)
//           user.setRoles(roles).then(() => {
//             res.send({ message: "User registered successfully!!" });
//           });
//         });
//       } else {
//         // user role = 1
//         user.setRoles([1]).then(() => {
//           res.send({ message: "User registered successfully!" });
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };

exports.signup = async (req, res) => {
  try {
    console.log("role==",req.body)
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role_id: req.body.role_id,
      active: req.body.active
    });
    // if (req.body.roles) {
    //   const roles = await Role.findAll({
    //     where: { name: { [Op.or]: req.body.roles } }
    //   });

    //   if (roles.length === 0) {
    //     return res.status(400).send({ message: "Specified role(s) not found." });
    //   }

    //   await user.setRoles(roles);
    // } else {
    //   // Default role_id
    //   await user.setRoles([1]);
    // }

    res.send({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

// exports.signup = async (req, res) => {
//   try {
//     console.log("role==", req.body);
    
//     // Check if the role with given id exists
//     const role = await Role.findByPk(req.body.role_id);
//     if (!role) {
//       return res.status(400).send({ message: "Role not found!" });
//     }

//     // Create the user with the role_id
//     const user = await User.create({
//       username: req.body.username,
//       email: req.body.email,
//       password: bcrypt.hashSync(req.body.password, 8),
//       role_id: req.body.role_id,
//       active: req.body.active
//     });
    
//     res.send({ message: "User registered successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: err.message });
//   }
// };


exports.signin = (req, res) => {
  User.findOne({
    include:[
     { model: db.tbl_role}
    ],
    where: {
      username: req.body.username
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      // compare hashed password
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      // create a jwt token
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

      // let authorities = [];
      console.log("role====",user)
      // user.getRoles().then(roles => {
      //   for (let i = 0; i < roles.length; i++) {
      //     authorities.push("ROLE_" + roles[i].name.toUpperCase());
      //   }

      //   res.status(200).send({
      //     id: user.id,
      //     username: user.username,
      //     email: user.email,
      //     roles: authorities,
      //     role_id: user.role_id,
      //     active: user.active,
      //     accessToken: token,
      //     refreshToken: refreshToken,
      //   });
      // });
      // const roles = await user.s(); // Assuming the method name is getTbl_role

      console.log(user)

      // const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());
      // console.log("rolesquh==",roles,authorities)
  
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      active: user.active,
      // roles: authorities,
      accessToken: token,
      refreshToken: refreshToken,
    });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken: requestToken } = req.body;

    if (!requestToken) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }

    const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    console.log("refreshtoken===",refreshToken)

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is not in the database!" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.destroy({ where: { id: refreshToken.id } });
      return res.status(403).json({ message: "Refresh token has expired. Please make a new signin request" });
    }

    const user = await refreshToken.getUser();
    const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
      message: "Refresh token is still active!",
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Internal server error while refreshing token" });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};