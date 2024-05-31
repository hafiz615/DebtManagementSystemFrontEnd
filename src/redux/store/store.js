import { applyMiddleware, createStore } from "redux";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import signInReducer from "../reducers/signInReducer";
import paymentsReducer from "../reducers/paymentsReducer";

const middleware = [thunk];

const Reducer = combineReducers({
  signIn: signInReducer,
  payments: paymentsReducer,
});
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, Reducer);
export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);
export const persistor = persistStore(store);
