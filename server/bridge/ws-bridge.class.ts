import { Subject } from 'rxjs';
import WebSocket from 'ws';
import { Connection } from '../core/connection.interface';
import { HttpServer } from '../http-server/http-server.type';
import { Bridge } from './bridge.interface';
import { Action, ActionEvent } from '~shared/action.interface';

export class WsBridge implements Bridge {
  private static connectionID = 0;
  private wsServer: WebSocket.Server;
	private _connection$ = new Subject<Connection>();
	private _error$ = new Subject<Error>();
  private _close$ = new Subject<Connection>();
  private _action$ = new Subject<ActionEvent>();
  private _dispatch$ = new Subject<Action>();
  /** when client connects */
  connection$ = this._connection$.asObservable();
  /** when an error occurs */
  error$ = this._error$.asObservable();
  /** when client closes connection */
  close$ = this._close$.asObservable();
  /** actions received */
	action$ = this._action$.asObservable();
  /** actions sent */
  dispatch$ = this._dispatch$.asObservable()

  constructor(server: HttpServer, options?: WebSocket.ServerOptions) {
    this.wsServer =  new WebSocket.Server({ server, ...options });
    this.addObservables();
  }

  private addObservables() {
    this.wsServer.on('connection', (socketConnection) => {
			// using int instead of uuid
			const connectionID = WsBridge.connectionID++ % 2000000000;
      const connection: Connection = {
        connectionID,
        dispatch: (action: Action) => {
          socketConnection.send(JSON.stringify(action));
          this._dispatch$.next(action);
        }
      };
      socketConnection.on('close', () => this._close$.next(connection));
      socketConnection.on('error', (e) => this._error$.next(e));
      socketConnection.on('message', (msg: string) => {
        this._action$.next({
          ...JSON.parse(msg),
          dispatch: connection.dispatch
        });
      });
      this._connection$.next(connection);
    });
  }

}