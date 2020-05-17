import { Observable } from 'rxjs';
import { Action } from '../../../src/shared';
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