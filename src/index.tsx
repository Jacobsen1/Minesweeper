import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

import { createStore } from "redux"
import { Provider } from "react-redux"
import { GameReducer } from "./Redux/GameReducer"
//STORE
const store = createStore(
  GameReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,

  document.getElementById("root")
)
