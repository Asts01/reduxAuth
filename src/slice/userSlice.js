import { createSlice } from '@reduxjs/toolkit';
// import { act } from 'react';

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    allUsers: [],  // Array to store all users
    isAuthenticated: false,  // Authentication status
  },
  reducers: {
    // to Clear all the user data and resets authentication state
    emptyOutState: (state) => {
      state.email = '';
      state.name = '';
      state.isAuthenticated = false;
    },
    // to update user data upon successful login/signup
    updateUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    // to add a new user to the list of all users
    addUser: (state, action) => {
      state.allUsers.push(action.payload);
      console.log(action.payload);
      console.log(state.allUsers);
    },
    // to check whether the desired user exists and can be logged in
    canLoginUser: (state, action) => {
      console.log("action.payload",action.payload);
      const user = state.allUsers.find(
        (u) => {
          if(u.email === action.payload.email && u.password === action.payload.password){
            state.isAuthenticated=true;
          }
        }
      );
      console.log("isAuthentaicted",state.isAuthenticated);
    },
  },
});

// Action creators
export const { updateUser, addUser, canLoginUser, emptyOutState } = UserSlice.actions;

export default UserSlice.reducer;
