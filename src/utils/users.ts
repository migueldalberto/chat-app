import { User } from "../classes/User"

export class UserList {
  private users: User[];

  public getUsers(): User[] {
    return users
  }

  public getUsersInRoom(room: string): User[] {
    return users.filter((user) => user.getRoom() === room)
  }

  public getUserById(id: string) {
    const index = users.findIndex((u) => u.getId() === id)

    if(index !== -1) {
      return users[index]
    }
  }

  public addUser(user: User): User {
    users.push(user)
    return user;
  }

  public total(): number {
    return users.length
    
  }

  public removeUser(id: string) {
    const index = users.findIndex((user) => user.getId() === id)

    if (index !== -1) {
      return users.splice(index, 1)[0]
    }
  }
}

const users: User[] = []
