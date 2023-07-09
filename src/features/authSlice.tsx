import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = { isLoading: false, userData: null };
const url = "http://localhost:5000/api/v1/accounts/login"

export const login = createAsyncThunk('auth/login',async (payload) => {
  const response = await fetch(url,{
    method: "POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
})
return response.json();
})

export const authSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: {
  [login.pending]:(state) => {
    state.isLoading = true;
  },
  [login.fulfilled]:(state,action) => {
    state.isLoading = false;
    state.userData = action.payload;
  }
    },
  },
);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
