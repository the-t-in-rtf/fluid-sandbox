/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../../");

fluid.defaults("fluid.sandbox.loaders.component", {
    gradeNames: ["fluid.sandbox.loader"],
    title: "Component Demo",
    markupContentPath:    "%fluid-sandbox/src/demos/component/fixtures.html",
    instructionsPath:     "%fluid-sandbox/src/demos/component/instructions.md",
    componentOptionsPath: "%fluid-sandbox/src/demos/component/options.json"
});
