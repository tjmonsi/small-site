import { reducers, store } from '@littleq/state-manager';
import { combineReducers } from 'redux';

const LITTLEQ_LOCATION_ACTION = {
  PATH: 'LITTLEQ_LOCATION_UPDATE_PATH',
  QUERY: 'LITTLEQ_LOCATION_UPDATE_QUERY',
  HASH: 'LITTLEQ_LOCATION_UPDATE_HASH'
};

reducers.littleqLocation = (littleqLocation = {}, action) => {
  switch (action.type) {
    case LITTLEQ_LOCATION_ACTION.PATH:
      return Object.assign({}, littleqLocation, {
        path: action.path
      });
    case LITTLEQ_LOCATION_ACTION.QUERY:
      return Object.assign({}, littleqLocation, {
        query: action.query
      });
    case LITTLEQ_LOCATION_ACTION.HASH:
      return Object.assign({}, littleqLocation, {
        hash: action.query
      });
    default:
      return littleqLocation;
  }
};

store.replaceReducer(combineReducers(reducers));

export { LITTLEQ_LOCATION_ACTION };
