import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import ApiList from "../../Config/ApiList";

export const getAllItem = createAsyncThunk(
  "item/getAllItem",
  async (params: { search?: string } | void, { rejectWithValue }) => {
    try {
      const result = await axios({
        url: ApiList.BarangUrl,
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
