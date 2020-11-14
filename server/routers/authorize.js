
const express = require('express')
const security = require('../security.js')

const router = express.Router()
router.use(express.json())

router.post('/', async (req, res) => {
  const { name } = req.body

  if (typeof name === 'undefined') {
    res.status(400).json({ message: 'Invalid request body JSON syntax' })
    return
  }

  if (!name.match(security.userRegex)) {
    res.status(200).json({ message: 'Invalid name' })
    return
  }

  req.session.name = name
  res.status(200).json({ message: 'Valid name' })
})

module.exports = router
