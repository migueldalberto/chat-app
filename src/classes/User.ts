export default class User {
  constructor(private id: string, private nickname: string, private roomName: string) {
    this.nickname = nickname.trim().toLocaleLowerCase()
    this.roomName = roomName.trim().toLowerCase()
  }

  /**
   * @returns the room where the user is active
   */
  public getRoomName(): string {
    return this.roomName
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
