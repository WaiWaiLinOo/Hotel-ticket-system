require("dotenv").config();
const db = require("../config/db_config");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sequelize = db.sequelize;
const { sendForgetPasswordMail, mailTemplate } = require('../helpers/sendMail');
const NumSaltRounds = Number(process.env.NO_OF_SALT_ROUNDS);
const { tbl_user: User, resetToken : ResetToken } = db;


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("email==",email)
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        console.log("Received email: ", email);

        const user = await User.findOne({
            where: { email },
        });
        console.log("user===",user.id)
        if (!user || user.length === 0) {
          res.json({
            success: false,
            message: "Your are not registered!",
          });
        } else {
          const token = crypto.randomBytes(20).toString("hex");
          const resetToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
          await ResetToken.create({
            user_id: user.id,
            token: resetToken,
            created_at: new Date(),
            expires_at: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day expiration
          });
    
          const mailOption = {
            email: email,
            subject: "Forgot Password Link",
            message: mailTemplate(
              "We have received a request to reset your password. Please reset your password using the link below.",
              `${process.env.FRONTEND_URL}/resetPassword?id=${user.id}&token=${resetToken}`,
              "Reset Password"
            ),
          };
          await sendForgetPasswordMail(mailOption);
          res.json({
            success: true,
            message: "A password reset link has been sent to your email.",
          });
        }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, token, userId } = req.body;
    console.log("req===",req.body)
    // Fetch the most recent reset token for the user
    const userToken = await ResetToken.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (!userToken) {
      return res.json({
        success: false,
        message: 'Some problem occurred!',
      });
    }

    const currDateTime = new Date();
    const expiresAt = new Date(userToken.expiresAt);

    if (currDateTime > expiresAt) {
      return res.json({
        success: false,
        message: 'Reset Password link has expired!',
      });
    }

    if (userToken.token !== token) {
      return res.json({
        success: false,
        message: 'Reset Password link is invalid!',
      });
    }

    // Delete the used reset token
    await ResetToken.destroy({ where: { userId } });

    // Hash the new password
    const salt = await bcrypt.genSalt(NumSaltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    return res.json({
      success: true,
      message: 'Your password reset was successful!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.',
    });
  }
};
