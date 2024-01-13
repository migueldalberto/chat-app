export default class Message {
  createdAt: number;

  constructor(private author: string, private content: string) {
    this.createdAt = new Date().getTime()
  }
}
