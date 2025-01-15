import { configureStore } from "@reduxjs/toolkit";
import houseReducer from "./houseSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    houses: houseReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["setCurrentUserAsync/fulfilled"],
      },
    }),
});

export default store;
