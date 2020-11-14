
/* eslint-env jquery */
/* global io */

let errorTemp = null
let joinTemp = null
let leaveTemp = null
let messageTemp = null

function createSocket (room) {
  const form = $('#form-message')
  const messages = $('#messages')
  const socket = io('/chat', {
    path: '/sockets',
    query: { room }
  })

  $('#joined-room-id').text(room)
  socket.on('connect', function () {
    form.find('input, button').removeAttr('disabled')
  })

  socket.on('disconnect', function () {
    form.find('input, button').attr('disabled', true)
  })

  socket.on('error', function (error) {
    const container = $(errorTemp).clone(true, true)
    container.find('[data-temp="message"]').text(error)
    container.find('[data-temp]').removeAttr('data-temp')
    messages.append(container).animate({
      scrollTop: messages[0].scrollHeight - messages[0].clientHeight
    }, 500)
  })

  socket.on('join', function (data) {
    const container = $(joinTemp).clone(true, true)
    container.find('[data-temp="user"]').text(`${data.name}#${data.id}`)
    container.find('[data-temp]').removeAttr('data-temp')
    messages.append(container).animate({
      scrollTop: messages[0].scrollHeight - messages[0].clientHeight
    }, 500)
  })

  socket.on('leave', function (data) {
    const container = $(leaveTemp).clone(true, true)
    container.find('[data-temp="user"]').text(`${data.name}#${data.id}`)
    container.find('[data-temp]').removeAttr('data-temp')
    messages.append(container).animate({
      scrollTop: messages[0].scrollHeight - messages[0].clientHeight
    }, 500)
  })

  socket.on('message', function (data) {
    const container = $(messageTemp).clone(true, true)
    container.find('[data-temp="user"]').text(`${data.name}#${data.id}`)
    container.find('[data-temp="message"]').text(data.message)
    container.find('[data-temp]').removeAttr('data-temp')
    messages.append(container).animate({
      scrollTop: messages[0].scrollHeight - messages[0].clientHeight
    }, 500)
  })

  return socket
}

$(document).ready(function () {
  errorTemp = $('#temp-message-error').prop('content')
  joinTemp = $('#temp-message-join').prop('content')
  leaveTemp = $('#temp-message-leave').prop('content')
  messageTemp = $('#temp-message-user').prop('content')

  let socket = createSocket('public')

  $('#form-message').submit(function (event) {
    event.preventDefault()

    const message = $('#message').val()
    $('#message').val('')
    socket.emit('send', message)
  })

  $('#form-room').submit(function (event) {
    event.preventDefault()
    socket.disconnect()

    const room = $('#room-id').val()
    socket = createSocket(room)
    $('#form-message').trigger('reset')
    $('#messages').text('')
  })
})
