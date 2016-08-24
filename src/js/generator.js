/* eslint-env node */
"use strict";
var fluid = require("infusion");

var fs  = require("fs");
var path = require("path");

require("./loader");
fluid.registerNamespace("fluid.sandbox.generator");

var rimraf = require("rimraf");

fluid.sandbox.generator.createNestedDirectories = function (startingPath) {
    var promise = fluid.promise();

    var parentDirectory = path.resolve(startingPath, "..");
    if (fs.existsSync(parentDirectory)) {
        promise.resolve(true);
    }
    else {
        fluid.sandbox.generator.createNestedDirectories(parentDirectory).then(function () {
            fs.mkdirSync(parentDirectory);
            promise.resolve(true);
        });
    }

    return promise;
};

fluid.sandbox.generator.generatePages = function (that) {
    var resolvedOutputPath = fluid.module.resolvePath(that.options.basePath);

    var generatedContentPath = path.resolve(resolvedOutputPath, "*");
    rimraf.sync(generatedContentPath);

    fluid.log("Generating pages in '", resolvedOutputPath, "'...");

    // The first pass, we instantiate all loaders and then collect some information about them.
    var depMap = {};
    fluid.each(that.options.demos, function (gradeName) {
        var loader = fluid.component({gradeNames: gradeName, basePath: that.options.basePath});
        that.loaders.push(loader);
        that.demoLinks.push({ title: loader.options.title, href: loader.options.title + ".html"});

        fluid.each(loader.options.dependencies, function (depArray) {
            fluid.each(depArray, function (individualDep) {
                depMap[individualDep] = true;
            });
        });
    });
    that.uniqueDependencies = Object.keys(depMap);

    // The second pass, we render each loader's content.
    fluid.each(that.loaders, function (loader) {
        var componentContent = loader.render({demoLinks: that.demoLinks});
        var componentFilename = loader.options.title + ".html";
        var componentFilePath = path.resolve(resolvedOutputPath, componentFilename);
        fs.writeFileSync(componentFilePath, componentContent);

        fluid.log("Created component page '", componentFilename, "'...");
    });

    // Render our "about" page.
    var aboutPageContent = that.render();
    var aboutFilePath = path.resolve(resolvedOutputPath, "index.html");
    fs.writeFileSync(aboutFilePath, aboutPageContent);

    fluid.log("Created index page...");

    // Bundle up the dependencies in generator/deps/package/x/x/x.js
    var copyPromises = [];
    fluid.each(that.uniqueDependencies, function (dependency) {
        var sourcePath = fluid.module.resolvePath(dependency);
        var relPath    = fluid.sandbox.loader.getRelativePath(that.options.basePath, dependency);
        var destPath   = path.resolve(fluid.module.resolvePath(that.options.basePath), relPath);

        // Create the intermediate destination directories
        fluid.sandbox.generator.createNestedDirectories(destPath).then(function () {
            var copyPromise = fluid.promise();
            copyPromises.push(copyPromise);

            if (fs.statSync(sourcePath).isDirectory()) {
                fluid.fail("Cannot copy content from '" + sourcePath + "'...");
            }
            else {

                var writeStream = fs.createWriteStream(destPath);
                var readStream = fs.createReadStream(sourcePath);
                readStream.pipe(writeStream);

                readStream.on("error", fluid.fail);

                writeStream.on("error", copyPromise.reject);
                writeStream.on("finish", copyPromise.resolve);
            }
        });
    });

    fluid.promise.sequence(copyPromises).then(function () {
        fluid.log("Dependencies bundled....");
    });
};


fluid.sandbox.generator.renderMarkup = function (that) {
    var dependencyString = fluid.sandbox.loader.generateDependencyString(that);
    return that.renderer.render(that.options.handlebars.page, {
        title: that.options.title,
        demoLinks: that.demoLinks,
        deps: dependencyString
    });
};

fluid.defaults("fluid.sandbox.generator", {
    gradeNames: ["fluid.component"],
    basePath: "%fluid-sandbox/generated",
    title: "About",
    dependencies: fluid.sandbox.loader.defaultDeps,
    members: {
        uniqueDependencies: [],
        demoLinks: [{title: "About", href: "index.html"}],
        loaders:   []
    },
    handlebars: {
        layout: "main.handlebars",
        page:   "about"
    },
    demos: [
        "fluid.sandbox.loaders.component",
        "fluid.sandbox.loaders.inlineEdit",
        "fluid.sandbox.loaders.pager",
        "fluid.sandbox.loaders.reorderer",
        "fluid.sandbox.loaders.viewComponent"
    ],
    invokers: {
        render: {
            funcName: "fluid.sandbox.generator.renderMarkup",
            args:     ["{that}"]
        }
    },
    components: {
        renderer: {
            type: "gpii.handlebars.standaloneRenderer",
            options: {
                templateDirs: ["%fluid-sandbox/src/templates"]
            }
        }
    },
    listeners: {
        "onCreate.generatePages": {
            funcName: "fluid.sandbox.generator.generatePages",
            args:     ["{that}"]
        }
    }
});

