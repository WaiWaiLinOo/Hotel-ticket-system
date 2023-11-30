const router = require('express').Router()
const hotel = require('./hotel.route')
router.use('/hotel',hotel)
module.exports = router