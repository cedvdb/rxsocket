import { ServerOptions } from 'http';
import WebSocket from 'ws';
import { HttpServer } from '../server/http-server.type';
import { SocketBridge } from '../socket-bridge/socket-bridge.interface';

export interface Config {
  server?: HttpServer;
  serverOpts?: ServerOptions;
  wsBridge?: SocketBridge;
  wsOpts?: WebSocket.ServerOptions;
  disableLogging?: boolean;
}