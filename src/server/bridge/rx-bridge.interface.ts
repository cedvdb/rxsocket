import { Observable } from 'rxjs';
import { ActionEvent, Action } from '../../shared/action.interface';
import { Connection } from '../connection.interface';
import { AddressInfo } from 'net';


export interface RxBridge {
  /** when client connects */
  connection$: Observable<Connection>;
  /** when an error occurs */
  error$: Observable<Error>;
  /** when a connection closes */
  close$: Observable<Connection>;
  /** action received */
	received$: Observable<ActionEvent>;
  /** action dispatched */
  dispatched$: Observable<Action>;
  /** closes websocket */
  close(): void;
  /** address on which it's listening */
  address: AddressInfo | string;
}