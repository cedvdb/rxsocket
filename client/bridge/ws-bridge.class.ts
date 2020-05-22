import { Subject } from 'rxjs';
import WebSocket from 'ws';
import { Action, ActionEvent } from '~shared/action.interface';
import { Bridge } from './bridge.interface';

export class WsBridge implements Bridge {
  private socket!: WebSocket;
  private timeout = 50;
  private _connection$ = new Subject<WebSocket.OpenEvent>();
	private _error$ = new Subject<WebSocket.ErrorEvent>();
  private _close$ = new Subject<WebSocket.CloseEvent>();
  private _received$ = new Subject<ActionEvent>();
  private _dispatched$ = new Subject<Action>();

  connection$ = this._connection$.asObservable();
	error$ = this._error$.asObservable();
	close$ = this._close$.asObservable();
	received$ = this._received$.asObservable();
  dispatched$ = this._dispatched$.asObservable();

  constructor(private url: string) {
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = event => this._connection$.next(event);
    this.socket.onclose = event => {
      console.log('closed ', event.code, event.reason)

      if (event.code !== 1000) {
        this.timeout = Math.min(this.timeout * 2, 10000);
        setTimeout(() => this.connect(), this.timeout);
      }
      this._close$.next(event);
    };
    this.socket.onmessage = event => {
      const actionEvent = {
        ...JSON.parse(event.data.toString()) as Action,
        dispatch: (action: Action) => this.dispatch(action)
      };
      this._received$.next(actionEvent);
    }
    this.socket.onerror = event => {
      this._error$.next(event);
      this.socket.close();
    };
  }

  dispatch(action: Action): void {
    if (this.socket.readyState === 1) {
      this.socket.send(JSON.stringify(action));
      this._dispatched$.next(action);
    } else {
      this.timeout = Math.min(this.timeout * 2, 10000);
      setTimeout(() => this.dispatch(action), this.timeout)
    }
  }

  /** closes the socket, will reconnect if the code is anything else than 1000 (default)
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
  */
  close(code = 1000) {
    this.socket.close(code);
  }

}