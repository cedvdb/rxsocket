import { Log, prettyBrowser } from 'simply-logs';


export const log = new Log();
log.transformFn = prettyBrowser;