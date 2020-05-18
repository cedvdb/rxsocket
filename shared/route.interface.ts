import { ActionEvent } from '~shared/action.interface';


export interface Route {
  /** type of action the handler is going to subscribe to */
  type: string;
  /** use a named function for better logging */
  handler: Handler;
}

export type Handler = (actionEvent: ActionEvent) => any;
