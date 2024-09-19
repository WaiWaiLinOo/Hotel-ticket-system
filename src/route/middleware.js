const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = (req, res, next) => {
  try {
    let authToken
    const auth = req.headers.authorization || req.headers['x-auth-token'];
    if (auth) {
      authToken = auth.split(' ')[1];
    } else {
      authToken = req.headers.token
    }
    console.log("Incoming...========>", req.url, '----', req.path, '----', authToken);
    if (req.url === "/login/api/auth/signin" || req.url === "/login") return next();
    if (!authToken) {
      return res.status(401).send({ success: false, message: "No token provided!" });
    } else {
      return this.checkAuth(authToken, req, res, next);
    }
  } catch (e) {
    console.log('error par========>', e)
    throw new Error("Cannot Extract User Id");
  }
}

module.exports.checkAuth = (authToken, req, res, next) => {
  return verifyToken(authToken, async (error, data) => {
    if (error) {
      return res.status(401).send({
        success: error,
        status: 401,
        message: "Token expired. Please log in again.",
        // redirect: "/login"
      })
    } else {
      // const tokenInfo = await authenticationService.getTokenInfoByUserId(
      //   data.id
      // );
      // if (!tokenInfo) {
      //   // return next(new LocalizedError('error.user.not_login'));
      //   return res.status(401).send({ success: false, message: "User not Logined!" });
      // }
      // const tokenDate = kumoDate.utcToCurrentTimezone(tokenInfo.updatedDate);
      // const currentDate = kumoDate.utcToCurrentTimezone(new Date());
      // if (!moment(tokenDate).isAfter(currentDate)) {
      //   return res.status(401).send({ success: false, message: "Expired Token!" });
      // }
      next();
    }
  });
};

const verifyToken = (token, callback) => {
  jwt.verify(token, config.secret, (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

const extractToken = async (token) => {
  return jwt.verify(token, config.secret, (err, decoded) => {
    return decoded;
  });
};

const getCurrentUser = async (req, res) => {
  try {
    let authToken
    const auth = req.headers.authorization || req.headers['x-auth-token'];
    if (auth) {
      authToken = auth.split(' ')[1];
    } else {
      authToken = req.headers.token
    }
    let extInfo = await extractToken(authToken);
    if (extInfo == null || extInfo.id == null) {
      throw new Error("Cannot Extract User Id");
    }
    return extInfo;
  } catch (e) {
    throw e;
  }
};


module.exports = {
  authenticationMiddleware,
  getCurrentUser
};
