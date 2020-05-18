
export interface Action<T = any> {
	type: string;
  payload?: T;
}

export interface ActionEvent<T = any> extends Action<T> {
  dispatch: (action: Action) => void;
}