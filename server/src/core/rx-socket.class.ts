
import { filter, map } from 'rxjs/operators';
import { HttpServer } from '../server/http-server.type';
import { createSimpleServer } from '../server/server';
import { SocketBridge } from '../bridge/socket-bridge.interface';
import { WsSocketBridge } from '../bridge/ws-socket-bridge.class';
import { Config } from './config.interface';

export class RxSocket {
  private socket: SocketBridge;
  private httpServer: HttpServer;
  private connections: any;

  constructor(options: Config) {
    this.httpServer = options.server || createSimpleServer(options.serverOpts);
    this.socket = options.wsBridge || new WsSocketBridge(this.httpServer, options.wsOpts);
  }

  select(type: string) {
    return this.socket.action$.pipe(
      filter(event => event.type === type),
    );
  }
}