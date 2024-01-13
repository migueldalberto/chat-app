import User from './User'
import UserList from './UserList'

export default class Room extends UserList {
  private name: string;

  constructor(name: string) {
    super()

    this.name = name;
  }

  /**
   * getRoomName
   * @returns room name
   */
  public getRoomName(): string {
    return this.name
  }
}
