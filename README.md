thoughtpad-plugin-bundler
=================================

[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

A thoughtpad plugin that responds to pre output events. All script and stylesheets will be bundled into a set that can be specified for each page.

## Usage

The plugin should be loaded using the [thoughtpad-plugin-manager](https://github.com/thoughtpad/thoughtpad-plugin-manager). Once this has been done then the plugin will respond to events. To use standalone:

```JavaScript
var man = require('thoughtpad-plugin-manager'),
    bundler = require('thoughtpad-plugin-bundler');

var thoughtpad = man.registerPlugins([bundler]);
thoughtpad.subscribe("javascript-preoutput-complete", function (data) {
    console.log("your bundled file content object"); 
});
thoughtpad.notify("javascript-preoutput-request", { contents: { a: 'js code', b: 'more js code' }, data: { fromString: true } });
```

The bundler will bundle files according to the `config` object held within the `thoughtpad` object made by the plugin manager. See the tests for examples.

In the `config.js` file in a particular site you should add the following objects to let the bundler know how to bundle the files:

```JavaScript

    /* The scripts are an example. All that is needed is the jsBundle and cssBundle object */
    jsbundle: {
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
    cssbundle: {
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

`mocha`

Alternatively if you are in a *NIX environment `npm test` will run the tests plus coverage data.

## License

The code is available under the [MIT license](http://deif.mit-license.org/).

[travis-image]: https://img.shields.io/travis/thoughtpad/thoughtpad-plugin-bundler/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/thoughtpad/thoughtpad-plugin-bundler
[coveralls-image]: https://img.shields.io/coveralls/thoughtpad/thoughtpad-plugin-bundler/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/thoughtpad/thoughtpad-plugin-bundler?branch=master
