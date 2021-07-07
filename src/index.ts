require('dotenv').config()
const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

import { createMessage } from './utils/messages'
import { User, UserList } from './utils/users'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// serving public directory
app.use(express.static(path.join(__dirname, '../public')))

// start tracking users
const usersOnline = new UserList()

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const user = usersOnline.removeUser(socket.id)
    if(user) {
      io.to(user.getRoom()).emit('message', createMessage('SYSTEM', `${user.getNickname()} has left.`))

      io.to(user.getRoom()).emit('room data', {
        room: user.getRoom(),
        users: usersOnline.getUsersInRoom(user.getRoom())
      })
    }
  })

  socket.on('message', (message, cb) => {
    const user = usersOnline.getUserById(socket.id)
    io.to(user.getRoom()).emit('message', createMessage(user.getNickname(), message))

    cb(undefined, 'message sent')
  })

  socket.on('join', (options: { nickname: string, room: string }, cb: (arg0: { error: string }, arg1: User) => any) => {
    if(!options.nickname || !options.room)return cb({ error: 'invalid room or nickname'}, undefined)

    const user = new User(socket.id, options.nickname, options.room)
    usersOnline.addUser(user)

    socket.join(user.getRoom())

    socket.broadcast.to(user.getRoom()).emit('message', createMessage('SYSTEM', `${user.getNickname()} has joined.`))
    io.to(user.getRoom()).emit('room data', {
      room: user.getRoom(),
      users: usersOnline.getUsersInRoom(user.getRoom())
    })

    cb(undefined, user)
  })
})

// listenning to port
const port = process.env.PORT || 3000 
server.listen(port, () => {
  console.log('server is on: ' + port)
})