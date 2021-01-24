import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
