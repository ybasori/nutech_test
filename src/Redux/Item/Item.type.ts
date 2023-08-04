export interface IData {
  id: string;
  title: { rendered: string };
  acf: {
    foto_barang: string;
    harga_beli: number;
    harga_jual: number;
    stok: number;
  };
}
export interface IItem {
  items: IData[] | null;
  totalItems: number | null;
  isLoadingItems: boolean;
  errorItems: unknown;
}
