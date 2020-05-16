import WebSocket from 'ws';
import { HttpServer } from '../server/http-server.type';
import { WebsocketBridge } from './websocket-bridge.interface';
import { Reaction } from '../../../action-reaction';

/**
 * The purpose of this class is to decouple the websocket implementation
 * from the rest of the library, so the lib is agnostic of the websocket lib used
 * */ 
export class WsBridge implements WebsocketBridge {
  websocket: WebSocket.Server;

  constructor(options: WebSocket.ServerOptions) {
    this.websocket = new WebSocket.Server(options);
  }

	onConnection(fn: (ws: WebSocket) => any){
		this.websocket.on('connection', fn);
	}

	onError(socket: WebSocket, fn: (e: Error) => any){
		socket.on('error', fn);
	}

	onMessage(socket: WebSocket, fn: (msg: string) => any){
		socket.on('message', (cn) => {
      socket.
    });
	}

	onClose(socket: WebSocket, fn: () => any){
		socket.on('close', fn);
	}

	send(socket: WebSocket, reaction: Reaction<any>){
		socket.send(reaction);
	}

}