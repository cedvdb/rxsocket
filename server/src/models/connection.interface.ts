
export interface Connection {
  connectionID: number;
	socket: any;
	rooms?: Map<string, any>;
	metadata?: any;
}