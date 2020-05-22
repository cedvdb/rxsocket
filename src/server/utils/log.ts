import { Log, prettyNode } from 'simply-logs';


export const log = new Log();
log.transformFn = prettyNode;