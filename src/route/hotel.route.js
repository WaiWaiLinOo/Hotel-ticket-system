const router = require('express').Router()
const {getAllController} = require('../controller/hotel.controller')
router.get('/all',getAllController)
module.exports = router