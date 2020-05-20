import { Observable } from 'rxjs';
import { ActionEvent, Action } from '~shared/action.interface';
import { Connection } from './connection.interface';


export interface IRxSocket {
  connection$: Observable<Connection>;
	error$: Observable<Error>;
  close$: Observable<Connection>;
  /** action received */
	received$: Observable<ActionEvent>;
  /** action dispatched */
  dispatched$: Observable<Action>;
}