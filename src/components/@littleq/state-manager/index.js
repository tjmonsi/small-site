import { createStore } from 'redux';
import PolymerRedux from './lib/polymer-redux';

const reducers = {};
const initial = {};
const store = createStore((state = initial, action) => state);
const LittleQStoreMixin = PolymerRedux(store);

export { reducers, store, LittleQStoreMixin };
