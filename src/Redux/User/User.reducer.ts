import { createSlice } from "@reduxjs/toolkit";
import { onLogin } from "./User.thunk";
import { IUser } from "./User.type";

const initialState: IUser = {
  name: null,
  token: null,
  loading: false,
  error: null,
  isLogin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onLogout: (state: IUser) => {
      const loc = localStorage.getItem("user");
      const ses = sessionStorage.getItem("user");
      if (loc) {
        localStorage.removeItem("user");
        state.name = null;
        state.token = null;
        state.isLogin = false;
      }
      if (ses) {
        sessionStorage.removeItem("user");
        state.name = null;
        state.token = null;
        state.isLogin = false;
      }
    },
    loadUser: (state: IUser) => {
      const loc = localStorage.getItem("user");
      const ses = sessionStorage.getItem("user");
      if (loc) {
        const dt = JSON.parse(loc);
        state.name = dt.user_display_name;
        state.token = dt.token;
        state.isLogin = true;
      }
      if (ses) {
        const dt = JSON.parse(ses);
        state.name = dt.user_display_name;
        state.token = dt.token;
        state.isLogin = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onLogin.pending, (state) => {
        state.name = null;
        state.token = null;
        state.loading = true;
        state.error = null;
        state.isLogin = false;
      })
      .addCase(onLogin.fulfilled, (state, { payload }) => {
        if (payload.rememberMe) {
          localStorage.setItem("user", JSON.stringify(payload.result.data));
        } else {
          sessionStorage.setItem("user", JSON.stringify(payload.result.data));
        }
        state.name = payload.result.data.user_display_name;
        state.token = payload.result.data.token;
        state.loading = false;
        state.error = null;
        state.isLogin = true;
      })
      .addCase(onLogin.rejected, (state, { payload }) => {
        state.name = null;
        state.token = null;
        state.loading = false;
        state.error = payload;
        state.isLogin = false;
      });
  },
});

export const { loadUser, onLogout } = userSlice.actions;

export default userSlice.reducer;
