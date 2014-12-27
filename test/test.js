var should = require('should'),
    app = require('./../src/main'),
    co = require('co'),
    fs = require('co-fs'),
    man = require('thoughtpad-plugin-manager'),
    thoughtpad;

describe("bundler plugin", function () {
    it("should register correctly to events", function (done) {
        thoughtpad = man.registerPlugins([app]);
        thoughtpad.config = {
            cssbundle: {
                one: ['a', 'b'],
                two: ['c', 'd', 'e']
            }
        };

        thoughtpad.subscribe("javascript-preoutput-complete", function *() {
            true.should.be.true;
        });

        thoughtpad.subscribe("css-preoutput-complete", function *() {
            true.should.be.true;
        });

        co(function *() {
            yield thoughtpad.notify("javascript-preoutput-request", { contents: [""], data: { fromString: true } });
            yield thoughtpad.notify("css-preoutput-request", { contents: [""] });
            done();
        })();
    });

    it("should ignore requests with no content", function (done) {
        thoughtpad = man.registerPlugins([app]);

        thoughtpad.subscribe("javascript-preoutput-complete", function *() {
            true.should.be.false;
        });

        thoughtpad.subscribe("css-preoutput-complete", function *() {
            true.should.be.false;
        });

        co(function *() {
            yield thoughtpad.notify("javascript-preoutput-request", { contents: "" });
            yield thoughtpad.notify("css-preoutput-request", { contents: [""] });
            done()
        })();
    });


    it("should minify multiple js objects from string", function (done) {
        thoughtpad = man.registerPlugins([app]);
        thoughtpad.config = {
            jsbundle: {
                one: ['a', 'b'],
                two: ['c', 'd', 'e']
            },
            eventData: {
                'javascript-preout' : { fromString: true }
            }
        };

        thoughtpad.subscribe("javascript-preoutput-complete", function *(contents) {
            contents.bundles.should.eql({ one: 'var a=3,b=2,c=3,d=2;', two: 'var c=3,d=2,c=3,d=2,f=3,g=2;'});
        });

        co(function *() {
            yield thoughtpad.notify("javascript-preoutput-request", { contents: { a: "var a = 3,\n\tb = 2;", b: "var c = 3,\n\td = 2;", c: "var c = 3,\n\td = 2;", d: "var c = 3,\n\td = 2;", e: "var f = 3,\n\tg = 2;"} });
            done();
        })();
    });

    it("should minify multiple css objects from string", function (done) {
        thoughtpad = man.registerPlugins([app]);
        thoughtpad.config = {
            cssbundle: {
                one: ['a', 'b'],
                two: ['c', 'd', 'e']
            },
            eventData: {
                'css-preoutput': {expandVars: false}
            }
        };

        thoughtpad.subscribe("css-preoutput-complete", function *(contents) {
            contents.bundles.should.eql({ one: '.class1{width:100%}.class1{width:100%}', two: '.class1{width:100%}.class1{width:100%}.class1{width:100%}'});
        });

        co(function *() {
            yield thoughtpad.notify("css-preoutput-request", { contents: { a: ".class1 {\n\twidth: 100%;\n}", b: ".class1 {\n\twidth: 100%;\n}", c: ".class1 {\n\twidth: 100%;\n}", d: ".class1 {\n\twidth: 100%;\n}", e: ".class1 {\n\twidth: 100%;\n}"} });
            done();
        })();
    });
});

