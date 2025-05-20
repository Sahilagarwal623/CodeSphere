import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isLoggedIn: false,
  user: {
    username: "",
    profilepicture: "",
  }
};

// Slice definition
export const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateLoginStatus: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user.username = action.payload.username || "";
      state.user.profilepicture = action.payload.profilepicture || "";
    },
  },
});


export const { updateLoginStatus } = AuthSlice.actions;

export default AuthSlice.reducer;
