export class User {
  constructor(private id: string, private nickname: string, private room: string) {
    this.nickname = nickname.trim().toLocaleLowerCase()
    this.room = room.trim().toLowerCase()
  }

  /**
   * @returns the room where the user is active
   */
  public getRoom(): string {
    return this.room
  }

  /**
   * @returns the user's nickname
   */
  public getNickname(): string {
    return this.nickname
  }

  /**
   * @returns the user's id
   */
  public getId(): string {
    return this.id
  }
}

const users: User[] = []

export const addUser = ({ id , nickname, room }: { id: string; nickname: string; room: string}): any => {
  // clean data
  nickname = nickname.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // validate data
  // check if data exists
  if(!nickname || !room) {
    return { error: 'Nickname and room are required.' }
  }
  // check if nicknames is taken
  const isNicknameTaken = users.find((user) => user.getRoom() === room && user.getNickname() === nickname)
  if(isNicknameTaken) {
    return { error: 'Nickname is taken. Try another one.' }
  }

  // store user
  const user = new User(id, nickname, room)
  users.push(user)
  return { user }
}

export const removeUser = (id: string): User => {
  const index = users.findIndex((user) => user.getId() === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

export const getUsersInRoom = (room) => users.filter((user) => user.getRoom() === room)
