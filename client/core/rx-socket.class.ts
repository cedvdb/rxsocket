import { Observable } from 'rxjs';
import { Action, ActionEvent } from '~shared/action.interface';
import { Bridge } from '../bridge/bridge.interface';
import { WsBridge } from '../bridge/ws-bridge.class';
import { filter, map } from 'rxjs/operators';
import { Config } from './config.interface';

export class RxSocket implements Bridge {
  private wsBridge: Bridge;

  connection$: Observable<any>;
	received$: Observable<ActionEvent>;
	error$: Observable<any>;
  close$: Observable<any>;
  dispatched$: Observable<Action>;

  constructor(options: Config) {
    this.wsBridge = options.wsBridge || new WsBridge(options.url);
    this.connection$ = this.wsBridge.connection$;
    this.received$ = this.wsBridge.received$;
    this.error$ = this.wsBridge.error$;
    this.close$ = this.wsBridge.close$;
    this.dispatched$ = this.wsBridge.dispatched$;
  }

  select(type: string): Observable<ActionEvent> {
    return this.wsBridge.received$.pipe(
      filter(action => action.type === type),
    );
  }

  dispatch(action: Action): Observable<ActionEvent> {
    this.wsBridge.dispatch(action);
    return this.select(action.type);
  }

  close() {
    this.wsBridge.close();
  }
}