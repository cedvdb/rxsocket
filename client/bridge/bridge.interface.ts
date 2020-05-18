import { Observable } from 'rxjs';
import { Action, ActionEvent } from '~shared/action.interface';


export interface Bridge {
  connection$: Observable<any>;
	error$: Observable<any>;
  close$: Observable<any>;
  action$: Observable<ActionEvent>;
  dispatch$: Observable<Action>;
  close: () => void;
  dispatch: (action: Action) => any;
}