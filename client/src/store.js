import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productCart from "./reducers/productCart";

const rootReducer = combineReducers({
  productCart: productCart,
});

export default  configureStore({
  reducer: rootReducer,
});
