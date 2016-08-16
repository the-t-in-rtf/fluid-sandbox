/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../../");

var localCssDeps = fluid.sandbox.loader.defaultDeps.css.concat([
    "%fluid-sandbox/src/demos/pager/pager.css",
    "%infusion/src/lib/normalize/css/normalize.css",
    "%infusion/src/framework/core/css/fluid.css"
]);

var localJsDeps = fluid.sandbox.loader.defaultDeps.js.concat([
    "%infusion/src/framework/renderer/js/RendererUtilities.js",
    "%fluid-sandbox/src/demos/pager/pagerDemo.js"
]);

fluid.defaults("fluid.sandbox.loaders.pager", {
    gradeNames: ["fluid.sandbox.loader"],
    title: "Pager Demo",
    markupContentPath:    "%fluid-sandbox/src/demos/pager/fixtures.html",
    instructionsPath:     "%fluid-sandbox/src/demos/pager/instructions.md",
    componentOptionsPath: "%fluid-sandbox/src/demos/pager/options.json",
    dependencies: {
        css: localCssDeps,
        js:  localJsDeps
    }
});
