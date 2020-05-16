import { Observable } from 'rxjs';
import { Connection } from '../core/connection.interface';
import { Action } from '../../../shared';


export interface Bridge {
  open$: Observable<Connection>;
	action$: Observable<Action>;
	error$: Observable<Error>;
  close$: Observable<Connection>;
}