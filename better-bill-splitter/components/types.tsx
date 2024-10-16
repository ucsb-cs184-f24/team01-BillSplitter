export interface Item {
  id: number;
  name: string;
  price: number;
  assignedPeople: Person[];
}

export interface Person {
  name: string;
  color: string;
  assignedItems: Item[];
  sumOwed: number;
}