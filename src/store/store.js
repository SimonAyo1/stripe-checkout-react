import { configureStore } from "@reduxjs/toolkit";
import secretSlice from "./clientSecret/ClientSecretSlice";

const store = configureStore({
  reducer: {
    secret: secretSlice.reducer,
  },
});

export default store;
