import { HttpServer } from '../server/http-server.type';
import { WebsocketBridge } from '../bridges/websocket-bridge.interface';

export interface Config {
  server?: HttpServer;
  wsBridge?: WebsocketBridge;
}