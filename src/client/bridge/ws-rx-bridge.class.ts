import { Subject } from 'rxjs';
import WebSocket from 'ws';
import { Action, ActionEvent } from 'src/shared/action.interface';
import { RxBridge } from './rx-bridge.interface';

export class WsRxBridge implements RxBridge {
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

      if (event.code !== 1000) {
        setTimeout(() => this.connect(), this.getMaxedTimeout());
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
      setTimeout(() => this.dispatch(action), this.getMaxedTimeout())
    }
  }

  /** closes the socket, will reconnect if the code is anything else than 1000 (default)
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
   */
  close(code?: number): any {
    const retry = new Promise(resolve => {
      setTimeout(() => resolve(this.close(code)), 50)
    });
    switch (this.socket.readyState) {
      case 0: // opening
        return retry;
      case 1: // opened
        this.socket.close(code);
        return retry
      case 2: // closing
        return retry;
      case 3: // closed
        return Promise.resolve();
    }

  }

  private getMaxedTimeout() {
    this.timeout = Math.min(this.timeout * 2, 10000);
    return this.timeout;
  }

}