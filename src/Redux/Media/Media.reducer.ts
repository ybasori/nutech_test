import { createSlice } from "@reduxjs/toolkit";
import { getMedia } from "./Media.thunk";
import { IMedia } from "./Media.type";

const initialState: IMedia = {
  medias: null,
  isLoadingMedias: false,
  errorMedias: null,
};

export const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMedia.pending, (state) => {
        state.medias = null;
        state.isLoadingMedias = true;
        state.errorMedias = null;
      })
      .addCase(getMedia.fulfilled, (state, { payload }) => {
        state.medias = payload.data;
        state.isLoadingMedias = false;
        state.errorMedias = null;
      })
      .addCase(getMedia.rejected, (state, { payload }) => {
        state.medias = null;
        state.isLoadingMedias = false;
        state.errorMedias = payload;
      });
  },
});

export default mediaSlice.reducer;
