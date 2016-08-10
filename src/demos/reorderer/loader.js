/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../../");

var localCssDeps = fluid.sandbox.loader.defaultDeps.css.concat([
    "%infusion/src/components/reorderer/css/ImageReorderer.css",
    "%infusion/src/components/reorderer/css/Reorderer.css"
]);

fluid.defaults("fluid.sandbox.loaders.reorderer", {
    gradeNames: ["fluid.sandbox.loader"],
    title: "Reorderer Demo",
    markupContentPath:    "%fluid-sandbox/src/demos/reorderer/fixtures.html",
    instructionsPath:     "%fluid-sandbox/src/demos/reorderer/instructions.md",
    componentOptionsPath: "%fluid-sandbox/src/demos/reorderer/options.json",
    dependencies: {
        css: localCssDeps
    }
});
