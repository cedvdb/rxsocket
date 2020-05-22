import { Action } from '../shared/action.interface';

export interface Connection {
  id: number;
	rooms?: Map<string, any>;
  dispatch: (action: Action) => any;
}