import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export const getAllItem = createAsyncThunk(
  "item/getAllItem",
  async (
    params: { page?: number; size?: number; keyword?: string } | void,
    { rejectWithValue }
  ) => {
    try {
      const result = await axios({
        url: "http://localhost:8000/api/v1/items",
        method: "GET",
        params,
        headers: {
          "Content-Type": "application/json",
        },
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
