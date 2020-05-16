
export interface Action<T = any> {
	id?: number;
	type: string;
	payload?: T;
	metadata?: any;
	timestamp?: number;
	hash?: number;
}