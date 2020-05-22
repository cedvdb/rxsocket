import { RxBridge } from '../bridge/rx-bridge.interface';
import { log, LogLevel, prettyNode } from 'simply-logs';
import { Route } from '~shared/route.interface';
import { AddressInfo } from 'net';

log.transformFn = prettyNode;

const startRocket = `
      /\\
     (  )`;
const endRocket = `
     (  )
    /|/\\|\\
   /_||||_\\.`;


export class Printer {



  static printLogo(address:string){
		const info = `RxSocket listenning on ${ address }`;
		log.info(`${startRocket}    ${info}${endRocket}`);
	}

  static printEvents(socket: RxBridge) {
    socket.connection$
      .subscribe(connection => log.info(`connection established with rx-socket server`));
    socket.close$
      .subscribe(connection => log.info(`connection closed with rx-socket server`));
    socket.error$
      .subscribe(error => log.error(error));
    socket.received$
      .subscribe(action => log.info(`%cAction ${ action.type } received, payload:
        ${ JSON.stringify(action.payload) }`, 'color: gold'));
    socket.dispatched$
      .subscribe(action => log.info(`%cAction ${ action.type } dispatched, payload:
        ${ JSON.stringify(action.payload) }`, 'color: cyan'));
  }

	static printRoutes(routes: Route[]){
    log.table(LogLevel.INFO, routes);
  }

}

