const db = require("../config/db_config");
const config = require("../config/auth.config");
const sequelize = db.sequelize;
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
const path = require('path')
const { tbl_user: User, tbl_role: Role, refreshToken: RefreshToken } = db;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const randomstring = require('randomstring');
const { sendMail } = require('../helpers/sendMail');

let storage = multer.diskStorage({
  destination: (req, file, cb)=> {        
      var dir = './upload';
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      }
      cb(null, './upload')
  },
  filename:  (req, file, cb) =>{
      let generatedName = uuidv4()+path.extname(file.originalname);
      req.body.uploadFile =file;
      cb(null, generatedName)        
  }
})

exports.userDataUpload = multer({
  limits: {
      fileSize: 1024*1024*6, //6MB
  }, 
  storage: storage,
  fileFilter:  (req, file, callback)=> {
      var ext = path.extname(file.originalname);
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg'&& ext !== '.pdf'&& ext !== '.xlsx'&& ext !== '.docx'&& ext !== '.txt') {
          // return callback(new LocalizedError('error.upload.only_images_allowed'));
      }
      callback(null, true)
  },
})

exports.userFileUpload = async (req, res, next) => {
  console.log("request.file==",req.file);
  try {
    let uploadFileName = req.file?.filename;
    return res.status(200).send({
      message: uploadFileName,
    });
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  else{
    try {
        // Extract user data from the request body
        const { username, email, password, role_id, active } = req.body;
        const image =  req.file ? `/upload/${req.file.filename}` : null;
        console.log("reqbody===",req.body)
      
    // Hash the password before saving it to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const newUser = new User({
        email,
        password: hashedPassword,
        username,
        active,
        role_id,
        image: image,
      });
      const user = await newUser.save();
      const role = await Role.findByPk( user.role_id );

    const modifiedUserResponse = {
      email: user.email,
      username: user.username,
      active: user.active,
      role,
      image,
    };

    let mailSubject = 'Mail Verification';
    const randomToken = randomstring.generate();
    let content = `<p>Hi ${username}, 
    Please <a href="http://localhost:3000/mail-verification?username=${username}&token=${randomToken}"> Verify </a> your email.</p>`;    
    sendMail(email, mailSubject, content);

    await sequelize.query(
      'UPDATE users SET token = :token WHERE email = :email',
      {
        replacements: { token: randomToken, email: email },
        type: sequelize.QueryTypes.UPDATE
      }
    );
    // Send a success response
    return res.status(201).json({
        message: "User created successfully",
        user: modifiedUserResponse,
      });

    } catch (error) {
        // Handle errors
        console.error("Error creating user:", error);
        return res.status(500).json({
            message: error.message
          });
        }
  }
};

exports.signin = (req, res) => {
  User.findOne({
    include: [{ model: db.tbl_role }],
    where: {
      email: req.body.email,
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
      console.log("role====", user,"\nrefreshtoken",refreshToken);

      const authorities = user.role.name.toUpperCase();
      console.log("rolesquh==",user.role.name.toUpperCase(),authorities)

      res.status(200).send({
        msg: "Logged In",
        user: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role_id: user.role_id,
        active: user.active,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
        image: user.image
        }
      });
    }).catch((err) => {
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

    console.log("refreshtoken===", refreshToken.id);

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
    const userId = req.userId;
console.log("userId==",userId)
    // Delete all refresh tokens associated with the user
    await RefreshToken.destroy({
      where: { userId: userId }
    });

    // Destroy the session
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!",
    });
  } catch (err) {
    this.next(err);
  }
};

exports.getUser = async (req, res) => {
  try {
  const authToken = req.headers.authorization.split(' ')[1];
  // const authToken = req.headers["x-access-token"];
  console.log("auth===",authToken)
    if (!authToken) {
      return res.status(401).send({ success: false, message: "No token provided!" });
    }
  const decode = jwt.verify(authToken, config.secret);

  const user = await sequelize.query(`SELECT * FROM users where id = :id`,
    {
      replacements: { id: decode.id },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  
  if (!user.length) {
    return res.status(404).send({ success: false, message: "User not found" });
  }

  return res.status(200).send({ success: true, data: user[0], message: "Fetch Successfully!" });
} catch (error) {
  console.error('Error fetching user:', error);
  return res.status(500).send({ success: false, message: "Internal server error" });
}

};

exports.updateProfile = async (req, res) => {

  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const authToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(authToken, config.secret);

    var sql = '',data;

    // if( req.file != undefined){
    //   sql = `UPDATE users SET name = ? , email = ?, image = ?, where id=?`;
    //   data = [req.body.username, req.body.email, 'upload/' + req.file.filename, decode.id]
    // }
    // else{
    //   sql = `UPDATE users SET name = ? , email = ? where id=?`;
    //   data = [req.body.username, req.body.email, decode.id]
    // }

    // db.query(sql, data, function(error, result, fields){
    //   if(error){
    //     res.status(400).send({msg: error});
    //   }
    //   res.status(200).send({msg: "Profile Updated Successfully!"});
    // });
    if (req.file !== undefined) {
      sql = `UPDATE users SET username = :username, email = :email, image = :image WHERE id = :id`;
      data = { username: req.body.username, email: req.body.email, image: '/upload/' + req.file.filename, id: decoded.id };
    } else {
      sql = `UPDATE users SET username = :username, email = :email WHERE id = :id`;
      data = { username: req.body.username, email: req.body.email, id: decoded.id };
    }
  
    await sequelize.query(sql, { replacements: data, type: sequelize.QueryTypes.UPDATE });
    res.status(200).send({ msg: "Profile Updated Successfully!" });
  }catch(error){
    return res.status(400).json({ msg : error.message });
  }
};