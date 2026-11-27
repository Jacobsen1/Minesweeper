import { configureStore } from "@reduxjs/toolkit"
import { GameReducer } from "./GameReducer"

// configureStore replaces the deprecated `createStore` from Redux 5 and
// wires up the Redux DevTools extension automatically.
export const store = configureStore({
  reducer: GameReducer,
})

export type AppDispatch = typeof store.dispatch
