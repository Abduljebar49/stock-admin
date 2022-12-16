export interface ProductDto {
  name: string;
  model: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  id?:string;
  check: string;
  sale?:[];
  saleCredit?:[];
  return?:[];
  move?:[];
  moveFrom?:[];
  registeredAt?: string;
  registeredDate?: number;
  registeredMonth?: number;
  registeredYear?: number;
  registeredBy?: string;
  productId?: string;
  soldAt?:string;
  soldBy?:string;
  returnAt?:string;
  returnBy?:string;
  movedAt?:string;
  movedBy?:string;
  movedTo?:string;
  movedFrom?:string;
  quantityRegistered?:number,
}

// name: this.model.name,
// model: this.model.model,
// size: this.model.size,
// quantity: this.model.quantity,
// color: this.model.color,
// price: this.model.price,
// registeredAt: this.today,
// registeredDate: this.today.getDate(),
// registeredMonth: this.today.getMonth() + 1,
// registeredYear: this.today.getFullYear(),
// registeredBy: "Abduljebar@dabbalsoftwares.com",
