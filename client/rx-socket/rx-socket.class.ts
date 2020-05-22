import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, ActionEvent } from '~shared/action.interface';
import { Route } from '~shared/route.interface';
import { RxBridge } from '../bridge/rx-bridge.interface';
import { WsRxBridge } from '../bridge/ws-rx-bridge.class';
import { Config } from './config.interface';
import { Printer } from '../utils/printer.class';
import { log, LogLevel } from 'simply-logs';

export class RxSocket implements RxBridge {
  private rxBridge: RxBridge;
  private routes: Route[] = [];

  connection$: Observable<any>;
	received$: Observable<ActionEvent>;
	error$: Observable<any>;
  close$: Observable<any>;
  dispatched$: Observable<Action>;

  constructor(options: Config) {
    log.setLogLevel(options.logLevel || LogLevel.DEBUG);
    this.rxBridge = new WsRxBridge(options.url);
    this.connection$ = this.rxBridge.connection$;
    this.received$ = this.rxBridge.received$;
    this.error$ = this.rxBridge.error$;
    this.close$ = this.rxBridge.close$;
    this.dispatched$ = this.rxBridge.dispatched$;
    Printer.printLogo(options.url);
    Printer.printEvents(this.rxBridge);
  }

  select(type: string): Observable<ActionEvent> {
    log.info(`type ${type} selected`)
    return this.rxBridge.received$.pipe(
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
      Printer.printRoutes(routes);
    });
		return this;
	}

  dispatch(action: Action): RxSocket {
    this.rxBridge.dispatch(action);
    return this;
  }

  close(code?: number): void {
    this.rxBridge.close(code);
  }
}