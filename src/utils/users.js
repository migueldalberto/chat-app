const users = []

const addUser = ({ id, nickname, room }) => {
  // clean data
  nickname = nickname.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // validate data
  // check if data exists
  if(!nickname || !room) {
    return { error: 'Nickname and room are required.' }
  }
  // check if nicknames is taken
  const isNicknameTaken = users.find((user) => user.room === room && user.nickname === nickname)
  if(isNicknameTaken) {
    return { error: 'Nickname is taken. Try another one.' }
  }

  // store user
  const user = {id, nickname, room}
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom
}