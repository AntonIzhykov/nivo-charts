import * as types from './States.types';

export const getIncomingDataRequest = ({ token, username, query, start, end, num }) => ({
  type: types.GET_INCOMING_DATA_REQUEST,
  payload: {
    token,
    username,
    query,
    start,
    end,
    num
  }
});

export const getIncomingDataSuccess = data => ({
  type: types.GET_INCOMING_DATA_SUCCESS,
  payload: data
});

export const getIncomingDataFailure = error => ({
  type: types.GET_INCOMING_DATA_FAILURE,
  payload: error
});
