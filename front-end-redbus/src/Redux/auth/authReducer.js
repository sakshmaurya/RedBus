import * as actionTypes from "./actionTypes";

const initState = {
  isLoggedIn: false,
  currentCustomer: null,
  error: false,
  isLoading: false,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {

    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        currentCustomer: action.payload,
        error: false,
      };

    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        currentCustomer: null,
        error: true,
      };

    case actionTypes.LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...state,
        isLoggedIn: false,
        currentCustomer: null,
      };

    case actionTypes.ADD_CUSTOMER_MONGO_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: false,
      };

    case actionTypes.ADD_CUSTOMER_MONGO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: false,
        currentCustomer: {
          ...state.currentCustomer,
          _id: action.payload,
        },
      };

    case actionTypes.ADD_CUSTOMER_MONGO_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: true,
      };

    default:
      return state;
  }
};

export { authReducer };