import { Bridge } from '../bridge/bridge.interface';
import { log, LogLevel, prettyNode } from 'simply-logs';
import { Route } from '~shared/route.interface';
import { HttpServer } from 'server/http-server/http-server.type';

log.transformFn = prettyNode;

const startRocket = `
      /\\
     (  )`;
const endRocket = `
     (  )
    /|/\\|\\
   /_||||_\\.`;


export class Printer {


  static printEnv(){
		const env = process.env.NODE_ENV;
		log.info(`NODE_ENV: app running in ${env ? env : 'dev'} mode. `
		+ `Set your NODE_ENV environment variable to production for production mode`);
  }

  static printLogo(addres: any){
		const info = `AR Socket listenning on ${addres?.port}`
		log.info(`${startRocket}    ${info}${endRocket}`);
	}

  static printEvents(bridge: Bridge, server: HttpServer) {
    bridge.connection$
      .subscribe(connection => log.info(`connection  #${connection.connectionID}, ${server.listenerCount('message')} concurrent connections`));
    bridge.close$
      .subscribe(connection => log.info(`closing connection #${connection.connectionID},  ${server.listenerCount('message')} concurrent connections`));
    bridge.error$
      .subscribe(error => log.error(error));
    bridge.received$
      .subscribe(action => log.info(`\x1b[33m Action ${ action.type } received, payload:
        ${ JSON.stringify(action.payload) }`));
    bridge.dispatched$
      .subscribe(action => log.info(`\x1b[36m Action ${ action.type } dispatched, payload:
        ${ JSON.stringify(action.payload) }`));
  }

	static printRoutes(routes: Route[]){
    log.table(LogLevel.INFO, routes);
	}

}

