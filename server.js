
const http = require('http')
const express = require('express')
const exphbs = require('express-handlebars')
const cookieSession = require('cookie-session')
const socketio = require('socket.io')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
let server = null

const session = cookieSession({
  name: process.env.SESSION_NAME || 'chat',
  secret: process.env.SESSION_SECRET || 'secret',
  maxAge: 86400000
})

const hbs = exphbs.create({ defaultLayout: 'main' })
const app = express()

const libraries = require('./server/libraries.js')
const views = require('./server/views.js')
const routers = require('./server/routers.js')

async function start () {
  app.use(session)

  app.engine('handlebars', hbs.engine)
  app.set('view engine', 'handlebars')

  app.use('/', express.static('public'))
  app.use('/libs', libraries)
  app.use('/', views)
  app.use('/', routers)

  server = http.createServer(app)
  server.listen(port, host, () => {
    const address = server.address()
    const io = socketio(server, { path: '/sockets' })
    io.use((socket, next) => {
      session(socket.request, socket.request.res || {}, next)
    })

    require('./server/sockets/chat.js')(io)
    console.log(`Server: ${address.address}:${address.port} ready`)
  })
}

async function exit (code = 0) {
  if (server !== null) server.close()
  process.exit(code)
}

process.on('exit', exit)
process.on('SIGTERM', exit)
process.on('SIGINT', exit)

start().then(() => {
  console.log('Ready')
})
