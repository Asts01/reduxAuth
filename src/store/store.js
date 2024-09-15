import { configureStore } from '@reduxjs/toolkit'
import UserSlice from '../slice/userSlice';

const store =  configureStore({
  reducer: {
    user:UserSlice,
  },
})

export default store;