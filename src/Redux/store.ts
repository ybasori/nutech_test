import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./Item/Item.reducer";
import userReducer from "./User/User.reducer";

export const store = configureStore({
  reducer: {
    item: itemReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
