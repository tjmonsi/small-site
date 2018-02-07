# small-site
A minimized small polymer 3 site

## Requirement
Should run on Node JS version 8.x and greater

```bash
nvm install 8.9.4
```

If you want to use and deploy in Firebase

```bash
$ npm i -g firebase-tools
```

## Usage
So you have installed Node JS (and optionally install firebase-tools).

To automatically create the small-site architecture on your project, clone this repository

Type

```bash
git clone https://github.com/tjmonsi/small-site.git [your-app-name]
```

Remove the .git folder and change details within: 
- package.json 
- change the name of the project 
- change description of the project 
- change the version of the project 
- update the git url 
- src/manifest.json 
- change the name of the project 
- change the short name (max 20 characters) of the project 
- change start_url of the project 
- change display 
- change theme_color 
- change background_color 
- set the icons

Then start building your application

```bash
npm i
```

## Developing
To start developing

```bash
npm run dev
```

In development, the system will run from the development server and will not show up on the public folder. You can access the site you are developing at http://localhost:3474

## Production
To build a production version

```bash
npm run prod
```

All output will be put in the public folder.

You can then check the output by running a server that has gzipped enabled:

```bash
npm run server
```

You can access the site at http://localhost:3000

## Project Structure

The project structure is as follows:

```
- config
  - utils             // utilities that is needed to build the project, based on fragments.json and page.json
  - page.json         // defines the routing definition of the project
  - app.json          // defines the meta data to be put on manifest.json / html
  - fragments.json    // for code-splitting purposes. All files are resolved on src/components, src/pages, src/middlewares, src/mixins and node_modules
  - theme.json        // defines the theme color for manifest.json / html

- public              // production build folder for deployment
- src                 // where you can find your development source codes

  - assets            // where you put all media and assets that you need
    - fonts           // where you put all your fonts
    - icons           // where you put all icons
    - media           // where you put all images and videos
    - svg             // where you put all your svgs

  - components        // where you put all component dependencies that are not installable from npm
  - pages             // where you put all pages (fragments)
  - middlewares       // used by pages to run functions before opening the page
  - mixins            // put all mixins to extend HTML web component classes here
  - templates         // used for templating the HTML index.html shell
  - utils             // utility folder
  - styles            // styles folder
  
  - index.ejs         // the index.html shell
  - index.js          // the core bundle app-shell
  - index.styl        // the index.styl that will be put on the head part of the html

- .eslintrc.js        // linting configurations
- .gitignore          // configuration for ignoring files for github
- package.json        // npm packages configuration
- postcss.config.js   // css configuration for webpack
- webpack-module.config.js      // Generates the script type=module js files
- webpack-nomodule.config.js    // Generates Es5 script for backwards compat
- webpack.config.js   // configuration file for running the webpack
```

## Deploying in Firebase
Install firebase-tools and login using firebase

```bash
firebase login
```

Then initialize the app to pick the project in firebase (don't add replace files)

```bash
firebase init
```

Test the app before deploying

```bash
firebase serve --only hosting
```

Deploy the app

```bash
firebase deploy --only hosting
```

## How to add a component (npm installable)

You need to install the component using npm

```bash
npm i --save component-name
```

You import it in your file (index.js)

```js
import 'component-name'
```

You add the component in the template

```html
<component-name></component-name>
```

## How to add and create a component (from the components folder)

copy the example component from the components folder

```bash
cp -r ./src/components/component-sample ./src/components/[component-name]
```

edit the name of the component in the new component ([component-name]/index.js)

```js
static get is () { return 'component-sample'; }
```

to

```js
static get is () { return '[component-name]'; }
```

You import it in your file (index.js)

```js
import '[component-name]'
```

You add the component in the template

```html
<component-name></component-name>
```

## How to create and add a page
copy the example page from the pages folder

```bash
cp -r ./src/page/page-sample ./src/pages/[page-name]
```

edit the name of the page in the new page ([page-name]/index.js)

```js
static get is () { return 'page-sample'; }
```

to

```js
static get is () { return '[page-name]'; }
```

How to add a fragment for code splitting
Adding a fragment is easy, open the file `config/fragments.json`, you can see an example...

```
{
  "page-home": "page-home",
  "page-not-found": "page-not-found",
  "page-not-authorized": "page-not-authorized",
  "page-login": "page-login",
  "page-authorized": "page-authorized",
  "page-test": "page-test",
  "page-test-two": "page-test-two"
}
```
Adding a fragment is this:

```
{
  ...
  "[page-name]": "[page-folder-relative-to-src/pages-folder]"
}
```

## How to add a route in a page
Adding a route is easy, open the file `config/pages.json`, you can see an example...

```
[
  {
    "route": "/",
    "page": "page-home",
    "title": "Home"
  },

  ...

  {
    "route": "/sample",
    "page": "page-sample",
    "title": "Sample"
  }
]
```
adding a route is adding this object in the array

```
  {
    "route": "/sample", // this is the route. So that means, you can access the page via /sample
    "page": "page-sample", // this is the page component
    "title": "Sample" // this is the name of the page
  }
```
