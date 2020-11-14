
const router = require('express').Router()
const userRegex = /^([a-z0-9-_]+)/i

router.use((req, res, next) => {
  res.locals.requireUser = () => {
    return typeof req.session.name !== 'undefined' ? req.session.name : null
  }

  next()
})

module.exports = router
module.exports.userRegex = userRegex
