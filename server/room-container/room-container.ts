import { RxBridge } from '../bridge/rx-bridge.interface';
import { Connection } from '../rx-socket/connection.interface';
import { log } from 'simply-logs';

export class RoomContainer {
	onlineUsers = new Map<number, Connection>(); // Online users is one big room
	rooms = new Map<string, Map<number, Connection>>(); // <roomname, <connectionid, connection>>

	constructor(private socket: RxBridge) { }

  listen() {
    this.socket.connection$
      .subscribe(connection => this.addUser(connection));
    this.socket.close$
      .subscribe(connection => this.removeUser(connection));
  }

	/** adds user to list of active users */
	private addUser(connection: Connection) {
		connection.rooms = new Map();
		this.onlineUsers.set(connection.id, connection);
	}

	/** removes user from list of active users */
	private removeUser(connection: Connection) {
    connection.rooms!.forEach((_, k) => this.removeFromRoom(k, connection));
    this.onlineUsers.delete(connection.id);
	}

  /**
   * Add an user to a room,
   * will create a room if it doesn't exist
   * will close room when there is no more connections
   */
	addToRoom(roomname: string, connection: Connection){
		let room = this.rooms.get(roomname);
		// create new room if it does not exist
		if (!room) {
			room = new Map();
			this.rooms.set(roomname, room);
		}
		room.set(connection.id, connection);
		connection.rooms!.set(roomname, room);
		log.debug(`adding user to room ${roomname}, ${room.size} in room`)	;
	}

  /**
   * removes user from room
   * Will destroy room if there is no user left.
   */
	removeFromRoom(roomname: string, connection: Connection){
		const room = this.rooms.get(roomname);
		if (room){
			room.delete(connection.id);
			log.debug(`removing user from room ${roomname}, ${room.size} in room`);
			// remove room if empty
			if(room.size < 1)
				this.rooms.delete(roomname);
		}
		// remove from ser connection too
		connection.rooms!.delete(roomname);
	}
}
