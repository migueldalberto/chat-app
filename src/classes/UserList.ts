import User from './User'

export default class UserList {
  private users: User[];

  constructor () {
	this.users = [];
  }

  public getUsers(): User[] {
    return this.users
  }

  public getUsersInRoom(room: string): User[] {
    return this.users.filter((user) => user.getRoomName() === room)
  }

  public getUserById(id: string) {
    const index = this.users.findIndex((u) => u.getId() === id)

    if(index !== -1) {
      return this.users[index]
    }
  }

  public addUser(user: User): User {
    this.users.push(user)
    return user;
  }

  public total(): number {
    return this.users.length
    
  }

  public removeUser(id: string) {
    const index = this.users.findIndex((user) => user.getId() === id)

    if (index !== -1) {
      return this.users.splice(index, 1)[0]
    }
  }
}
