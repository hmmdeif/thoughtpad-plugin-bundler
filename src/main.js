var uglify = require('uglify-js'),
    uglifycss = require('uglifycss');

var init = function (thoughtpad) {
    thoughtpad.subscribe("javascript-preoutput-request", compilejs);
    thoughtpad.subscribe("css-preoutput-request", compilecss);
},

compilecss = function *(obj) {
    if (!obj.contents || !obj.thoughtpad.config) return;

    var collection,
        i,
        len,
        currentCollection,
        result = {};

    // Loop through each bundle of stylesheets
    for (collection in obj.thoughtpad.config.cssbundle) {
        i = 0;
        len = obj.thoughtpad.config.cssbundle[collection].length;
        currentCollection = [];

        // Grab all the compiled contents minify them all together
        for (i; i < len; i++) {            
            currentCollection.push(obj.contents[obj.thoughtpad.config.cssbundle[collection][i]]);            
        }
        result[collection] = uglifycss.processString(currentCollection.join("\n"), obj.data);
        
        // Replace the config css object with the new bundle name
        obj.thoughtpad.config.cssbundle[collection] = [collection];
    }

    yield obj.thoughtpad.notify("css-preoutput-complete", { bundles: result });
},

compilejs = function *(obj) {
    if (!obj.contents || !obj.thoughtpad.config) return;

    var collection,
        i,
        len,
        currentCollection,
        result = {};

    // Loop through each bundle of scripts
    for (collection in obj.thoughtpad.config.jsbundle) {
        i = 0;
        len = obj.thoughtpad.config.jsbundle[collection].length;
        currentCollection = [];

        // Grab all the compiled contents minify them all together
        for (i; i < len; i++) {            
            currentCollection.push(obj.contents[obj.thoughtpad.config.jsbundle[collection][i]]);            
        }
        result[collection] = uglify.minify(currentCollection, obj.data).code;

        // Replace the config js object with the new bundle name
        obj.thoughtpad.config.jsbundle[collection] = [collection];
    }

    yield obj.thoughtpad.notify("javascript-preoutput-complete", { bundles: result });
};

module.exports = {
    init: init
};