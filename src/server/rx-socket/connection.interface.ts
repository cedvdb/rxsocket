import { Action } from 'src/shared/action.interface';

export interface Connection {
  id: number;
	rooms?: Map<string, any>;
  dispatch: (action: Action) => any;
}