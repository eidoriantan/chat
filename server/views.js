
const router = require('express').Router()
const security = require('./security.js')

router.use(security)

router.get('/', async (req, res) => {
  const user = res.locals.requireUser()
  if (user !== null) res.render('home', { name: user })
  else res.redirect('/login')
})

router.get('/login', (req, res) => {
  if (req.session.populated) res.redirect('/')
  else res.render('login', { title: 'Sign In' })
})

router.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/login')
})

module.exports = router
