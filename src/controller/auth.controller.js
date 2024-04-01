const db = require("../config/db_config");
const config = require("../config/auth.config");

const { tbl_user: User, tbl_role: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, email, password, role_id, active } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Create the user record in the database
    // const newUser = await db.tbl_user.create({
    //     username,
    //     email,
    //     password: hashedPassword, // Save the hashed password
    //     role_id,
    //     active
    // });
    // console.log("newUser==",newUser)
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      active,
      role_id,
    });
    const user = await newUser.save();
    const role = await Role.findOne({ id: user.role_id });

    const modifiedUserResponse = {
      email: user.email,
      username: user.username,
      active: user.active,
      role,
    };

    // Send a success response
    res.status(201).json({
      message: "User created successfully",
      user: modifiedUserResponse,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    include: [{ model: db.tbl_role }],
    where: {
      username: req.body.username,
    },
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
          message: "Invalid Password!",
        });
      }
      // create a jwt token
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      // let authorities = [];
      console.log("role====", user);
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

      // const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());
      const authorities = user.role.name.toUpperCase();
      console.log("rolesquh==",user.role.name.toUpperCase(),authorities)

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        active: user.active,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
      });
    })
  // })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken: requestToken } = req.body;

    if (!requestToken) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }

    const refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    console.log("refreshtoken===", refreshToken);

    if (!refreshToken) {
      return res
        .status(403)
        .json({ message: "Refresh token is not in the database!" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.destroy({ where: { id: refreshToken.id } });
      return res
        .status(403)
        .json({
          message:
            "Refresh token has expired. Please make a new signin request",
        });
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
    return res
      .status(500)
      .json({ message: "Internal server error while refreshing token" });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!",
    });
  } catch (err) {
    this.next(err);
  }
};
