const { check } = require("express-validator");

exports.signUpValidation = [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please enter a valid mail').isEmail().normalizeEmail({ gmail_remove_dots:true }),
    check('password', 'Password is required at least 6 digits').isLength({ min:6 })
]