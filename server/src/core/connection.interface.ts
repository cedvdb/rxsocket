import { Action } from '../../../action-reaction';

export interface Connection {
  connectionID: number;
	rooms?: Map<string, any>;
  metadata?: any;
  send: (action: Action) => any;
}