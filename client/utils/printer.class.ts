import { RxBridge } from '../bridge/rx-bridge.interface';
import { LogLevel } from 'simply-logs';
import { Route } from '~shared/route.interface';
import { log } from './log';

const startRocket = `
      /\\
     (  )`;
const endRocket = `
     (  )
    /|/\\|\\
   /_||||_\\.`;

export class Printer{

  static printLogo(address: string | { port: number }){
		const info = `RxSocket client listenning on ${ typeof address === 'object' ? address.port : address }`;
		log.info(`${startRocket}    ${info}${endRocket}`);
	}

	static printRoutes(routes: Route[]){
    log.table(LogLevel.INFO, routes);
  }

  static printEvents(socket: RxBridge) {
    socket.connection$
      .subscribe(_ => log.info(`connection established with rx-socket server`));
    socket.close$
      .subscribe(_ => log.info(`connection closed with rx-socket server`));
    socket.error$
      .subscribe(error => log.error(error.message));
    socket.received$
      .subscribe(action => log.info(`%cAction ${ action.type } received, payload:
        ${ JSON.stringify(action.payload) }`, 'color: gold'));
    socket.dispatched$
      .subscribe(action => log.info(`%cAction ${ action.type } dispatched, payload:
        ${ JSON.stringify(action.payload) }`, 'color: cyan'));
  }

}

