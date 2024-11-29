import { createStore, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import rootReducer from "./reducers";

// Tạo store với middleware thunk
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
