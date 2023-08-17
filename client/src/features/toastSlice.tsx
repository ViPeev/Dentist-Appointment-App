import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { setUserData, getUserData, clearUserData } from "../utils/localStorage";

export interface toastType {
  error: boolean;
  message: string;
  id: string;
}

const initialState: { notifications: toastType[] } = {
  notifications: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    add(state, action: PayloadAction<toastType>) {
      state.notifications.unshift(action.payload);
    },
    remove(state) {
      state.notifications.pop();
    },
  },
});
export const { add } = toastSlice.actions;
export default toastSlice.reducer;
