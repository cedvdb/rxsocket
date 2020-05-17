import { Observable } from 'rxjs';
import { Action } from '~shared/action.interface';


export interface Bridge {
  connection$: Observable<any>;
	error$: Observable<any>;
  close$: Observable<any>;
  action$: Observable<Action>;
  close: () => void;
  dispatch: (action: Action) => any;
}