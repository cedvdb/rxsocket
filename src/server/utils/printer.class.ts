import { LogLevel } from 'simply-logs';
import { Route } from 'src/shared/route.interface';
import { RxBridge } from '../bridge/rx-bridge.interface';
import { log } from '../utils/log';

const startRocket = `
      /\\
     (  )`;
const endRocket = `
     (  )
    /|/\\|\\
   /_||||_\\.`;


export class Printer {

  static printLogo(address: string | { port: number }){
		const info = `RxSocket client listenning on ${ typeof address === 'object' ? address.port : address }`;
		log.info(`${startRocket}    ${info}${endRocket}`);
	}

	static printRoutes(routes: Route[]){
    log.table(LogLevel.INFO, routes);
  }

  static printEnv(){
		const env = process.env.NODE_ENV;
		log.info(`NODE_ENV: app running in ${env ? env : 'dev'} mode. `
		+ `Set your NODE_ENV environment variable to production for production mode`);
  }

  static printEvents(socket: RxBridge, onlineUsers: Map<any, any>) {
    socket.connection$
      .subscribe(connection => log.info(`connection  #${connection.id}, ${onlineUsers.size} concurrent connections`));
    socket.close$
      .subscribe(connection => log.info(`closing connection #${connection.id}, ${onlineUsers.size} concurrent connections`));
    socket.error$
      .subscribe(error => log.error(error));
    socket.received$
      .subscribe(action => log.info(`\x1b[33m Action ${ action.type } received, payload:
        ${ JSON.stringify(action.payload) }`));
    socket.dispatched$
      .subscribe(action => log.info(`\x1b[36m Action ${ action.type } dispatched, payload:
        ${ JSON.stringify(action.payload) }`));
  }

}

