// A "sandbox" learning environment where you can instantiate a Fluid component dynamically.
//
// See the README file in this project for usage details.
//
/* global fluid, jQuery */
(function ($) {
    "use strict";
    fluid.registerNamespace("fluid.sandbox");
    fluid.setLogging(true);

    fluid.sandbox.launch = function(that) {
        that.events.destroyComponents.fire(that);

        var markupInput = that.htmlEditor.getContent();
        if (markupInput) {
            var htmlContainer = that.locate("markupOutput");
            htmlContainer.html(markupInput);
        }

        var configJSON = JSON.parse(that.optionsEditor.getContent());

        if (!configJSON.options.gradeNames) { configJSON.options.gradeNames = []; }
        configJSON.options.gradeNames.push("fluid.sandbox.destroyable");

        that.events.createComponent.fire(configJSON);
    };

    fluid.sandbox.parseGrades = function(rawGrades) {
        var parsedGrades;

        try {
            parsedGrades = typeof rawGrades === "string" ? JSON.parse(parsedGrades) : rawGrades;
        }
        catch (e) {
            parsedGrades = [ rawGrades ];
        }

        return parsedGrades;
    };

    fluid.sandbox.populateEditors = function(that) {
        that.optionsEditor.setContent(JSON.stringify(that.options.defaults.configJson, null, 2));
        that.htmlEditor.setContent(that.options.defaults.markupInput);
    };

    fluid.defaults("fluid.sandbox.destroyable", {
        gradeNames: ["fluid.component"],
        listeners: {
            "{sandbox}.events.destroyComponents": {
                func: "{that}.destroy"
            }
        }
    });

    fluid.defaults("fluid.sandbox", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            options:      ".sandbox-options",
            markupInput:  ".sandbox-html-input",
            markupOutput: ".sandbox-html-output",
            start:        ".sandbox-start-button"
        },
        mergePolicy: {
            defaults: "noexpand"
        },
        defaults: {
            configJson: {
                type: "fluid.viewComponent",
                "container": ".view-container",
                options: {
                    "selectors": {
                        "input": ".view-input"
                    },
                    "listeners": {
                        "onCreate.log": {
                            "funcName": "fluid.log",
                            "args": ["Hello, World."]
                        },
                        "onCreate.setValue": {
                            "funcName": "fluid.value",
                            "args": ["{that}.dom.input", "this was set from the options block"]
                        }
                    }
                }
            },
            markupInput:  "<div class=\"view-container\">\n\t<input type=\"text\" class=\"view-input\" value=\"default value\"/>\n</div>"
        },
        model: {
            type:      "{that}.options.defaults.type"
        },
        events: {
            createComponent:   null,
            destroyComponents: null
        },
        invokers: {
            launch: {
                funcName: "fluid.sandbox.launch",
                args :    ["{that}"]
            }
        },
        dynamicComponents: {
            bucket: {
                createOnEvent: "createComponent",
                type:          "{arguments}.0.type",
                container:     "{arguments}.0.container",
                options:       "{arguments}.0.options"
            }
        },
        listeners: {
            "onCreate.bindStartButton": [
                {
                    "this": "{that}.dom.start",
                    method: "click",
                    args:   "{that}.launch"
                }
            ],
            "onCreate.populateEditors": {
                "funcName": "fluid.sandbox.populateEditors",
                "args":     ["{that}"]
            }
        },
        components: {
            optionsEditor: {
                type:      "fluid.lintingCodeMirror",
                container: "{that}.options.selectors.options",
                options: {
                    mode: "application/json",
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    smartIndent: true,
                    indentUnit: 2,
                    tabSize:    2,
                    lineNumbers: true,
                    gutters: ["CodeMirror-lint-markers"]
                }
            },
            htmlEditor: {
                type:      "fluid.lintingCodeMirror",
                container: "{that}.options.selectors.markupInput",
                options: {
                    mode:       "htmlmixed",
                    lineNumbers: true
                }
            }
        }
    });
})(jQuery);