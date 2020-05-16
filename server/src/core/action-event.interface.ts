import { Action } from '../../../action-reaction';


export interface ActionEvent{
	react: (reaction: Action) => any;
	action: Action;
}
