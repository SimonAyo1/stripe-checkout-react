import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  secret: null
};

const secretSlice = createSlice({
  name: "secret",
  initialState,

  reducers: {
    // =========== add secret ============

    addSecret(state, action) {
      state.secret = action.payload
    },
  },
});

export const secretActions = secretSlice.actions;
export default secretSlice;
