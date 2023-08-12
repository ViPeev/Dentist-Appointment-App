import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dataType, post } from "../api/api";

const initialState: {
  isLoading: boolean;
  userData: {} | null;
  error: string | null;
} = {
  isLoading: false,
  userData: null,
  error: null,
};

const loginURL: string = "auth/login";
const registerURL: string = "auth/";

export const login = createAsyncThunk(
  "auth/login",
  async (payload: dataType) => {
    const response = await post(loginURL, payload);
    return response;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: dataType) => {
    const response = await post(registerURL, payload);
    return response;
  }
);

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
      state.userData = null;
      state.error = action.error?.message || null;
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
      state.userData = null;
      state.error = action.error?.message || null;
    },
  },
});

export default authSlice.reducer;
