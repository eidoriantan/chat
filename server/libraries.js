
const express = require('express')
const router = express.Router()

router.use('/@primer/css/', express.static('node_modules/@primer/css/dist'))
router.use('/jquery/', express.static('node_modules/jquery/dist'))
router.use('/socket.io/', express.static('node_modules/socket.io-client/dist'))

module.exports = router
