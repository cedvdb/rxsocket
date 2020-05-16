import { Subject } from 'rxjs';
import WebSocket from 'ws';
import { Connection } from '../core/connection.interface';
import { HttpServer } from '../server/http-server.type';
import { Bridge } from './bridge.interface';
import { Action } from '../../../shared';

export class WsSocketBridge implements Bridge {
  private static connectionID = 0;
  private wsServer: WebSocket.Server;
	private _open$ = new Subject<Connection>();
	private _error$ = new Subject<Error>();
  private _close$ = new Subject<Connection>();
  /** message received parsed */
  private _action$ = new Subject<Action>();

  open$ = this._open$.asObservable();
	action$ = this._action$.asObservable();
	error$ = this._error$.asObservable();
	close$ = this._close$.asObservable();

  constructor(server: HttpServer, options: WebSocket.ServerOptions) {
    this.wsServer =  new WebSocket.Server({ server, ...options });
    this.addObservables();
  }

  private addObservables() {
    this.wsServer.on('connection', (socketConnection) => {
			// using int instead of uuid 
			const connectionID = WsSocketBridge.connectionID++ % 2000000000;
      const connection: Connection = { 
        connectionID,
        dispatch: (action: Action) => socketConnection.send(action)
      };
      socketConnection.on('close', () => this._close$.next(connection));
      socketConnection.on('error', (e) => this._error$.next(e));
      socketConnection.on('message', (msg: string) => {
        this._action$.next({ 
          ...JSON.parse(msg), 
          react: connection.dispatch 
        });
      });
      this._open$.next(connection);
    });
  }

}