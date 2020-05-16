import { Subject } from 'rxjs';
import { WebsocketBridge } from '../bridges/websocket-bridge.interface';
import { Connection } from '../models/connection.interface';
import { ActionEvent } from './action-event.interface';

export class SocketEventHandler {
  private static connectionID = 0;
	private _connection$ = new Subject<Connection>();
	private _error$ = new Subject<Error>();
  private _close$ = new Subject<Connection>();
  /** message received parsed */
  private _action$ = new Subject<ActionEvent>();

  connection$ = this._connection$.asObservable();
	action$ = this._action$.asObservable();
	error$ = this._error$.asObservable();
	close$ = this._close$.asObservable();

  constructor(private bridge: WebsocketBridge) {
    this.addEventHandlers();
  }

  private addEventHandlers() {
    this.bridge.onConnection((socket) => {
			// using int instead of uuid 
			const connectionID = SocketEventHandler.connectionID++ % 2000000000;
      const connection: Connection = { connectionID, socket };
      
      this.bridge.onError(connection, (e) => this._error$.next(e));
      this.bridge.onClose(connection, () => this._close$.next(connection));
      this.bridge.onMessage(
        connection, 
        (message) => this.onMessage(message, connection)
      );
      this._connection$.next(connection);
    });
  }

  onMessage(message: string, connection: Connection) {
    const action = JSON.parse(message);
    this._action$.next({ connection, action });
  }

}