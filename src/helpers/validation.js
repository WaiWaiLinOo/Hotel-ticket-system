const { check } = require("express-validator");

exports.signUpValidation = [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please enter a valid mail').isEmail().normalizeEmail({ gmail_remove_dots:true }),
    check('password', 'Password is required at least 6 digits').isLength({ min:6 }),
    check('image').custom( (value, {req}) => {
        if(req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png'){
            return true;
        }
        else{
            return false;
        }
    }).withMessage('Please upload an image type PNG, JPEG')
]

exports.updateProfileValidation = [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please enter a valid mail').isEmail().normalizeEmail({ gmail_remove_dots:true }),
]