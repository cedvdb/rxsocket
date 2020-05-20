import WebSocket from 'ws';
import { HttpServer } from '../http-server/http-server.type';
import { IRxSocket } from './rx-socket.interface';

export interface Config {
  server?: HttpServer;
  port?: number;
  wsBridge?: IRxSocket;
  wsOpts?: WebSocket.ServerOptions;
  disableLogging?: boolean;
}