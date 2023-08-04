import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { useEffect } from "react";
import { loadUser, onLogout } from "../Redux/User/User.reducer";
import { onLogin } from "../Redux/User/User.thunk";

const useUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return {
    user: userState,
    onLogin: (data: {
      username: string;
      password: string;
      rememberMe: boolean;
    }) => dispatch(onLogin(data)),
    onLogout: () => dispatch(onLogout()),
  };
};

export default useUser;
