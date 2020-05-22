
import { Observable } from 'rxjs';
import { Router } from '../router/router.class';
import { LogLevel } from 'simply-logs';
import { Action, ActionEvent } from 'src/shared/action.interface';
import { Route } from 'src/shared/route.interface';
import { RxBridge } from '../bridge/rx-bridge.interface';
import { WsRxBridge } from '../bridge/ws-rx-bridge.class';
import { RoomContainer } from '../room-container/room-container';
import { log } from '../utils/log';
import { Printer } from '../utils/printer.class';
import { Connection } from './connection.interface';
import { Options } from './options.interface';


// Api Facade, this class is an aglomeration of other classes handling the background logic and only exposes
// to the external world what's needed

// RxBridge which is responsible of converting a websocket implementation into an rxjs version to use it here
// Room Container is responsible of handling the room system as well as online users which is one big room
// Router which is responsible for selecting and incoming messagestreams

/**
 * RxSocket a reactive websocket
 */
export class RxSocket {
  private rxBridge: RxBridge;
  private roomContainer: RoomContainer;
  private router: Router;

  constructor(options?: Options) {
    log.setLogLevel(options?.rxSocket?.logLevel || LogLevel.DEBUG);
    this.rxBridge = new WsRxBridge(options);
    this.router = new Router(this.rxBridge.received$);
    Printer.printEnv();
    Printer.printLogo(this.rxBridge.address);
    this.roomContainer = new RoomContainer(this.rxBridge);
    Printer.printEvents(this.rxBridge, this.onlineUsers);
  }

  ////////////
  // Router //
  ////////////

  /**
   * To listen to specific action type stream
   * @param type action type you want to select
   */
  select(type: string): Observable<ActionEvent> {
    return this.router.select(type);
  }

  /**
   * To listen to specific action type,
   * the difference with select is that this will
   * log a table of all the routes selected when called
   * and will subscribe automatically.
   * @param routes all the type with their handler
   */
  route(routes: Route[]): void {
    return this.router.route(routes);
  }

  ///////////
  // rooms //
  ///////////

  /**
   * Dispatch an action to all clients
   * @param action action sent
   * @param roomname if a room name is specified it will send to the client
   * in that room only
   * @param omit users to which we don't desire to send the action, for example
   * we might want to broadcast a message to everyone except the sender
   */
  broadcast(action: Action, omit?: Connection[], roomname?: string): void {
    return this.roomContainer.broadcast(action, omit, roomname);
  }

  /**
   * Add an user to a room,
   * will create a room if it doesn't exist
   * will close room when there is no more connections
   * @param roomname the roomname
   * @param connection the connection we want to add
   */
  addToRoom(roomname: string, connection: Connection): void{
    this.roomContainer.addToRoom(roomname, connection);
  }

  /**
   * Removes user from room
   * Will destroy room if there is no user left.
   * @param roomname the roomname
   * @param connection the connection we want to remove
   */
  removeFromRoom(roomname: string, connection: Connection): void{
    this.roomContainer.removeFromRoom(roomname, connection);
  }

  /** a map of online users */
  get onlineUsers () { return this.roomContainer.onlineUsers; }

  /** a map of rooms */
  get rooms () { return this.roomContainer.rooms; }

  ///////////////
  // rx bridge //
  ///////////////

  /** when client connects */
  get connection$ () { return this.rxBridge.connection$ }

  /** when client closes connection */
  get close$ () { return this.rxBridge.close$ }

  /** when an error occurs */
  get error$ () { return this.rxBridge.error$ }

  /** actions received */
  get received$ () { return this.rxBridge.received$ }

  /** actions sent */
  get dispatched$ () { return this.rxBridge.dispatched$ }

  /** closes server */
  close() {
    return this.rxBridge.close();
  }

}