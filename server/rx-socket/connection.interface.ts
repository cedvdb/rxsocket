import { Action } from '~shared/action.interface';

export interface Connection {
  connectionID: number;
	rooms?: Map<string, any>;
  dispatch: (action: Action) => any;
}