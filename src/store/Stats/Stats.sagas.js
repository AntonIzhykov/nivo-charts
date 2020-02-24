import { all, takeLatest, call, put } from 'redux-saga/effects';
import { getIncomingData } from '../api';
import { GET_INCOMING_DATA_REQUEST } from './States.types';
import { getIncomingDataSuccess, getIncomingDataFailure } from './States.action';

export function* watcherGetIncomingData() {
  yield takeLatest(GET_INCOMING_DATA_REQUEST, getIncomingDataWorker);
}

function* getIncomingDataWorker(action) {
  try {
    const response = yield call(getIncomingData, action.payload);
    yield put(getIncomingDataSuccess(JSON.parse(response)));
  } catch (error) {
    yield put(getIncomingDataFailure(error.message));
  }
}

export default function* rootSaga() {
  yield all([watcherGetIncomingData()]);
}
