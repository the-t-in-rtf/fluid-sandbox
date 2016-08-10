/* eslint-env node */
"use strict";
var fluid = require("infusion");

var fs = require("fs");

require("../..");

fluid.each(["fluid.sandbox.loader", "fluid.sandbox.loaders.reorderer"], function (gradeName) {
    var loader = fluid.component({gradeNames: gradeName});
    var rendereredContent = loader.render();
    fs.writeFileSync("/tmp/" + gradeName + ".html", rendereredContent);
});
