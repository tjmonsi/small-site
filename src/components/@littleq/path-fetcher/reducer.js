import { reducers, store } from '@littleq/state-manager';
import { combineReducers } from 'redux';

const LITTLEQ_PATH_ACTION = {
  PATH: 'LITTLEQ_PATH_UPDATE_PATH',
  QUERY: 'LITTLEQ_PATH_UPDATE_QUERY',
  HASH: 'LITTLEQ_PATH_UPDATE_HASH'
};

reducers.littleqPath = (obj = {}, action) => {
  switch (action.type) {
    case LITTLEQ_PATH_ACTION.PATH:
      return Object.assign({}, obj, {
        path: action.path
      });
    case LITTLEQ_PATH_ACTION.QUERY:
      return Object.assign({}, obj, {
        query: action.query
      });
    case LITTLEQ_PATH_ACTION.HASH:
      return Object.assign({}, obj, {
        hash: action.query
      });
    default:
      return obj;
  }
};

store.replaceReducer(combineReducers(reducers));

export { LITTLEQ_PATH_ACTION };
