import * as actionTypes from "./actionTypes";

import axios from "axios";

const getBusMongoRequest = () => {
  return {
    type: actionTypes.GET_BUS_MONGO_REQUEST,
  };
};

const getBusMongoSuccess = (payload) => {
  return {
    type: actionTypes.GET_BUS_MONGO_SUCCESS,
    payload: payload,
  };
};

const getBusMongoFailure = () => {
  return {
    type: actionTypes.GET_BUS_MONGO_SUCCESS,
  };
};

const getBusOnId = (payload) => {
  return {
    type: actionTypes.GET_BUS_MONGO_ID_SUCCESS,
    payload,
  };
};

const getBusData2 = () => (dispatch) => {
  dispatch(getBusMongoRequest());
  axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/busservice/`)
    .then((res) => {
      dispatch(getBusMongoSuccess(res.data.data));
    })
    .catch((err) => {
      dispatch(getBusMongoFailure());
    });
};
const getBusOnIdThunk = (id) => (dispatch) => {
  dispatch(getBusMongoRequest());
  axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/busservice/${id}`)
    .then((res) => {
      dispatch(getBusOnId(res.data));
    })
    .catch((err) => dispatch(getBusMongoFailure()));
};
export { getBusData2, getBusOnIdThunk };
