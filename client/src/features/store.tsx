import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import toastSlice from "./toastSlice";

const store = configureStore({
  reducer: { auth: authSlice, toast: toastSlice },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
