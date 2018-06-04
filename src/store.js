import { createStore } from "redux";
import arrowsReducer from "reducers/arrows.reducer";

const store = createStore(arrowsReducer);

export default store;