import { Action } from '../../../shared';

export interface Connection {
  connectionID: number;
	rooms?: Map<string, any>;
  dispatch: (action: Action) => any;
}