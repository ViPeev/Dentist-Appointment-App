import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../api/api";

const initialState: { isLoading: boolean; userData: {} | null } = {
  isLoading: false,
  userData: null,
};
const loginURL: string = "accounts/login";

export const login = createAsyncThunk("auth/login", async (payload) => {
  const response = await post(loginURL, payload);
  return response;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [login.pending]: (state) => {
      state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
    },
  },
});

export default authSlice.reducer;
