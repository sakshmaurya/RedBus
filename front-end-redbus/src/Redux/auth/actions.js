import * as actionTypes from "./actionTypes";

// Login Success
export const loginSuccess = (customer) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: customer,
  };
};

// Login Failure
export const loginFailure = (error) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    payload: error,
  };
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return {
    type: actionTypes.LOGOUT,
  };
};

// Dummy function (old code compatibility)
export const addCustomerMongo = () => {
  return async () => {
    return;
  };
};