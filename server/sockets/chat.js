
const security = require('../security.js')

async function initialize (socket) {
  const id = socket.id.split('#')[1]
  const name = socket.request.session.name
  const room = socket.handshake.query.room

  if (typeof name === 'undefined') {
    socket.emit('error', 'No name')
    socket.disconnect(true)
    return
  }

  if (!name.match(security.userRegex)) {
    socket.emit('error', 'Invalid name')
    socket.disconnect(true)
    return
  }

  if (typeof room === 'undefined') {
    socket.emit('error', 'Invalid room')
    socket.disconnect(true)
    return
  }

  const user = { name, id }
  socket.join(room)
  socket.emit('join', user)
  socket.to(room).emit('join', user)

  socket.on('disconnect', () => {
    socket.to(room).emit('leave', user)
  })

  socket.on('send', (message) => {
    const data = { ...user, message }
    socket.emit('message', data)
    socket.to(room).emit('message', data)
  })
}

module.exports = (io) => {
  io.of('/chat').on('connection', initialize)
}
