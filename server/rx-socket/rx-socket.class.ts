
import log from 'loglevel';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, ActionEvent } from '~shared/action.interface';
import { Route } from '~shared/route.interface';
import { RxBridge } from '../bridge/rx-bridge.interface';
import { WsRxBridge } from '../bridge/ws-rx-bridge.class';
import { RoomContainer } from '../room-container/room-container';
import { Printer } from '../utils/printer.class';
import { Connection } from './connection.interface';
import { Options } from './options.interface';

export class RxSocket {
  private socket: RxBridge;
  private userContainer: RoomContainer;

  constructor(options?: Options) {
    this.socket = new WsRxBridge(options);
    Printer.printEnv();
    Printer.printLogo(this.socket.address);
    Printer.printEvents(this.socket);
    this.userContainer = new RoomContainer(this.socket);
  }

  /**
   * To listen to specific action type
   * @param type action type you want to select
   */
  select(type: string): Observable<ActionEvent> {
    log.info(`${type} selected`);
    return this.received$.pipe(
      filter(event => event.type === type),
    );
  }

  /**
   * To listen to specific action type,
   * the difference with select is that this will
   * log a table of all the routes selected when called
   * and will subscribe automatically.
   * @param routes all the type with their handler
   */
  route(routes: Route[]): RxSocket {
    routes.forEach(route => {
      // not using this.select because we don't need the log
      this.received$.pipe(
        filter(({ type }) => type === route.type),
      ).subscribe(actionEvent => route.handler(actionEvent));
    });
    Printer.printRoutes(routes);
		return this;
  }

  /**
   * Dispatch an action to all clients
   * @param action action sent
   * @param roomname if a room name is specified it will send to the client
   * in that room only
   * @param omit users to which we don't desire to send the action, for example
   * we might want to broadcast a message to everyone except the sender
   */
  broadcast(action: Action, omit?: Connection[], roomname?: string): RxSocket {
    const room = roomname === undefined ?
      this.userContainer.onlineUsers : this.userContainer.rooms.get(roomname);

    if (!room) {
      log.debug(`broadcasting to room ${roomname} but it doesn't exist. Doing nothing.`);
      return this;
    }

    room.forEach(connection => {
      // if it's not omited we dispatch
			if (!omit || omit.find(omitedConn => omitedConn.id === connection.id)) {
				connection.dispatch(action);
      }
    });

    return this;
  }


  ///////////
  // rooms //
  ///////////

  /**
   * Add an user to a room,
   * will create a room if it doesn't exist
   * will close room when there is no more connections
   * @param roomname the roomname
   * @param conn the connection we want to add
   */
  addToRoom(roomname: string, connection: Connection): RxSocket{
    this.userContainer.addToRoom(roomname, connection);
    return this;
  }

  removeFromRoom(roomname: string, connection: Connection): RxSocket{
    this.userContainer.removeFromRoom(roomname, connection);
    return this;
  }

  get onlineUsers () { return this.userContainer.onlineUsers; }

  get rooms () { return this.userContainer.rooms; }

  ///////////////
  // rx bridge //
  ///////////////

  /** when client connects */
  get connection$ () { return this.socket.connection$ }

  /** when client closes connection */
  get close$ () { return this.socket.close$ }

  /** when an error occurs */
  get error$ () { return this.socket.error$ }

  /** actions received */
  get received$ () { return this.socket.received$ }

  /** actions sent */
  get dispatched$ () { return this.socket.dispatched$ }

  close() {

  }

}