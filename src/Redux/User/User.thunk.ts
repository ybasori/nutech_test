import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import ApiList from "../../Config/ApiList";

export const onLogin = createAsyncThunk(
  "user/onLogin",
  async (
    params: { username: string; password: string; rememberMe: boolean },
    { rejectWithValue }
  ) => {
    try {
      const form = new FormData();
      form.append("username", params.username);
      form.append("password", params.password);
      const result = await axios({
        url: ApiList.LoginUrl,
        method: "POST",
        data: form,
      });
      return { result, rememberMe: params.rememberMe };
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(err.response);
      }
      return rejectWithValue(err);
    }
  }
);
