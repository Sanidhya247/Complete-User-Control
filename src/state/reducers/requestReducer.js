import {
  FETCH_MANAGER_REQUESTS,
  FETCH_USER_REQUESTS,
  DELETE_MANAGER_REQUEST,
  DELETE_USER_REQUEST,
} from "../type";

let initial = {
  totalRequest: 0,
  requests: [],
};

const requestReducer = (state = initial, action) => {
  switch (action.type) {
    case FETCH_MANAGER_REQUESTS:
      return {
        ...state,
        totalRequest: action.payload.length,
        requests: action.payload.data,
      };
    case FETCH_USER_REQUESTS:
      return {
        ...state,
        totalRequest: action.payload.length,
        requests: action.payload.filteredData,
      };
    case DELETE_MANAGER_REQUEST:
      return {
        ...state,
      };
    default:
      return { state };
  }
};

export default requestReducer;
