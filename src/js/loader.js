/*

    A loader that will create a sandbox based on the specified options, including:

    1. Ensuring that all dependencies are loaded, in the right order.
    2. Creating the initial component.
    3. Loading the editable parts of the component (options, markup, CSS) in their own editable tabs.

    `options.dependencies.js` is an array of package-relative paths to javascript dependencies, in the order in which
    they need to be loaded.

    `options.dependencies.css` is an array of package-relative paths to CSS files, in the order in which they need to be
    loaded.

    `options.markupPath` is a package-relative path to the HTML fixtures used for the sandbox, which will also be loaded in the editor.

    `options.componentOptionsPath` is a package-relative path to the component options, which will be loaded in a separate
    editor.

    `options.instructionsPath` is a package-relative path to markdown content describing this sandbox.

    `options.handlebars.layout` is the handlebars template to use for the page layout.  Note that in order for your
    layout to be useful, it will need to call the supplied `{{deps}}` helper as demonstrated in the layout included
    with this package.

    `options.handlebars.page` is the handlebars template to use for the page itself.  Note that in order for your page
    template to be useful, it will need to call the `{{initBlock}}` helper as demonstrated in the page template
    included with this package.

    `options.title` is the title for the sandbox, which will be used by default in the document title and a heading.

    `options.basePath` is an optional base path that will be used to construct relative dependency URL.  If this is
    omitted, full paths are used.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("gpii-handlebars");
require("gpii-binder");

var fs   = require("fs");
var path = require("path");

fluid.registerNamespace("fluid.sandbox.loader");

/*

    The viewComponent dependencies used by many of the examples in this package.  You will likely want to append your unique
    dependencies to these, for example, using an expander like:

    "@expand:fluid.sandbox.loader.defaultDeps.js.concat({that}.options.uniqueJsDeps)"

 */
fluid.sandbox.loader.defaultDeps = {
    css: [
        "%fluid-sandbox/node_modules/foundation-sites/dist/foundation.css",
        "%infusion/src/components/inlineEdit/css/InlineEdit.css",
        "%infusion/src/components/overviewPanel/css/OverviewPanel.css",
        "%infusion/src/components/pager/css/Pager.css",
        "%infusion/src/components/reorderer/css/ImageReorderer.css",
        "%infusion/src/components/reorderer/css/Reorderer.css",
        "%infusion/src/components/tableOfContents/css/TableOfContents.css",
        "%infusion/src/components/uploader/css/Uploader.css",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/lib/codemirror.css",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/addon/lint/lint.css",
        "%fluid-sandbox/node_modules/infusion/src/lib/jquery/ui/css/default-theme/jquery.ui.theme.css",
        "%fluid-sandbox/src/css/sandbox.css"
    ],
    js: [
        "%infusion/src/lib/jquery/core/js/jquery.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.core.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.widget.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.mouse.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.position.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.draggable.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.resizable.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.button.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.dialog.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.slider.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.tabs.js",
        "%infusion/src/lib/jquery/ui/js/jquery.ui.tooltip.js",
        "%infusion/src/framework/core/js/jquery.keyboard-a11y.js",
        "%infusion/src/framework/core/js/FluidDocument.js",
        "%infusion/src/framework/core/js/Fluid.js",
        "%infusion/src/framework/core/js/FluidDOMUtilities.js",
        "%infusion/src/framework/core/js/FluidIoC.js",
        "%infusion/src/framework/core/js/DataBinding.js",
        "%infusion/src/framework/core/js/FluidView.js",
        "%infusion/src/lib/fastXmlPull/js/fastXmlPull.js",
        "%infusion/src/framework/renderer/js/fluidParser.js",
        "%infusion/src/framework/renderer/js/fluidRenderer.js",
        "%infusion/src/framework/core/js/FluidRequests.js",
        "%infusion/src/framework/core/js/ModelTransformation.js",
        "%infusion/src/framework/core/js/ModelTransformationTransforms.js",
        "%infusion/src/framework/preferences/js/AuxBuilder.js",
        "%infusion/src/framework/preferences/js/Builder.js",
        "%infusion/src/framework/preferences/js/Enactors.js",
        "%infusion/src/framework/preferences/js/FullNoPreviewPrefsEditor.js",
        "%infusion/src/framework/preferences/js/FullPreviewPrefsEditor.js",
        "%infusion/src/framework/preferences/js/Panels.js",
        "%infusion/src/framework/preferences/js/PrefsEditor.js",
        "%infusion/src/framework/preferences/js/PrimaryBuilder.js",
        "%infusion/src/framework/preferences/js/SelfVoicingEnactor.js",
        "%infusion/src/framework/preferences/js/SelfVoicingPanel.js",
        "%infusion/src/framework/preferences/js/SelfVoicingSchemas.js",
        "%infusion/src/framework/preferences/js/SeparatedPanelPrefsEditor.js",
        "%infusion/src/framework/preferences/js/StarterGrades.js",
        "%infusion/src/framework/preferences/js/StarterSchemas.js",
        "%infusion/src/framework/preferences/js/Store.js",
        "%infusion/src/framework/preferences/js/UIEnhancer.js",
        "%infusion/src/framework/preferences/js/URLUtilities.js",
        "%infusion/src/framework/enhancement/js/ContextAwareness.js",
        "%infusion/src/framework/enhancement/js/ProgressiveEnhancement.js",
        "%gpii-binder/src/js/binder.js",
        "%infusion/src/components/inlineEdit/js/InlineEdit.js",
        "%infusion/src/components/inlineEdit/js/InlineEditIntegrations.js",
        "%infusion/src/components/overviewPanel/js/OverviewPanel.js",
        "%infusion/src/components/pager/js/PagedTable.js",
        "%infusion/src/components/pager/js/Pager.js",
        "%infusion/src/components/pager/js/Table.js",
        "%infusion/src/components/progress/js/Progress.js",
        "%infusion/src/components/reorderer/js/GeometricManager.js",
        "%infusion/src/components/reorderer/js/Reorderer.js",
        "%infusion/src/components/reorderer/js/ModuleLayout.js",
        "%infusion/src/components/reorderer/js/ImageReorderer.js",
        "%infusion/src/components/reorderer/js/LayoutReorderer.js",
        "%infusion/src/components/reorderer/js/ReordererDOMUtilities.js",
        "%infusion/src/components/slidingPanel/js/SlidingPanel.js",
        "%infusion/src/components/tableOfContents/js/TableOfContents.js",
        "%infusion/src/components/tabs/js/Tabs.js",
        "%infusion/src/components/textfieldSlider/js/TextfieldSlider.js",
        "%infusion/src/components/textToSpeech/js/MockTTS.js",
        "%infusion/src/components/textToSpeech/js/TextToSpeech.js",
        "%infusion/src/components/tooltip/js/Tooltip.js",
        "%infusion/src/components/uiOptions/js/UIOptions.js",
        "%infusion/src/components/undo/js/Undo.js",
        "%infusion/src/components/uploader/js/DemoUploadManager.js",
        "%infusion/src/components/uploader/js/FileQueue.js",
        "%infusion/src/components/uploader/js/FileQueueView.js",
        "%infusion/src/components/uploader/js/HTML5UploaderSupport.js",
        "%infusion/src/components/uploader/js/MimeTypeExtensions.js",
        "%infusion/src/components/uploader/js/Uploader.js",
        "%infusion/src/components/uploader/js/ErrorPanel.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/lib/codemirror.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/mode/javascript/javascript.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/mode/xml/xml.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/mode/htmlmixed/htmlmixed.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/addon/lint/lint.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/codemirror/addon/lint/json-lint.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/node_modules/jsonlint/web/jsonlint.js",
        "%fluid-sandbox/node_modules/codemirror-infusion/src/codemirror-infusion.js",
        "%fluid-sandbox/src/js/client/sandbox.js"
    ]
};

fluid.sandbox.loader.renderMarkup = function (that, customContext) {
    var markupContent = fluid.sandbox.loader.loadContent(that.options.markupContentPath);
    var instructions = fluid.sandbox.loader.loadContent(that.options.instructionsPath);
    var componentOptions = fluid.require(that.options.componentOptionsPath);

    var dependencyString = fluid.sandbox.loader.generateDependencyString(that);

    var context = fluid.merge({}, customContext, {
        deps: dependencyString,
        title: that.options.title,
        // TODO:  Find a better pattern for this
        markupContent: markupContent.replace(/\n/g, "\\n").replace(/"/g, "\\\""),
        instructions: instructions,
        componentOptions: componentOptions
    });

    return that.renderer.render(that.options.handlebars.page, context);
    // TODO: Make a harness for static renderering, and express middleware to serve a range of content as well.
};

fluid.sandbox.loader.loadContent = function (path) {
    var resolvedPath = fluid.module.resolvePath(path);
    return fs.readFileSync(resolvedPath, "utf8");
};

fluid.sandbox.loader.extractModuleName = function (path) {
    var matches = path.match(fluid.module.moduleRegex);
    if (matches && matches[1]) {
        return matches[1];
    }
    else {
        fluid.fail("Cannot determine package-relative path for content '" + path + "'...");
    }
};

fluid.sandbox.loader.getRelativePath = function (basePath, originalPath) {
    var fullPath     = fluid.module.resolvePath(originalPath);

    var moduleName   = fluid.sandbox.loader.extractModuleName(originalPath);
    var modulePath   = fluid.module.resolvePath("%" + moduleName);

    var relativePath = path.relative(modulePath, fullPath);

    var resolvedBasePath = fluid.module.resolvePath(basePath);
    var bundledPath = path.resolve(resolvedBasePath, moduleName, relativePath);
    var finalPath   = path.relative(resolvedBasePath, bundledPath);
    return finalPath;
};

fluid.sandbox.loader.generateDependencyString = function (that) {
    var dependencyStrings = [];

    fluid.each(that.options.dependencies.js, function (jsDepPath) {
        var fullJsPath = fluid.sandbox.loader.getRelativePath(that.options.basePath, jsDepPath);
        dependencyStrings.push("<script type=\"text/javascript\" src=\"" + fullJsPath + "\"></script>")
    });

    fluid.each(that.options.dependencies.css, function (cssDepPath) {
        var fullCssPath = fluid.sandbox.loader.getRelativePath(that.options.basePath, cssDepPath);
        dependencyStrings.push("<link rel=\"stylesheet\" href=\"" + fullCssPath + "\"/>")
    });

    return dependencyStrings.join("\n");
};

fluid.defaults("fluid.sandbox.loader", {
    gradeNames: ["fluid.component"],
    dependencies: fluid.sandbox.loader.defaultDeps,
    handlebars: {
        page:   "component"
    },
    invokers: {
        render: {
            funcName: "fluid.sandbox.loader.renderMarkup",
            args:     ["{that}", "{arguments}.0"]
        }
    },
    components: {
        renderer: {
            type: "gpii.handlebars.standaloneRenderer",
            options: {
                templateDirs: ["%fluid-sandbox/src/templates"]
            }
        }
    }
});
