export const getTransitionEvent = (el) => {
  const transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };
  return Object.entries(transitions).reduce((previous, [key, value]) => (el && el.style[key] !== undefined) ? value : previous);
  // for (var t in transitions) {
  //   if (el && el.style[t] !== undefined) {
  //     return transitions[t];
  //   }
  // }
};
