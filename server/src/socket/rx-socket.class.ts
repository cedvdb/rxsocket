
import { WebsocketBridge } from '../bridges/websocket-bridge.interface';
import { WsBridge } from '../bridges/ws-bridge';
import { SocketEventHandler } from '../event-handler/socket-event-handler.class';
import { HttpServer } from '../server/http-server.type';
import { createSimpleServer } from '../server/server';
import { Config } from './config.interface';
import { filter, map } from 'rxjs/operators';

export class RxSocket {
  private wsBridge: WebsocketBridge;
  private httpServer: HttpServer;
  private eventHandler: SocketEventHandler;

  constructor(options: Config) {
    this.httpServer = createSimpleServer();
    this.wsBridge = options.wsBridge || new WsBridge({ server: this.httpServer });
    this.eventHandler = new SocketEventHandler(this.wsBridge.websocket);
  }

  select(type: string) {
    return this.eventHandler.action$.pipe(
      filter(event => event.action.type === type),
      map(event => ({ 
        payload: event.action.payload, 
        connection: event.connection 
      }))
    );
  }
}