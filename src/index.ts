const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

import Message from './classes/Message'
import User from './classes/User'
import UserList from './classes/UserList'
import Room from './classes/Room'
import RoomList from './classes/RoomList'

interface JoinOptions {
  nickname: string,
  room: string
}

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// serving public directory
app.use(express.static(path.join(__dirname, '../public')))

// start tracking users and rooms
const usersOnline = new UserList()
const activeRooms = new RoomList()

io.on('connection', (socket) => {
  socket.emit('active rooms', activeRooms.getNames())

  socket.on('disconnect', () => {
    const user = usersOnline.removeUser(socket.id)

    if(user) {
      const roomName = user.getRoomName()
      io.to(roomName).emit('message', new Message('SYSTEM', `${user.getNickname()} has left.`))

	  activeRooms.removeUserFromRoom(roomName, user)

	  if (activeRooms.getRoom(roomName)?.total() === 0) {
		  activeRooms.removeRoom(roomName)
		  socket.emit('active rooms', activeRooms.getNames())
	  }

      io.to(roomName).emit('room data', {
        room: user.getRoomName(),
        users: usersOnline.getUsersInRoom(user.getRoomName())
      })
    }
  })

  socket.on('message', (messageBody, cb) => {
    const user = usersOnline.getUserById(socket.id)
    io.to(user.getRoomName()).emit('message', new Message(user.getNickname(), messageBody))

    cb(undefined, 'message sent')
  })


  socket.on('join', (options: JoinOptions, cb) => {
    if(!options.nickname || !options.room)return cb({ error: 'invalid room or nickname'}, undefined)

    const user = new User(socket.id, options.nickname, options.room)
    if (usersOnline.getUsers().find((u) => u.getNickname() === user.getNickname())) {
      return cb({ error: 'nickname is taken' }, undefined)
    }

    usersOnline.addUser(user)

	const roomName = user.getRoomName()
    socket.join(roomName)
	activeRooms.getRoom(roomName)

	if (activeRooms.getRoom(roomName) === undefined) {
		activeRooms.newRoom(new Room(roomName))
	}

    socket.broadcast.to(roomName).emit(
		'message', 
		new Message('SYSTEM', `${user.getNickname()} has joined.`)
	)

    io.to(roomName).emit('room data', {
      room: roomName,
      users: usersOnline.getUsersInRoom(roomName)
    })

    cb(undefined, user)
  })
})

// listenning to port
const port = process.env.PORT || 3000 
server.listen(port, () => {
  console.log('server is on: ' + port)
})
