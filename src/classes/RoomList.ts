import Room from './Room'
import User from './User'

export default class RoomList {
	private rooms: Room[]

	constructor() {
		this.rooms = []
	}

	public getRoom (roomName: string): Room | undefined {
		return this.rooms.find(el => el.getRoomName() === roomName) 
	}

	public newRoom (room: Room): void {
		this.rooms.push(room)
	}

	public removeRoom (roomName: string): void {
		const index = this.rooms.findIndex((r) => r.getRoomName() === roomName)

		if (index !== -1) {
			this.rooms.splice(index, 1)
		}
	}
	
	public getNames (): string[] {
		let names: string[] = []

		this.rooms.forEach (el => names.push(el.getRoomName()))

		return names
	}

	public removeUserFromRoom(roomName: string, user: User): void { 
		const index = this.rooms.findIndex((r) => r.getRoomName() === roomName)

		if (index !== -1) {
			this.rooms[index].removeUser(user.getId()) 
		}
	}

}
