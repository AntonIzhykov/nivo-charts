import * as types from './States.types';

export const initialState = {
  loading: false,
  error: '',
  incomingData: {}
};

export const stats = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_INCOMING_DATA_REQUEST:
      return {
        ...state,
        loading: true
      };

    case types.GET_INCOMING_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        incomingData: action.payload
      };

    case types.GET_INCOMING_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};
