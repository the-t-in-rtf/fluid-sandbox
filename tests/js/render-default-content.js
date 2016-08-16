/* eslint-env node */
"use strict";
var fluid = require("infusion");

var fs  = require("fs");
var path = require("path");

require("../..");

var outputPath = fluid.module.resolvePath("%fluid-sandbox/generated");

// TODO: Make a mechanism for detecting these.
var demos = [
    "fluid.sandbox.loaders.component",
    "fluid.sandbox.loaders.inlineEdit",
    "fluid.sandbox.loaders.pager",
    "fluid.sandbox.loaders.reorderer",
    "fluid.sandbox.loaders.viewComponent"
];

fluid.each(demos, function (gradeName) {
    var loader = fluid.component({gradeNames: gradeName, basePath: "%fluid-sandbox/generated"});
    var rendereredContent = loader.render();

    var filePath = path.resolve(outputPath, encodeURI(loader.options.title) + ".html");
    fs.writeFileSync(filePath, rendereredContent);
});

// TODO: Make a mechanism for generating navigation between elements and an index file.