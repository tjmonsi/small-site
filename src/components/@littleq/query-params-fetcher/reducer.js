import { reducers, store } from '@littleq/state-manager';
import { combineReducers } from 'redux';

const LITTLEQ_QUERYPARAMS_ACTION = {
  UPDATE: 'LITTLEQ_QUERYPARAMS_UPDATE'
};

reducers.littleqQueryParams = (obj = {}, action) => {
  switch (action.type) {
    case LITTLEQ_QUERYPARAMS_ACTION.UPDATE:
      return Object.assign({}, obj, {
        params: action.params
      });
    default:
      return obj;
  }
};

store.replaceReducer(combineReducers(reducers));

export { LITTLEQ_QUERYPARAMS_ACTION };
