import { applyMiddleware, createStore } from "redux";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import signInReducer from "../reducers/signInReducer";
import paymentsReducer from "../reducers/paymentsReducer";
import drawerReducer from "../reducers/drawerReducer";
import permissionReducer from "../reducers/permissionReducer";
import caseIdReducer from "../reducers/caseIdReducer";
import caseCreditorIdReducer from "../reducers/caseCreditorIdReducer";
import countsReducer from "../reducers/emailSmsCount";
import dialStateReducer from "../reducers/dialReducer";

const middleware = [thunk];

const Reducer = combineReducers({
  signIn: signInReducer,
  payments: paymentsReducer,
  drawer: drawerReducer,
  permissions: permissionReducer,
  caseId: caseIdReducer,
  creditorCaseId: caseCreditorIdReducer,
  counts: countsReducer,
  dial: dialStateReducer,
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
