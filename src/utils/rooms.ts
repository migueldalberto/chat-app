import { User } from '../classes/User'
import { UserList } from './users'

export class Room extends UserList {
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
