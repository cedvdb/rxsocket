
export interface Action<T = any> {
	type: string;
  payload?: T;
  react?: (action: Action) => void;
}