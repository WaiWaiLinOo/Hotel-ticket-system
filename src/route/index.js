const router = require('express').Router()
const hotel = require('./hotel.route')
const auth = require('./auth.routes')
const user = require('./user.routes')
router.use('/hotel',hotel)
router.use('/login',auth)
router.use('/user',user)
module.exports = router