import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export const onLogin = createAsyncThunk(
  "user/onLogin",
  async (params: { name: string }, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("name", params.name);
      const result = await axios({
        url: "http://localhost:8000/api/v1/login",
        method: "POST",
        data: form,
      });
      return result;
    } catch (err) {
      if (err instanceof AxiosError) {
        return rejectWithValue(err.response);
      }
      return rejectWithValue(err);
    }
  }
);
