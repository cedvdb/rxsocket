import http, { ServerOptions } from 'http';
import { HttpServer } from './http-server.type';

const SERVER_DEFAULT = {
  port: 3000,
}

export function createSimpleServer(options: ServerOptions): HttpServer {
  const server = http.createServer(options);
  server.listen(SERVER_DEFAULT.port);
  return server;
}