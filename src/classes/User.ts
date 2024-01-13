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
