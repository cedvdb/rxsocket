
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionEvent } from '~shared/action.interface';
import { Bridge } from '../bridge/bridge.interface';
import { WsBridge } from '../bridge/ws-bridge.class';
import { HttpServer } from '../http-server/http-server.type';
import { createSimpleServer } from '../http-server/server';
import { Config } from './config.interface';
import { Connection } from './connection.interface';

export class RxSocket implements Bridge {
  private socket: Bridge;
  private httpServer: HttpServer;
  private connections: any;
  connection$: Observable<Connection>;
	action$: Observable<ActionEvent>;
	error$: Observable<Error>;
  close$: Observable<Connection>;

  constructor(options: Config = {}) {
    this.httpServer = options.server || createSimpleServer(options.port);
    this.socket = options.wsBridge || new WsBridge(this.httpServer, options.wsOpts);
    this.connection$ = this.socket.connection$;
    this.action$ = this.socket.action$;
    this.error$ = this.socket.error$;
    this.close$ = this.socket.close$;
  }

  select(type: string): Observable<ActionEvent> {
    return this.socket.action$.pipe(
      filter(event => event.type === type),
    );
  }
}