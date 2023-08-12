import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dataType, post } from "../api/api";
import { setUserData, getUserData, clearUserData } from "../utils/localStorage";

export interface userType {
  accessToken?: string;
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  image: null | string;
  role: number;
}

const initialState: {
  isLoading: boolean;
  userData: userType | null;
  error: string | null;
} = {
  isLoading: false,
  userData: getUserData(),
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
  reducers: {
    logout(state) {
      state.userData = null;
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload.result;
      setUserData(action.payload.result);
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
      setUserData(action.payload.result);
    },
    [register.rejected]: (state, action) => {
      state.isLoading = false;
      state.userData = null;
      state.error = action.error?.message || null;
    },
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
