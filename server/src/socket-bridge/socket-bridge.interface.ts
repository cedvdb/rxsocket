import { Observable } from 'rxjs';
import { Connection } from '../core/connection.interface';
import { ActionEvent } from '../core/action-event.interface';


export interface SocketBridge {
  connection$: Observable<Connection>;
	action$: Observable<ActionEvent>;
	error$: Observable<Error>;
  close$: Observable<Connection>;
}