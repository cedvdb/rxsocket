import { Reaction } from '../../../action-reaction';

/**
 * The purpose of this interface is to decouple the websocket implementation
 * from the rest of the library, so the lib is agnostic of the websocket lib used
 * */ 
export interface WebsocketBridge<S = any, C = any> {

  websocket: S;

  /** @param fn function that must return the engine connection 
   * that is going to be passed to next methods */
	onConnection: (fn: (connection: any) => any) => any;

	onError: (engineConnection: C, fn: (e: Error) => any) => any;

	onMessage: (engineConnection: C, fn: (msg: string) => any) => any;

	onClose: (engineConnection: C, fn: () => any) => any;

  send: (engineConnection: C, reaction: Reaction<any>) => any;
  
}