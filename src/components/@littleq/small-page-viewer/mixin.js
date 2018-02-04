
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

export const LittleqPageMixin = dedupingMixin(base => {
  /**
   * @polymer
   * @mixinClass
   * @unrestricted
   * @implements {Polymer_ElementMixin}
   */
  class ElementMixin extends base {
    static get middlewares () {
      return [Promise.resolve(1)];
    }

    async checkMiddlewares () {
      const result = await Promise.all(this.constructor.middlewares);
      return result.reduce((accumulator, current) => accumulator === 2 || current === 2
        ? 2
        : accumulator && current);
    }
  }
  return ElementMixin;
});
