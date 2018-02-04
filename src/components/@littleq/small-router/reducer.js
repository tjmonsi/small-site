import { reducers, store } from '@littleq/state-manager';
import { combineReducers } from 'redux';

const LITTLEQ_SMALL_ROUTER_ACTION = {
  PARAMS: 'LITTLEQ_SMALL_ROUTER_UPDATE_PARAMS',
  ROUTE: 'LITTLEQ_SMALL_ROUTER_UPDATE_ROUTE',
  PAGE: 'LITTLEQ_SMALL_ROUTER_UPDATE_PAGE'
};

reducers.littleqSmallRouter = (obj = {}, action) => {
  switch (action.type) {
    case LITTLEQ_SMALL_ROUTER_ACTION.PARAMS:
      return Object.assign({}, obj, {
        params: action.params
      });
    case LITTLEQ_SMALL_ROUTER_ACTION.ROUTE:
      return Object.assign({}, obj, {
        route: action.route
      });
    case LITTLEQ_SMALL_ROUTER_ACTION.PAGE:
      return Object.assign({}, obj, {
        page: action.page
      });
    default:
      return obj;
  }
};

store.replaceReducer(combineReducers(reducers));

export { LITTLEQ_SMALL_ROUTER_ACTION };
