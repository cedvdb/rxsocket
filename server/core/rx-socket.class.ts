
import log from 'loglevel';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action, ActionEvent } from '~shared/action.interface';
import { Route } from '~shared/route.interface';
import { Bridge } from '../bridge/bridge.interface';
import { WsBridge } from '../bridge/ws-bridge.class';
import { HttpServer } from '../http-server/http-server.type';
import { createSimpleServer } from '../http-server/server';
import { Config } from './config.interface';
import { Connection } from './connection.interface';

export class RxSocket implements Bridge {
  private socket: Bridge;
  private httpServer: HttpServer;
  private routes: Route[] = [];
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
}