import { Observable } from 'rxjs';
import { ActionEvent, Action } from '~shared/action.interface';
import { Connection } from '../core/connection.interface';


export interface Bridge {
  connection$: Observable<Connection>;
	action$: Observable<ActionEvent>;
	error$: Observable<Error>;
  close$: Observable<Connection>;
  dispatch$: Observable<Action>;
}