import { reducers, store } from '@littleq/state-manager';
import { combineReducers } from 'redux';
const fragments = {
  'page-home': () => import(/* webpackChunkName: "page-home" */ 'page-home'),
  'page-not-found': () => import(/* webpackChunkName: "page-not-found" */ 'page-not-found'),
  'page-not-authorized': () => import(/* webpackChunkName: "page-not-authorized" */ 'page-not-authorized'),
  'middleware-check-page': () => import(/* webpackChunkName: "middleware-check-page" */ 'middleware-check-page'),
  'page-login': () => import(/* webpackChunkName: "page-login" */ 'page-login'),
  'middleware-check-no-user': () => import(/* webpackChunkName: "middleware-check-no-user" */ 'middleware-check-no-user'),
  'page-authorized': () => import(/* webpackChunkName: "page-authorized" */ 'page-authorized'),
  'page-test': () => import(/* webpackChunkName: "page-test" */ 'page-test'),
  'middleware-check-test': () => import(/* webpackChunkName: "middleware-check-test" */ 'middleware-check-test'),
  'page-test-two': () => import(/* webpackChunkName: "page-test-two" */ 'page-test-two'),
  'middleware-check-test-two': () => import(/* webpackChunkName: "middleware-check-test-two" */ 'middleware-check-test-two')
};
reducers.littleFragments = (littleFragments = fragments, action) => littleFragments;
store.replaceReducer(combineReducers(reducers));
