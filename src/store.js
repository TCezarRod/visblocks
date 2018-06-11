import { createStore } from "redux";
import arrowsReducer from "reducers/visualization.reducer";

const store = createStore(arrowsReducer);

export default store;