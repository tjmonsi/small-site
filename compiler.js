const ejs = require('ejs');
const fs = require('fs');
const minify = require('html-minifier').minify;
const { resolve } = require('path');
const dev = process.argv.find(item => item === '--dev');
const watch = process.argv.find(item => item === '--watch');
const compile = () => {
  console.log('compiling');
  const configJson = fs.readFileSync(resolve(__dirname, 'config/app.json'), 'utf8');
  const themeJson = fs.readFileSync(resolve(__dirname, 'config/theme.json'), 'utf8');
  if (configJson && themeJson) {
    const config = JSON.parse(configJson);
    const theme = JSON.parse(themeJson);
    const html = ejs.render(fs.readFileSync(resolve(__dirname, 'src/index.ejs'), 'utf8'), {
      filename: resolve(__dirname, 'src/index.ejs'),
      config: Object.assign({
        build: {}
      }, config),
      theme: Object.assign({
        webApp: {}
      }, theme)
    });
    const newHTML = dev ? html : minify(html, {
      caseSensitive: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyCSS: true,
      minifyJS: true,
      preserveLineBreaks: true,
      removeComments: true
    });
    if (!fs.existsSync(resolve(__dirname, 'public'))) {
      fs.mkdirSync(resolve(__dirname, 'public'));
    }
    fs.writeFileSync(resolve(__dirname, 'public/index.html'), newHTML, 'utf8');
  }
};
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
compile();
if (watch) {
  fs.watch(resolve(__dirname, 'src/index.ejs'), {}, compile);
  fs.watch(resolve(__dirname, 'config/app.json'), {}, compile);
  fs.watch(resolve(__dirname, 'config/theme.json'), {}, compile);
  fs.watch(resolve(__dirname, 'src/templates'), {}, compile);
  fs.watch(resolve(__dirname, 'config/fragments.json'), {}, fragmentBuild);
}
