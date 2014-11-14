var uglify = require('uglify-js'),
    uglifycss = require('uglifycss'),
    _thoughtpad;

var init = function (thoughtpad) {
    _thoughtpad = thoughtpad;
    _thoughtpad.subscribe("javascript-preoutput-request", compilejs);
    _thoughtpad.subscribe("css-preoutput-request", compilecss);
},

compilecss = function *(obj) {
    if (!obj.contents || !_thoughtpad.config) return;

    var collection,
        i,
        len,
        currentCollection,
        result = {};

    // Loop through each bundle of stylesheets
    for (collection in _thoughtpad.config.cssbundle) {
        i = 0;
        len = _thoughtpad.config.cssbundle[collection].length;
        currentCollection = [];

        // Grab all the compiled contents minify them all together
        for (i; i < len; i++) {            
            currentCollection.push(obj.contents[_thoughtpad.config.cssbundle[collection][i]]);            
        }
        result[collection] = uglifycss.processString(currentCollection.join("\n"), obj.data);
        
        // Replace the config css object with the new bundle name
        _thoughtpad.config.cssbundle[collection] = [collection];
    }

    yield _thoughtpad.notify("css-preoutput-complete", result);
},

compilejs = function *(obj) {
    if (!obj.contents || !_thoughtpad.config) return;

    var collection,
        i,
        len,
        currentCollection,
        result = {};

    // Loop through each bundle of scripts
    for (collection in _thoughtpad.config.jsbundle) {
        i = 0;
        len = _thoughtpad.config.jsbundle[collection].length;
        currentCollection = [];

        // Grab all the compiled contents minify them all together
        for (i; i < len; i++) {            
            currentCollection.push(obj.contents[_thoughtpad.config.jsbundle[collection][i]]);            
        }
        result[collection] = uglify.minify(currentCollection, obj.data).code;

        // Replace the config js object with the new bundle name
        _thoughtpad.config.jsbundle[collection] = [collection];
    }

    yield _thoughtpad.notify("javascript-preoutput-complete", result);
};

module.exports = {
    init: init
};