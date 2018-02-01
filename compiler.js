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
compile();
if (watch) {
  fs.watch(resolve(__dirname, 'src/index.ejs'), {}, compile);
  fs.watch(resolve(__dirname, 'config/app.json'), {}, compile);
  fs.watch(resolve(__dirname, 'config/theme.json'), {}, compile);
  fs.watch(resolve(__dirname, 'src/templates'), {}, compile);
}
