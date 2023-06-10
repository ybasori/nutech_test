export interface IData {
  picture: string;
  uid: string;
  name: string;
  buy: number;
  sell: number;
  stock: number;
}
export interface IItem {
  items: IData[] | null;
  totalItems: number | null;
  isLoadingItems: boolean;
  errorItems: unknown;
}
