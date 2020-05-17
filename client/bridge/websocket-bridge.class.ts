import { Subject } from 'rxjs';
import { Action } from '~shared/action.interface';
import { Bridge } from './bridge.interface';


export class WebSocketBridge implements Bridge {
  private socket!: WebSocket;
  private timeout = 100;
  private _open$ = new Subject<Event>();
	private _error$ = new Subject<Event>();
  private _close$ = new Subject<CloseEvent>();
  /** message received parsed */
  private _action$ = new Subject<Action>();

  open$ = this._open$.asObservable();
	action$ = this._action$.asObservable();
	error$ = this._error$.asObservable();
	close$ = this._close$.asObservable();

  constructor(private url: string) {
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = event => this._open$.next(event);
    this.socket.onclose = event => {
      this.timeout = Math.min(this.timeout * 2, 10000);
      setTimeout(() => this.connect(), this.timeout);
      this._close$.next(event);
    };
    this.socket.onmessage = event => {
      const action = {
        ...JSON.parse(event.data),
        react: (action: Action) => this.socket.send(JSON.stringify(action))
      };
      this._action$.next(action);
    }
    this.socket.onerror = event => {
      this._error$.next(event);
      this.socket.close();
    };

  }

}