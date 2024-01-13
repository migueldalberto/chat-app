const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

import { User } from './classes/User'

import { createMessage } from './utils/messages'
import { UserList } from './utils/users'
import { Room } from './utils/rooms'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// serving public directory
app.use(express.static(path.join(__dirname, '../public')))

// start tracking users and rooms
const usersOnline = new UserList()
const activeRooms: Room[] = []

io.on('connection', (socket) => {
  socket.emit('active rooms', activeRooms)

  socket.on('disconnect', () => {
    const user = usersOnline.removeUser(socket.id)
    if(user) {
      const room = user.getRoom()
      io.to(room).emit('message', createMessage('SYSTEM', `${user.getNickname()} has left.`))
      const index = activeRooms.findIndex((r) => r.getRoomName() === room)

      if(index !== -1) {
        if(activeRooms[index].total() === 1) {
          activeRooms.splice(index, 1)
        } else {
          activeRooms[index].removeUser(socket.id) 
        }
      }

      io.to(room).emit('room data', {
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
    if (usersOnline.getUsers().find((u) => u.getNickname() === user.getNickname())) {
      return cb({ error: 'nickname is taken' }, undefined)
    }
    usersOnline.addUser(user)

    const room = new Room(user.getRoom())
    socket.join(room.getRoomName())

    const index = activeRooms.findIndex((r) => r.getRoomName() === room.getRoomName())
    if (index === -1) {
      activeRooms.push(room)
    }

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
