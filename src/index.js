const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

const { createMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// serving public directory
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
  socket.nickname = 'anonymous'

  socket.on('disconnect', () => {
    io.to().emit('message', createMessage('SYSTEM', `${socket.nickname} has left.`))
  })

  socket.on('message', (message, cb) => {
    io.emit('message', createMessage(socket.nickname, message))

    cb(undefined, 'message sent')
  })

  socket.on('join', ({ nickname, room }, cb) => {
    socket.join(room)
    socket.nickname = nickname

    socket.broadcast.to(room).emit('message', createMessage('SYSTEM', `${socket.nickname} has joined.`))
  })
})

// listenning to port
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log('server is on: ' + port)
})