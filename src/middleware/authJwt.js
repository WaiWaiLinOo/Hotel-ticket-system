const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../config/db_config");
const User = db.tbl_user;
const Role = db.tbl_role;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if(err instanceof TokenExpiredError){
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
  // let token = req.session.token;
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token,
             config.secret,
             (err, decoded) => {
              if (err) {
                // return res.status(401).send({
                //   message: "Unauthorized!",
                // });
                return catchError(err, res);
              }
              req.userId = decoded.id;
              next();
             });
};

const isAdmin = (req, res, next) => {
  // Find the user by their ID
  User.findByPk(req.userId).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Assuming User model has a 'Role' association
    user.getRole().then(role => {console.log("isrole>>>",role)
      if (!role) {
        return res.status(404).send({ message: "Role not found" });
      }

      // Check if the user's role is 'admin'
      if (role.name === "admin") {
        next(); // Allow access
      } else {
        res.status(403).send({ message: "Require Admin Role!" });
      }
    }).catch(err => {
      console.error("Error:", err);
      res.status(500).send({ message: "Internal Server Error" });
    });
  }).catch(err => {
    console.error("Error:", err);
    res.status(500).send({ message: err });
  });
};

const isModerator = (req, res, next) => {
  // Find the user by their ID
  User.findByPk(req.userId).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Assuming User model has a 'Role' association
    user.getRole().then(role => {
      if (!role) {
        return res.status(404).send({ message: "Role not found" });
      }

      // Check if the user's role is 'admin'
      if (role.name === "moderator") {
        next(); // Allow access
      } else {
        res.status(403).send({ message: "Require Moderator Role!" });
      }
    }).catch(err => {
      console.error("Error:", err);
      res.status(500).send({ message: "Internal Server Error" });
    });
  }).catch(err => {
    console.error("Error:", err);
    res.status(500).send({ message: "Internal Server Error" });
  });
};

const isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;