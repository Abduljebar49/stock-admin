export interface ProductSale {
  name: string;
  model: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  type:string,
  returnedAt: string;
  returnedDate: number;
  returnedMonth: number;
  returnedYear: number;
  returnedBy: string;
  productId?:string;
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
