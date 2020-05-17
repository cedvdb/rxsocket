import { ServerOptions } from 'http';
import WebSocket from 'ws';
import { HttpServer } from '../server/http-server.type';
import { Bridge } from '../bridge/bridge.interface';

export interface Config {
  server?: HttpServer;
  serverOpts?: ServerOptions;
  wsBridge?: Bridge;
  wsOpts?: WebSocket.ServerOptions;
  disableLogging?: boolean;
}