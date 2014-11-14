thoughtpad-plugin-bundler
=================================

[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

A thoughtpad plugin that responds to CSS post-compilation events. CSS files will be minified for use in the browser.

## Usage

The plugin should be loaded using the [thoughtpad-plugin-manager](https://github.com/hmmdeif/thoughtpad-plugin-manager). Once this has been done then the plugin will respond to events. To use standalone:

```JavaScript
var man = require('thoughtpad-plugin-manager'),
    bundler = require('thoughtpad-plugin-bundler');

var thoughtpad = man.registerPlugins([bundler]);
thoughtpad.subscribe("css-bundle-complete", function (data) {
    console.log("your bundle file contents here"); 
});
thoughtpad.notify("css-bundle-request", { files: [/* your array of files */] });
thoughtpad.subscribe("js-bundle-complete", function (data) {
    console.log("your bundle file contents here"); 
});
thoughtpad.notify("js-bundle-request", { files: [/* your array of files */] });
```

In the `config.js` file in a particular site you should add the following objects to let the bundler know how to bundle the files:

```JavaScript

    /* The scripts are an example. All that is needed is the jsBundle and cssBundle object */
    jsBundles: {
        bundle1: [
            'modernizr.js',
            'jquery.js',
            'analytics-push.js',
            'markdown.js',
            'anotherscript.js.coffee'
        ],
        bundle2: [
            'modernizr.js',
            'jquery.js',
            'analytics-push.js'
        ],
        default: [
            'modernizr.js',
            'analytics-push.js'
        ]
    },
    cssBundles: {
        bundle1: [
            'normalise.css',
            'main.css.styl',
            'nav.css.styl',
            'responsive.css.styl',
            'print.css.styl'
        ],
        default: [
            'normalise.css',
            'main.css.styl',
            'nav.css.styl',
            'responsive.css.styl',
            'print.css.styl',
            'anotherstylesheet.css.styl'
        ]
    }
```

## Tests

Ensure you have globally installed mocha - `npm -g install mocha`. Then you can run:

`mocha --harmony-generators`

Alternatively if you are in a *NIX environment `npm test` will run the tests plus coverage data.

## License

The code is available under the [MIT license](http://deif.mit-license.org/).

[travis-image]: https://img.shields.io/travis/hmmdeif/thoughtpad-plugin-bundler/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hmmdeif/thoughtpad-plugin-bundler
[coveralls-image]: https://img.shields.io/coveralls/hmmdeif/thoughtpad-plugin-bundler/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/hmmdeif/thoughtpad-plugin-bundler?branch=master
