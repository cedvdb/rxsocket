import { Observable } from 'rxjs';
import { Action } from '~shared/action.interface';
import { Bridge } from '../bridge/bridge.interface';
import { WebSocketBridge } from '../bridge/websocket-bridge.class';
import { filter, map } from 'rxjs/operators';
import { Config } from './config.interface';

export class RxSocket implements Bridge {
  private wsBridge: Bridge;

  open$: Observable<any>;
	action$: Observable<Action>;
	error$: Observable<any>;
  close$: Observable<any>;

  constructor(options: Config) {
    this.wsBridge = options.wsBridge || new WebSocketBridge(options.url);
    this.open$ = this.wsBridge.open$;
    this.action$ = this.wsBridge.action$;
    this.error$ = this.wsBridge.error$;
    this.close$ = this.wsBridge.close$;
  }

  select(type: string): Observable<Action> {
    return this.wsBridge.action$.pipe(
      filter(action => action.type === type),
    );
  }

  dispatch(action: Action): Observable<Action> {
    return this.select(action.type);
  }
}