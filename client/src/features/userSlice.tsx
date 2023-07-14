import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, post } from "../api/api";

const initialState: { isLoading: boolean; userData: {} | null } = {
  isLoading: false,
  userData: null,
};

const loginURL: string = "accounts/login";
const registerURL: string = "accounts/";

export const getDetails = createAsyncThunk("user/profile", async (payload) => {
  const response = await get(loginURL, payload);
  return response;
});

export const updateDetails = createAsyncThunk("auth/register", async (payload) => {
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
      state.userData = action.payload;
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
      state.userData = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
    },
  },
});

export default authSlice.reducer;