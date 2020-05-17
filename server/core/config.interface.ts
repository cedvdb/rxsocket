import { ServerOptions } from 'http';
import WebSocket from 'ws';
import { HttpServer } from '../http-server/http-server.type';
import { Bridge } from '../bridge/bridge.interface';

export interface Config {
  server?: HttpServer;
  port?: number;
  wsBridge?: Bridge;
  wsOpts?: WebSocket.ServerOptions;
  disableLogging?: boolean;
}