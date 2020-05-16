import { Observable } from 'rxjs';
import { Connection } from '../core/connection.interface';
import { Action } from '../../../action-reaction';


export interface SocketBridge {
  connection$: Observable<Connection>;
	action$: Observable<Action>;
	error$: Observable<Error>;
  close$: Observable<Connection>;
}