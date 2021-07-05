const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// serving public directory
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
  socket.broadcast.emit('message', { author: 'CHAT', content: 'A user has joined.'})
  socket.nickname = 'anonymous'

  socket.on('disconnect', () => {
    io.emit('message', { author: 'CHAT', content: `${socket.nickname} has left.`})
  })

  socket.on('message', (message, cb) => {
    io.emit('message', { author: socket.nickname, content: message })

    cb(undefined, 'message sent')
  })

  socket.on('set nickname', (nickname, cb) => {
    socket.nickname = nickname

    cb(undefined, `nickname set to: ${socket.nickname}`)
  })
})

// listenning to port
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log('server is on: ' + port)
})