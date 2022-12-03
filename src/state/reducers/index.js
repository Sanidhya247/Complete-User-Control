import { combineReducers } from "redux";
import  mainReducer from './mainReducer';
import requestReducer from "./requestReducer";

const reducers = combineReducers({
    main: mainReducer,
    request:requestReducer
})

export default reducers;
