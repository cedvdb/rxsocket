import { Subject } from 'rxjs';
import { Action } from '~shared/action.interface';
import { Bridge } from './bridge.interface';
import WebSocket from 'ws';

export class WsBridge implements Bridge {
  private socket!: WebSocket;
  private timeout = 100;
  private _connection$ = new Subject<WebSocket.OpenEvent>();
	private _error$ = new Subject<WebSocket.ErrorEvent>();
  private _close$ = new Subject<WebSocket.CloseEvent>();
  /** message received parsed */
  private _action$ = new Subject<Action>();

  connection$ = this._connection$.asObservable();
	action$ = this._action$.asObservable();
	error$ = this._error$.asObservable();
	close$ = this._close$.asObservable();

  constructor(private url: string) {
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = event => this._connection$.next(event);
    this.socket.onclose = event => {
      this.timeout = Math.min(this.timeout * 2, 10000);
      setTimeout(() => this.connect(), this.timeout);
      this._close$.next(event);
    };
    this.socket.onmessage = event => {
      const actionItem = {
        ...JSON.parse(event.data.toString()),
        react: (action: Action) => this.socket.send(JSON.stringify(action))
      };
      this._action$.next(actionItem);
    }
    this.socket.onerror = event => {
      this._error$.next(event);
      this.socket.close();
    };

  }

}