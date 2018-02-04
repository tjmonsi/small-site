import { Element } from '@polymer/polymer/polymer-element';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import { customElements, dispatchEvent, CustomEvent, removeEventListener, addEventListener } from 'global/window';
import { LittleQStoreMixin } from '@littleq/state-manager';
import { getTransitionEvent } from './utils/get-transition-event';

class Component extends LittleQStoreMixin(Element) {
  static get is () { return 'small-page-viewer'; }

  static get properties () {
    return {
      page: {
        type: String,
        observer: '_checkPage',
        statePath: 'littleqSmallRouter.page'
      }
    };
  }

  static get template () {
    return `
      <style>
        :host {
          display: block;
          position: relative;
        }

        ::slotted([slot=page]) {
          opacity: 0;
          visibility: hidden;
          -webkit-transition: opacity 0.3s, visibility 0s 0.3s;
          transition: opacity 0.3s, visibility 0s 0.3s;
          width: 100%;
          position: absolute;
        }

        ::slotted(.fadeIn) {
          opacity: 1;
          visibility: visible;
          -webkit-transition: opacity 0.3s;
          transition: opacity 0.3s;
          position: relative;
        }

        ::slotted(*) > .fadeIn {
          opacity: 1;
          visibility: visible;
          -webkit-transition: opacity 0.3s;
          transition: opacity 0.3s;
          position: relative;
        }
      </style>
      <main role="main">
        <slot name="page"></slot>
      </main>
    `;
  }

  constructor () {
    super();
    this._boundPageLazyLoaded = this._pageLazyLoaded.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    addEventListener('littleq-lazy-loaded', this._boundPageLazyLoaded);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    removeEventListener('littleq-lazy-loaded', this._boundPageLazyLoaded);
  }

  _checkPage (page, oldPage) {
    if (page === oldPage) return; // means no change has really happened
    const oldPageComponent = this.querySelector('[slot="page"]');
    oldPageComponent ? this._removePage(oldPageComponent, this) : this._loadPage(document.createElement(page));
  }

  _removePage (oldPage, route) {
    const animation = getTransitionEvent(oldPage);
    oldPage.classList.remove('fadeIn');
    oldPage.setAttribute('for-removal', '');
    !animation
      ? this._removePageAfterTransition(oldPage, route)
      : this._removePageListenerFallback(oldPage, route, animation);
  }

  _removePageAfterTransition (oldPage, route, transition, fn) {
    if (this._timeOut) clearTimeout(this._timeOut);
    if (transition && fn) oldPage.removeEventListener(transition, fn);
    if (this.contains(oldPage)) this.removeChild(oldPage);
    this.querySelectorAll('[for-removal]').forEach(node => this.removeChild(node));
    this._loadPage(document.createElement(this.page));
  }

  _removePageListenerFallback (oldPage, route, transition) {
    this._timeOut = setTimeout(() => this._removePageAfterTransition(oldPage, route, transition), 550);
    const fn = () => this._removePageAfterTransition(oldPage, route, transition, fn);
    oldPage.addEventListener(transition, fn);
  }

  _loadPage (page) {
    const name = page.tagName.toLowerCase();
    customElements.get(name)
      ? this._checkMiddlewares(page)
      : dispatchEvent(new CustomEvent('littleq-lazy-load', { detail: { name, page: true } }));
  }

  async _checkMiddlewares (page) {
    try {
      const result = page.checkMiddlewares && typeof page.checkMiddlewares === 'function'
        ? await page.checkMiddlewares()
        : 1;
      if (result === 1 || result === true) this._showPage(page);
      else if (result >= 2) dispatchEvent(new CustomEvent('littleq-not-authorized'));
    } catch (error) {
      console.error(error);
      dispatchEvent(new CustomEvent('littleq-not-found'));
    }
  }

  _showPage (page) {
    page.setAttribute('slot', 'page');
    this.appendChild(page);
    afterNextRender(this, () => page.classList.add('fadeIn'));
  }

  _pageLazyLoaded ({ detail: { name } }) {
    if (this.page === name) this._checkMiddlewares(document.createElement(name));
  }
}

!customElements.get(Component.is)
  ? customElements.define(Component.is, Component)
  : console.warn(`${Component.is} is already defined`);
