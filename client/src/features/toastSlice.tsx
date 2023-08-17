import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface toastType {
  error: boolean;
  message: string;
  id: string;
}

const initialState: { toasts: toastType[] } = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    add(state, action: PayloadAction<toastType>) {
      state.toasts.unshift(action.payload);
    },
    remove(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload.id);
    },
  },
});

export const { add, remove } = toastSlice.actions;
export default toastSlice.reducer;
