export interface Item {
  id: number;
  name: string;
  price: number;
}

export interface Person {
  name: string;
  color: string;
  assignedItems: Item[];
}