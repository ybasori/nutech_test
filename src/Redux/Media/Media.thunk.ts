import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import ApiList from "../../Config/ApiList";

export const getMedia = createAsyncThunk(
  "media/getMedia",
  async (_params, { rejectWithValue }) => {
    try {
      const result = await axios({
        url: ApiList.MediaUrl,
        method: "GET",
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
