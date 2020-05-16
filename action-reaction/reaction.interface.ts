export interface Reaction<T>{
    id?:number;
    type:string;
    payload?: T;
    status?: number;
}