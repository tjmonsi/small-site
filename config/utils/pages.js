import { reducers, store } from '@littleq/state-manager';
import { combineReducers } from 'redux';
import pages from '../pages.json';
reducers.littleqPages = (littleqPages = pages, action) => littleqPages;
store.replaceReducer(combineReducers(reducers));
