import { addEventListener, dispatchEvent, CustomEvent } from 'global/window';
const fragments = {'page-home': () => import(/* webpackChunkName: "page-home" */ 'page-home'), 'page-not-found': () => import(/* webpackChunkName: "page-not-found" */ 'page-not-found'), 'page-not-authorized': () => import(/* webpackChunkName: "page-not-authorized" */ 'page-not-authorized'), 'page-login': () => import(/* webpackChunkName: "page-login" */ 'page-login'), 'page-authorized': () => import(/* webpackChunkName: "page-authorized" */ 'page-authorized'), 'page-test': () => import(/* webpackChunkName: "page-test" */ 'page-test'), 'page-test-two': () => import(/* webpackChunkName: "page-test-two" */ 'page-test-two')};
async function lazyLoad (name, page) {
  try {
    (fragments[name] && typeof fragments[name] === 'function') ? await fragments[name]() : await Promise.reject(new Error('No fragment found'));
    dispatchEvent(new CustomEvent('littleq-lazy-loaded', { detail: { name } }));
  } catch (error) {
    console.log(error);
    if (page) dispatchEvent(new CustomEvent('littleq-no-page-found'));
  }
}
const handleRequest = ({ detail: { name, page } }) => lazyLoad(name, page);
addEventListener('littleq-lazy-load', handleRequest);
