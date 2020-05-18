import { Observable } from 'rxjs';
import { Action, ActionEvent } from '~shared/action.interface';
import { Bridge } from '../bridge/bridge.interface';
import { WsBridge } from '../bridge/ws-bridge.class';
import { filter, map } from 'rxjs/operators';
import { Config } from './config.interface';

export class RxSocket implements Bridge {
  private wsBridge: Bridge;

  connection$: Observable<any>;
	action$: Observable<ActionEvent>;
	error$: Observable<any>;
  close$: Observable<any>;
  dispatch$: Observable<Action>;

  constructor(options: Config) {
    this.wsBridge = options.wsBridge || new WsBridge(options.url);
    this.connection$ = this.wsBridge.connection$;
    this.action$ = this.wsBridge.action$;
    this.error$ = this.wsBridge.error$;
    this.close$ = this.wsBridge.close$;
    this.dispatch$ = this.wsBridge.dispatch$;
  }

  select(type: string): Observable<ActionEvent> {
    return this.wsBridge.action$.pipe(
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