import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getMedia } from "../Redux/Media/Media.thunk";

const useMedia = () => {
  const dispatch: AppDispatch = useDispatch();
  const mediaState = useSelector((state: RootState) => state.media);

  return {
    mediaState,
    getMedia: () => dispatch(getMedia()),
  };
};

export default useMedia;
