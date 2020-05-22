import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionEvent } from 'src/shared/action.interface';
import { Route } from 'src/shared/route.interface';
import { log } from '../utils/log';
import { Printer } from '../utils/printer.class';


export class Router {

  constructor(private received$: Observable<ActionEvent>) {}

  /**
   * To listen to specific action type
   * @param type action type you want to select
   */
  select(type: string): Observable<ActionEvent> {
    log.info(`${type} selected`);
    return this.received$.pipe(
      filter(event => event.type === type),
    );
  }

  /**
   * To listen to specific action type,
   * the difference with select is that this will
   * log a table of all the routes selected when called
   * and will subscribe automatically.
   * @param routes all the type with their handler
   */
  route(routes: Route[]): void {
    routes.forEach(route => {
      // not using this.select because we don't need the log
      this.received$.pipe(
        filter(({ type }) => type === route.type),
      ).subscribe(actionEvent => route.handler(actionEvent));
    });
    Printer.printRoutes(routes);
  }

}