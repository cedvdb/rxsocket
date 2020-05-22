import { Observable } from 'rxjs';
import { LogLevel } from 'simply-logs';
import { Action, ActionEvent } from 'src/shared/action.interface';
import { Route } from 'src/shared/route.interface';
import { RxBridge } from '../bridge/rx-bridge.interface';
import { WsRxBridge } from '../bridge/ws-rx-bridge.class';
import { Router } from '../router/router.class';
import { log } from '../utils/log';
import { Printer } from '../utils/printer.class';
import { Config } from './config.interface';

export class RxSocket implements RxBridge {
  private rxBridge: RxBridge;
  private router: Router;

  constructor(options: Config) {
    log.setLogLevel(options.rxSocket?.logLevel || LogLevel.DEBUG);
    this.rxBridge = new WsRxBridge(options.url);
    this.router = new Router(this.rxBridge.received$);
    Printer.printLogo(options.url);
    Printer.printEvents(this.rxBridge);
  }

  /** dispatch action to client */
  dispatch(action: Action): void {
    this.rxBridge.dispatch(action);
  }

  /** select action stream based on their type
   * @param type the type selected
   */
  select(type: string): Observable<ActionEvent> {
    return this.router.select(type);
  }

  /**
   * To listen to specific action type,
   * the difference with select is that this will
   * log a table of all the routes selected when called
   * and will subscribe automatically.
   * @param routes all the type with their handler
   */
  route(routes: Route[]): void {
    return this.router.route(routes);
	}

  /** closes the socket, will reconnect if the code is anything else than 1000 (default)
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
   */
  close(code = 1000): Promise<void> {
    return this.rxBridge.close(code);
  }

  /** when client connects */
  get connection$ () { return this.rxBridge.connection$ }

  /** when client closes connection */
  get close$ () { return this.rxBridge.close$ }

  /** when an error occurs */
  get error$ () { return this.rxBridge.error$ }

  /** actions received */
  get received$ () { return this.rxBridge.received$ }

  /** actions sent */
  get dispatched$ () { return this.rxBridge.dispatched$ }

}