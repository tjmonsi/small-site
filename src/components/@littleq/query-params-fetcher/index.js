import { Element } from '@polymer/polymer/polymer-element';
import { customElements } from 'global/window';
import { LittleQStoreMixin } from '@littleq/state-manager';
import { LITTLEQ_QUERYPARAMS_ACTION } from './reducer';

export { LITTLEQ_QUERYPARAMS_ACTION };

class Component extends LittleQStoreMixin(Element) {
  static get is () { return 'query-params-fetcher'; }

  static get properties () {
    return {
      query: {
        type: String,
        observer: '_paramsStringChanged',
        statePath: 'littleqPath.query'
      },

      _dontReact: {
        type: Boolean
      }
    };
  }

  connectedCallback () {
    if (super.connectedCallback) super.connectedCallback();
    this._dontReact = false;
  }

  _paramsStringChanged (string) {
    this._dontReact = true;
    this.dispatch({
      type: LITTLEQ_QUERYPARAMS_ACTION.UPDATE,
      params: this._decodeParams(string)
    });
    this._dontReact = false;
  }

  // add something here
  setParams (obj) {
    if (this._dontReact) return;
    this.paramsString = this._encodeParams(this.obj)
      .replace(/%3F/g, '?').replace(/%2F/g, '/').replace(/'/g, '%27');
  }

  _encodeParams (params) {
    var encodedParams = [];
    Object.entries(params).forEach(([key, value]) => {
      if (value === '') encodedParams.push(encodeURIComponent(key));
      else if (value) encodedParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`);
    });
    return encodedParams.join('&');
  }

  _decodeParams (paramString) {
    var params = {};
    // Work around a bug in decodeURIComponent where + is not
    // converted to spaces:
    paramString = (paramString || '').replace(/\+/g, '%20');
    paramString.split('&').forEach(item => {
      const [key, value] = item.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return params;
  }
}

!customElements.get(Component.is)
  ? customElements.define(Component.is, Component)
  : console.warn(`${Component.is} is already defined`);
