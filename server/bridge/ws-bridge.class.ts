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
  /** message received parsed */
  private _action$ = new Subject<ActionEvent>();

  connection$ = this._connection$.asObservable();
	action$ = this._action$.asObservable();
	error$ = this._error$.asObservable();
	close$ = this._close$.asObservable();

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
        dispatch: (action: Action) => socketConnection.send(JSON.stringify(action))
      };
      socketConnection.on('close', () => this._close$.next(connection));
      socketConnection.on('error', (e) => this._error$.next(e));
      socketConnection.on('message', (msg: string) => {
        this._action$.next({
          ...JSON.parse(msg),
          react: connection.dispatch
        });
      });
      this._connection$.next(connection);
    });
  }

}