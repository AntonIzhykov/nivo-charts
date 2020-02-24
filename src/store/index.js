import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import saga from 'redux-saga';
import { stats, rootSaga } from './Stats';

const sagaMiddleware = saga();
const reducers = combineReducers({
  stats
});

/* eslint-disable no-underscore-dangle */
export default compose(applyMiddleware(sagaMiddleware))(createStore)(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

sagaMiddleware.run(rootSaga);
