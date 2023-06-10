import { createSlice } from "@reduxjs/toolkit";
import { getAllItem } from "./Item.thunk";
import { IItem } from "./Item.type";

const initialState: IItem = {
  items: null,
  isLoadingItems: false,
  errorItems: null,
  totalItems: null,
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllItem.pending, (state) => {
        state.items = null;
        state.totalItems = null;
        state.isLoadingItems = true;
        state.errorItems = null;
      })
      .addCase(getAllItem.fulfilled, (state, { payload }) => {
        state.items = payload.data.data.items;
        state.totalItems = payload.data.data.total;
        state.isLoadingItems = false;
        state.errorItems = null;
      })
      .addCase(getAllItem.rejected, (state, { payload }) => {
        state.items = null;
        state.totalItems = null;
        state.isLoadingItems = false;
        state.errorItems = payload;
      });
  },
});

export default itemSlice.reducer;
