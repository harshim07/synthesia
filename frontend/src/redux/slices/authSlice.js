import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //set loading state during Api calls
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error;
    },

    //set user data after login or register
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      if (action.payload.token)
        localStorage.setItem("token", action.payload.token);
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    //logout user
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    updateFavourites: (state, action) => {
      if (state.user) {
        state.user.favourites = action.payload;
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});
export const {
  setLoading,
  setUser,
  setError,
  logout,
  clearError,
  updateFavourites,
} = authSlice.actions;

export default authSlice.reducer;
