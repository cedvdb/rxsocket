import { Subject } from 'rxjs';
import WebSocket from 'ws';
import { Connection } from '../connection.interface';
import { RxBridge } from './rx-bridge.interface';
import { Action, ActionEvent } from '../../shared/action.interface';
import { AddressInfo } from 'net';

export class WsRxBridge implements RxBridge {
  private static connectionID = 0;
  private wsServer: WebSocket.Server;

	private _connection$ = new Subject<Connection>();
	private _error$ = new Subject<Error>();
  private _close$ = new Subject<Connection>();
  private _received$ = new Subject<ActionEvent>();
  private _dispatched$ = new Subject<Action>();

  /** when client connects */
  connection$ = this._connection$.asObservable();
  /** when an error occurs */
  error$ = this._error$.asObservable();
  /** when client closes connection */
  close$ = this._close$.asObservable();
  /** actions received */
	received$ = this._received$.asObservable();
  /** actions sent */
  dispatched$ = this._dispatched$.asObservable()

  constructor(options?: WebSocket.ServerOptions) {
    this.wsServer =  new WebSocket.Server({ ...options });
    this.addObservables();
  }

  private addObservables() {
    this.wsServer.on('connection', (socketConnection) => {

      const dispatch = (action: Action) => {
        socketConnection.send(JSON.stringify(action));
        this._dispatched$.next(action);
      };
      // not using uuid for this
      const connectionID = WsRxBridge.connectionID++ % Number.MAX_SAFE_INTEGER;
      const connection: Connection = { id: connectionID, dispatch };

      socketConnection.on('close', () => this._close$.next(connection));
      socketConnection.on('error', (e) => this._error$.next(e));
      socketConnection.on('message', (msg: string) => {
        this._received$.next({ ...JSON.parse(msg), dispatch });
      });

      this._connection$.next(connection);
    });
  }

  close() {
    this.wsServer.close();
  }

  get address(): AddressInfo | string {
    return this.wsServer.address();
  }

}