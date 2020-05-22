import { Observable } from 'rxjs';
import { Action, ActionEvent } from 'src/shared/action.interface';


export interface RxBridge {
  connection$: Observable<any>;
	error$: Observable<any>;
  close$: Observable<any>;
  received$: Observable<ActionEvent>;
  dispatched$: Observable<Action>;
  close: (code?: number) => Promise<void>;
  dispatch: (action: Action) => any;
}