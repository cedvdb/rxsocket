
import { filter, map } from 'rxjs/operators';
import { HttpServer } from '../server/http-server.type';
import { createSimpleServer } from '../server/server';
import { Bridge } from '../bridge/bridge.interface';
import { WsSocketBridge } from '../bridge/ws-socket-bridge.class';
import { Config } from './config.interface';
import { Observable } from 'rxjs';
import { Action } from '../../../shared';
import { Connection } from './connection.interface';

export class RxSocket implements Bridge {
  private socket: Bridge;
  private httpServer: HttpServer;
  private connections: any;
  open$: Observable<Connection>;
	action$: Observable<Action>;
	error$: Observable<Error>;
  close$: Observable<Connection>;

  constructor(options: Config = {}) {
    this.httpServer = options.server || createSimpleServer(options.serverOpts);
    this.socket = options.wsBridge || new WsSocketBridge(this.httpServer, options.wsOpts);
    this.open$ = this.socket.open$;
    this.action$ = this.socket.action$;
    this.error$ = this.socket.error$;
    this.close$ = this.socket.close$;
  }

  select(type: string) {
    return this.socket.action$.pipe(
      filter(event => event.type === type),
    );
  }
}