
const router = require('express').Router()

router.use('/authorize', require('./routers/authorize.js'))

module.exports = router
