export class Message {
  createdAt: number;

  constructor(private author: string, private content: string) {
    this.createdAt = new Date().getTime()
  }
}

export const createMessage = (author: string, content: string): Message => new Message(author, content)