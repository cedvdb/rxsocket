import { Observable } from 'rxjs';
import { Action } from '../../../action-reaction';
import { Bridge } from '../bridge/bridge.interface';
import { WebSocketBridge } from '../bridge/websocket-bridge.class';
import { filter, map } from 'rxjs/operators';

export class RxSocket {
  private wsBridge: Bridge;
  
  constructor(options: any) {
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