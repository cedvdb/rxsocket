import { Action } from '~shared/action.interface';
import { RxBridge } from '../bridge/rx-bridge.interface';
import { Connection } from '../rx-socket/connection.interface';
import { log } from '../utils/log';

export class RoomContainer {
	onlineUsers = new Map<number, Connection>(); // Online users is one big room
	rooms = new Map<string, Map<number, Connection>>(); // <roomname, <connectionid, connection>>

	constructor(socket: RxBridge) {
    socket.connection$
      .subscribe(connection => this.addUser(connection));
    socket.close$
      .subscribe(connection => this.removeUser(connection));
  }


	/** adds user to list of active users */
	private addUser(connection: Connection) {
		connection.rooms = new Map<string, any>();
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
			room = new Map<number, Connection>();
			this.rooms.set(roomname, room);
		}
		room.set(connection.id, connection);
		connection.rooms!.set(roomname, room);
		log.debug(`adding user to room ${roomname}, ${room.size} in room`)	;
	}

  /**
   * Removes user from room
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

  broadcast(action: Action, omit?: Connection[], roomname?: string): void {
    const room = roomname === undefined ?
      this.onlineUsers : this.rooms.get(roomname);

    if (!room) {
      return log.debug(`broadcasting to room ${roomname} but it doesn't exist. Doing nothing.`);
    }

    room.forEach(connection => {
      // if it's not omited we dispatch
			if (!omit || !omit.find(omitedConn => omitedConn.id === connection.id)) {
				connection.dispatch(action);
      }
    });
  }
}

