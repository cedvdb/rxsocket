import { Connection } from '../models/connection.interface';
import { Action } from '../../../action-reaction';


export interface ActionEvent{
	connection: Connection;
	action: Action;
}
