export interface OperationalHistory{
    by:string;
    name:string;
    model:string;
    color:string;
    size:string;
    quantity:number,
    oldName:string;
    oldModel:string;
    oldColor:string;
    oldSize:string;
    oldQuantity:number,
    operation:string,
    price:number,
    oldPrice:number;
    at?:string;
}