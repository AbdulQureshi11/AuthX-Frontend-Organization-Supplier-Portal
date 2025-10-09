// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";

// reducers import
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import configReducer from "../features/configs/configsSlice";
import logsReducer from "../features/logs/logsSlice";
import orgReducer from "../features/org/orgSlice";
import supplierReducer from "../features/suppliers/supplierSlice";
import userReducer from "../features/users/usersSlice";
import searchReducer from "../features/search/searchSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    config: configReducer,
    logs: logsReducer,
    org: orgReducer,
    supplier: supplierReducer,
    user: userReducer,
    search: searchReducer,
  },
});
