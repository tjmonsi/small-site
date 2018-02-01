import { Element } from '@polymer/polymer/polymer-element';
import { customElements, dispatchEvent, CustomEvent, addEventListener, removeEventListener } from 'global/window';
import { LittleQStoreMixin } from '@littleq/state-manager';

class Component extends LittleQStoreMixin(Element) {
  static get is () { return 's-lazy'; }

  static get properties () {
    return {
      fragments: {
        type: Object,
        value: {},
        statePath: 'littleqFragments'
      }
    };
  }

  constructor () {
    super();
    this._boundImport = this._import.bind(this);
  }

  connectedCallback () {
    super.connectedCallback();
    addEventListener('littleq-lazy-load', this._boundImport);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    removeEventListener('littleq-lazy-load', this._boundImport);
  }

  _import (event) {
    const { detail } = event;
    const { name, page } = detail;
    this.import(name, page);
  }

  import (name, page) {
    if (this.fragments) {
      return (this.fragments[name] && typeof this.fragments[name] === 'function'
        ? this.fragments[name]()
        : Promise.reject(new Error('No fragment found'))
      )
        .then(() => dispatchEvent(new CustomEvent('littleq-lazy-loaded', { detail: { name } })))
        .catch(error => {
          console.log(error);
          if (page) dispatchEvent(new CustomEvent('littleq-no-page-found'));
        });
    }
    console.log('no fragments');
  }
}

!customElements.get(Component.is)
  ? customElements.define(Component.is, Component)
  : console.warn(`${Component.is} is already defined`);
