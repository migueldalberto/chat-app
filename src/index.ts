require('dotenv').config()
const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

import { createMessage } from './utils/messages'
import { addUser, removeUser, getUsersInRoom, User, ErrorMessage } from './utils/users'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// serving public directory
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if(user) {
      io.to(user.getRoom()).emit('message', createMessage('SYSTEM', `${user.getNickname()} has left.`))

      io.to(socket.room).emit('room data', {
        room: socket.room,
        users: getUsersInRoom(socket.room)
      })
    }
  })

  socket.on('message', (message, cb) => {
    io.to(socket.room).emit('message', createMessage(socket.nickname, message))

    cb(undefined, 'message sent')
  })

  socket.on('join', (options, cb) => {
    const res = addUser({ id: socket.id, ...options })
    if(res.error)return cb(res.error, undefined) 
    const { user } = res;

    socket.join(user.getRoom())
    socket.nickname = user.getNickname()
    socket.room = user.getRoom()

    socket.broadcast.to(socket.room).emit('message', createMessage('SYSTEM', `${socket.nickname} has joined.`))
    io.to(socket.room).emit('room data', {
      room: socket.room,
      users: getUsersInRoom(socket.room)
    })

    cb(undefined, user)
  })
})

// listenning to port
const port = process.env.PORT || 3000 
server.listen(port, () => {
  console.log('server is on: ' + port)
})