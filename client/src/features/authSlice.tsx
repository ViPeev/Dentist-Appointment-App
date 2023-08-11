import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { post } from "../api/api";

const initialState: { isLoading: boolean; userData: {} | null } = {
  isLoading: false,
  userData: null,
};
const loginURL: string = "auth/login";
const registerURL: string = "auth/";

export const login = createAsyncThunk("auth/login", async (payload) => {
  const response = await post(loginURL, payload);
  return response;
});

export const register = createAsyncThunk("auth/register", async (payload) => {
  const response = await post(registerURL, payload);
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
      state.userData = action.payload.result;
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
    },
    [register.pending]: (state) => {
      state.isLoading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload.result;
    },
    [register.rejected]: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
    },
  },
});

export default authSlice.reducer;
