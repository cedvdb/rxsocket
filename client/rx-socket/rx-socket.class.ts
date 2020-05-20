import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, ActionEvent } from '~shared/action.interface';
import { Route } from '~shared/route.interface';
import { Bridge } from '../bridge/bridge.interface';
import { WsBridge } from '../bridge/ws-bridge.class';
import { Config } from './config.interface';

export class RxSocket implements Bridge {
  private wsBridge: Bridge;
  private routes: Route[] = [];

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
      filter(action => action.type === type)
    );
  }


  /**
   * To listen to specific action type,
   * the difference with select is that this will
   * log a table of all the routes selected when called
   * and will subscribe automatically.
   * @param routes all the type with their handler
   */
  route(routes: Route[]): RxSocket {
    routes.forEach(route => {
      // not using this.select because we don't need the log
      this.received$.pipe(
        filter(({ type }) => type === route.type),
      ).subscribe(actionEvent => route.handler(actionEvent));
      this.routes.push(route);
    });
		return this;
	}

  dispatch(action: Action): RxSocket {
    this.wsBridge.dispatch(action);
    return this;
  }

  close(): void {
    this.wsBridge.close();
  }
}