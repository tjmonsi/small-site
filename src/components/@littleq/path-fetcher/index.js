import { Element } from '@polymer/polymer/polymer-element';
import {
  customElements,
  removeEventListener,
  addEventListener,
  performance,
  history,
  dispatchEvent,
  CustomEvent,
  location } from 'global/window';
import { LittleQStoreMixin } from '@littleq/state-manager';
import { LITTLEQ_PATH_ACTION } from './reducer';
import { resolveUrl } from './lib/resolve-url';

export { LITTLEQ_PATH_ACTION };

class Component extends LittleQStoreMixin(Element) {
  static get is () { return 'path-fetcher'; }

  static get properties () {
    return {
      urlSpaceRegex: {
        type: String
      },

      hash: {
        type: String,
        statePath: 'littleqPath.hash'
      },

      dwellTime: {
        type: Number
      },

      _urlSpaceRegExp: {
        type: String,
        computed: '_makeRegExp(urlSpaceRegex)'
      },

      _lastChangedAt: {
        type: String
      },

      _initialized: {
        type: Boolean
      }
    };
  }

  constructor () {
    super();
    this._boundHashChanged = this._hashChanged.bind(this);
    this._boundUrlChanged = this._urlChanged.bind(this);
    this._boundGlobalOnClick = this._globalOnClick.bind(this);
  }

  connectedCallback () {
    if (super.disconnectedCallback) super.connectedCallback();
    addEventListener('hashchange', this._boundHashChanged);
    addEventListener('location-changed', this._boundUrlChanged);
    addEventListener('popstate', this._boundUrlChanged);
    document.body.addEventListener('click', this._boundGlobalOnClick, true);
    this._lastChangedAt = window.performance.now() - (this.dwellTime - 200);
    this._initialized = true;

    // set initialize values
    this.dwellTime = 2000;
    this._initialized = false;
    this._urlChanged();
  }

  disconnectedCallback () {
    if (super.disconnectedCallback) super.disconnectedCallback();
    removeEventListener('hashchange', this._boundHashChanged);
    removeEventListener('location-changed', this._boundUrlChanged);
    removeEventListener('popstate', this._boundUrlChanged);
    document.body.removeEventListener('click', this._boundGlobalOnClick);
    this._initialized = false;
  }

  _hashChanged () {
    this.dispatch({
      type: LITTLEQ_PATH_ACTION.HASH,
      path: window.decodeURIComponent(window.location.hash.substring(1))
    });
  }

  _urlChanged () {
    // We want to extract all info out of the updated URL before we
    // try to write anything back into it.
    //
    // i.e. without _dontUpdateUrl we'd overwrite the new path with the old
    // one when we set this.hash. Likewise for query.
    this._dontUpdateUrl = true;
    this._hashChanged();

    this.dispatch({
      type: LITTLEQ_PATH_ACTION.PATH,
      path: window.decodeURIComponent(window.location.pathname)
    });

    this.dispatch({
      type: LITTLEQ_PATH_ACTION.QUERY,
      query: window.location.search.substring(1)
    });

    this._dontUpdateUrl = false;
    this._updateUrl();
  }

  _getUrl () {
    const partiallyEncodedPath = window.encodeURI(this.path).replace(/\#/g, '%23').replace(/\?/g, '%3F'); // eslint-disable-line no-useless-escape
    let partiallyEncodedQuery = '';
    if (this.query) partiallyEncodedQuery = '?' + this.query.replace(/\#/g, '%23'); // eslint-disable-line no-useless-escape
    let partiallyEncodedHash = '';
    if (this.hash) partiallyEncodedHash = '#' + window.encodeURI(this.hash);
    return (partiallyEncodedPath + partiallyEncodedQuery + partiallyEncodedHash);
  }

  _updateUrl () {
    if (this._dontUpdateUrl || !this._initialized) return;

    if (this.path === window.decodeURIComponent(window.location.pathname) &&
        this.query === window.location.search.substring(1) &&
        this.hash === window.decodeURIComponent(window.location.hash.substring(1))) {
      // Nothing to do, the current URL is a representation of our properties.
      return;
    }
    const newUrl = this._getUrl();
    // Need to use a full URL in case the containing page has a base URI.
    const fullNewUrl = resolveUrl(newUrl, window.location.protocol + '//' + window.location.host).href;
    const now = performance.now();
    const shouldReplace = this._lastChangedAt + this.dwellTime > now;
    this._lastChangedAt = now;
    shouldReplace ? history.replaceState({}, '', fullNewUrl) : window.history.pushState({}, '', fullNewUrl);
    dispatchEvent(new CustomEvent('location-changed'));
  }

  /**
   * A necessary evil so that links work as expected. Does its best to
   * bail out early if possible.
   *
   * @param {MouseEvent} event .
   */
  _globalOnClick (event) {
    // If another event handler has stopped this event then there's nothing
    // for us to do. This can happen e.g. when there are multiple
    // iron-location elements in a page.
    if (event.defaultPrevented) return;
    const href = this._getSameOriginLinkHref(event);
    if (!href) return;
    event.preventDefault();
    // If the navigation is to the current page we shouldn't add a history
    // entry or fire a change event.
    if (href === location.href) return;
    history.pushState({}, '', href);
    dispatchEvent(new CustomEvent('location-changed'));
  }

  /**
   * Returns the absolute URL of the link (if any) that this click event
   * is clicking on, if we can and should override the resulting full
   * page navigation. Returns null otherwise.
   *
   * @param {MouseEvent} event .
   * @return {string?} .
   */
  _getSameOriginLinkHref (event) {
    // We only care about left-clicks.
    if (event.button !== 0) return null;
    // We don't want modified clicks, where the intent is to open the page
    // in a new tab.
    if (event.metaKey || event.ctrlKey) return null;
    const eventPath = event.composedPath();
    let anchor = null;
    eventPath.forEach(element => element.tagName === 'A' && element.href ? (anchor = element) : '');
    // for (var i = 0; i < eventPath.length; i++) {
    //   var element = eventPath[i];
    //   if (element.tagName === 'A' && element.href) {
    //     anchor = element;
    //     break;
    //   }
    // }
    // If there's no link there's nothing to do.
    if (!anchor) return null;
    // Target blank is a new tab, don't intercept.
    if (anchor.target === '_blank') {
      // capture link click
      if (anchor.href && window.ga) window.ga('send', 'event', 'Link', 'Click', anchor.href, 1);
      return null;
    }
    // If the link is for an existing parent frame, don't intercept.
    if ((anchor.target === '_top' ||
        anchor.target === '_parent') &&
        window.top !== window) {
      return null;
    }
    const href = anchor.href;
    // It only makes sense for us to intercept same-origin navigations.
    // pushState/replaceState don't work with cross-origin links.
    const url = document.baseURI != null ? resolveUrl(href, /** @type {string} */(document.baseURI)) : resolveUrl(href);i
    // IE Polyfill
    const origin = window.location.origin || window.location.protocol + '//' + window.location.host;
    const urlOrigin = url.origin || url.protocol + '//' + url.host;
    if (urlOrigin !== origin) return null;
    let normalizedHref = url.pathname + url.search + url.hash;
    // pathname should start with '/', but may not if `new URL` is not supported
    if (normalizedHref[0] !== '/') normalizedHref = '/' + normalizedHref;
    // If we've been configured not to handle this url... don't handle it!
    if (this._urlSpaceRegExp && !this._urlSpaceRegExp.test(normalizedHref)) return null;
    // Need to use a full URL in case the containing page has a base URI.
    return resolveUrl(normalizedHref, window.location.href).href;
  }

  _makeRegExp (urlSpaceRegex) {
    return RegExp(urlSpaceRegex);
  }
}

!customElements.get(Component.is)
  ? customElements.define(Component.is, Component)
  : console.warn(`${Component.is} is already defined`);
