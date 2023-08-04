import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getAllItem } from "../Redux/Item/Item.thunk";

const useItem = () => {
  const dispatch: AppDispatch = useDispatch();
  const itemState = useSelector((state: RootState) => state.item);

  return {
    itemState,
    getAllItem: (params: { search: string }) => dispatch(getAllItem(params)),
  };
};

export default useItem;
