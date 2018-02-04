// define root dependencies
import { Element } from '@polymer/polymer/polymer-element';
import { LittleqPageMixin } from '@littleq/small-page-viewer/mixin';
import { customElements } from 'global/window';

// define style and template
import style from './style.styl';
import template from './template.html';

class Component extends LittleqPageMixin(Element) {
  static get is () { return 'page-home'; }
  static get template () { return `<style>${style}</style>${template}`; }

  static get middlewares () {
    return [
      Promise.resolve(1)
    ];
  }
}

!customElements.get(Component.is)
  ? customElements.define(Component.is, Component)
  : console.warn(`${Component.is} is already defined`);
