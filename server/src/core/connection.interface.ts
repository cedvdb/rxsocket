import { Action } from '../../../action-reaction';

export interface Connection {
  connectionID: number;
	rooms?: Map<string, any>;
  metadata?: any;
  dispatch: (action: Action) => any;
}