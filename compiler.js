const fs = require('fs');
const { resolve } = require('path');
const watch = process.argv.find(item => item === '--watch');

const fragmentBuild = () => {
  console.log('building fragments');
  const fragments = JSON.parse(fs.readFileSync(resolve(__dirname, 'config/fragments.json'), 'utf8'));
  const lazyLoad = [];
  Object.entries(fragments).forEach(([fragment, url]) => lazyLoad.push(`'${fragment}': () => import(/* webpackChunkName: "${fragment}" */ '${url}')`));
  const string = `import { addEventListener, dispatchEvent, CustomEvent } from 'global/window';
const fragments = {${lazyLoad.join(', ')}};
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
addEventListener('littleq-lazy-load', handleRequest);`;
  fs.writeFileSync(resolve(__dirname, 'config/utils/fragments.js'), string.trim() + '\n', 'utf-8');
};
fragmentBuild();
if (watch) {
  fs.watch(resolve(__dirname, 'config/fragments.json'), {}, fragmentBuild);
}
