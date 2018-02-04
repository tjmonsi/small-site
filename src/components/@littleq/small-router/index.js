import { Element } from '@polymer/polymer/polymer-element';
import { customElements, addEventListener, removeEventListener } from 'global/window';
import { LittleQStoreMixin } from '@littleq/state-manager';
import { LITTLEQ_SMALL_ROUTER_ACTION } from './reducer';
import pathToRegexp from 'path-to-regexp';

export { LITTLEQ_SMALL_ROUTER_ACTION };

const addRoutes = (list, parent, routes) => {
  list.forEach(({ route: iRoute, page, title, routes: subRoutes }) => {
    let { route: pRoute } = parent;
    const route = pRoute + iRoute;
    routes.push({ route, page, title });
    routes = (subRoutes && subRoutes.length) ? addRoutes(subRoutes, { route }, routes) : routes;
  });
  return routes;
};

class Component extends LittleQStoreMixin(Element) {
  static get is () { return 'small-router'; }

  static get properties () {
    return {
      // location-mixin
      path: {
        type: String,
        statePath: 'littleqPath.path'
      },
      routes: {
        type: Array,
        statePath: ({ littleqPages: { middlewares, routes } }) => addRoutes(routes, { middlewares, route: '' }, [])
      },
      notFoundPage: {
        type: String,
        statePath: ({ littleqPages }) => littleqPages['not-found']
      },
      notAuthorizedPage: {
        type: String,
        statePath: ({ littleqPages }) => littleqPages['not-authorized']
      }
    };
  }

  static get observers () {
    return [
      '_checkPathRoute(path)'
    ];
  }

  constructor () {
    super();
    this._boundNoPageFound = this._noPageFound.bind(this);
    this._boundNotAuthorized = this._notAuthorized.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    addEventListener('littleq-no-page-found', this._boundNoPageFound);
    addEventListener('littleq-not-authorized', this._boundNotAuthorized);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    removeEventListener('littleq-no-page-found', this._boundNoPageFound);
    removeEventListener('littleq-not-authorized', this._boundNotAuthorized);
  }

  /**
   * Check path and route if it matches. Because the matching happens in the routes
   * themselves, it will wait for 200 milliseconds before showing the default, which
   * is the not-found route.
   *
   * @param {any} path
   * @memberof SporkRouter
   */
  _checkPathRoute (path) {
    if (path) {
      let exec = null;
      let keys = [];
      let currentRoute = null;
      let currentPage = null;
      let currentMiddlewares = [];
      this.routes.forEach(({ route, page, middlewares }) => {
        keys = [];
        const re = pathToRegexp(route, keys);
        const currentExec = re.exec(path);
        exec = exec || currentExec;
        currentRoute = currentExec ? route : currentRoute;
        currentPage = currentExec ? page : currentPage;
        currentMiddlewares = currentExec ? middlewares : currentMiddlewares;
      });
      this._routeCheck(
        exec ? (currentRoute || 'not-found') : 'not-found',
        exec || [],
        keys,
        exec ? (currentPage || this.notFoundPage) : this.notFoundPage
      );
    }
  }

  _noPageFound () {
    this._routeCheck('not-found', [], [], this.notFoundPage);
  }

  _notAuthorized () {
    this._routeCheck('not-authorized', [], [], this.notAuthorizedPage);
  }

  _routeCheck (route, exec, keys, page) {
    const params = {};
    keys.forEach((key, index) => {
      const { name } = key;
      params[name] = exec[index + 1] || null;
    });

    this.dispatch({
      type: LITTLEQ_SMALL_ROUTER_ACTION.PARAMS,
      params
    });

    this.dispatch({
      type: LITTLEQ_SMALL_ROUTER_ACTION.ROUTE,
      route
    });

    this.dispatch({
      type: LITTLEQ_SMALL_ROUTER_ACTION.PAGE,
      page
    });
  }
}

!customElements.get(Component.is)
  ? customElements.define(Component.is, Component)
  : console.warn(`${Component.is} is already defined`);
