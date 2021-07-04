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
  socket.broadcast.emit('user joined')
  socket.nickname = 'anonymous'

  socket.on('disconnect', () => {
    socket.broadcast.emit('user left')
  })

  socket.on('chat message', (message) => {
    io.emit('chat message', { author: socket.nickname, content: message })
  })

  socket.on('set nickname', (nickname) => {
    socket.nickname = nickname
  })
})

// listenning to port
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log('server is on: ' + port)
})