/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../../");

fluid.defaults("fluid.sandbox.loaders.viewComponent", {
    gradeNames: ["fluid.sandbox.loader"],
    title: "ViewComponent Demo",
    markupContentPath:    "%fluid-sandbox/src/demos/viewComponent/fixtures.html",
    instructionsPath:     "%fluid-sandbox/src/demos/viewComponent/instructions.md",
    componentOptionsPath: "%fluid-sandbox/src/demos/viewComponent/options.json"
});
