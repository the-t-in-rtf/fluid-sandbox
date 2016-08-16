/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../../");

var localCssDeps = fluid.sandbox.loader.defaultDeps.css.concat([
    "%fluid-sandbox/src/demos/inlineEdit/InlineEdit.css"
]);

var localJsDeps = fluid.sandbox.loader.defaultDeps.js.concat([
    "%fluid-sandbox/src/demos/inlineEdit/inlineEditDemo.js"
]);


fluid.defaults("fluid.sandbox.loaders.inlineEdit", {
    gradeNames: ["fluid.sandbox.loader"],
    title: "Inline Editor Demo",
    markupContentPath:    "%fluid-sandbox/src/demos/inlineEdit/fixtures.html",
    instructionsPath:     "%fluid-sandbox/src/demos/inlineEdit/instructions.md",
    componentOptionsPath: "%fluid-sandbox/src/demos/inlineEdit/options.json",
    dependencies: {
        css: localCssDeps,
        js:  localJsDeps
    }
});
