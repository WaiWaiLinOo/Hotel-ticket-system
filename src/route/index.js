const router = require('express').Router()
const test = require('./test.route')
router.use('/test',test)
module.exports = router