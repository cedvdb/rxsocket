import { Observable } from 'rxjs';
import { Action } from '~shared/action.interface';


export interface Bridge {
  open$: Observable<any>;
	error$: Observable<any>;
  close$: Observable<any>;
  action$: Observable<Action>;
}