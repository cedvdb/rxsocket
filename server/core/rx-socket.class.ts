
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ActionEvent, Action } from '~shared/action.interface';
import { Bridge } from '../bridge/bridge.interface';
import { WsBridge } from '../bridge/ws-bridge.class';
import { HttpServer } from '../http-server/http-server.type';
import { createSimpleServer } from '../http-server/server';
import { Config } from './config.interface';
import { Connection } from './connection.interface';
import log from 'loglevel';

export class RxSocket implements Bridge {
  private socket: Bridge;
  private httpServer: HttpServer;
  /** when client connects */
  connection$: Observable<Connection>;
  /** when client closes connection */
  close$: Observable<Connection>;
  /** when an error occurs */
	error$: Observable<Error>;
  /** actions received */
	received$: Observable<ActionEvent>;
  /** actions sent */
  dispatched$: Observable<Action>;

  constructor(options: Config = {}) {
    this.httpServer = options.server || createSimpleServer(options.port);
    this.socket = options.wsBridge || new WsBridge(this.httpServer, options.wsOpts);
    this.connection$ = this.socket.connection$;
    this.received$ = this.socket.received$;
    this.error$ = this.socket.error$;
    this.close$ = this.socket.close$;
    this.dispatched$ = this.socket.dispatched$
  }

  /**
   * To listen to specific action type
   * @param type action type you want to select
   */
  select(type: string): Observable<ActionEvent> {
    log.info(`${type} selected`);
    return this.received$.pipe(
      filter(event => event.type === type),
    );
  }

  // addRoutes(routes: Route[]): Socket{
  //   routes.forEach(route => {
  //     this.action$.pipe(
  //       filter(event => event.type === route.type),
  //     ).subscribe();
  //     this.routes.push({ route, subscription });
  //   });
	// 	if(routerConfig)
	// 		this.router = new Router(this.eventHandler, routerConfig);
	// 	setTimeout(_ => Printer.printRoutes(routerConfig), 110);
	// 	return this;
	// }
}