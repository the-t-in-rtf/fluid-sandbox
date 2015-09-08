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

        var options = JSON.parse(that.optionsEditor.getContent());

        var dynamicGrades = fluid.sandbox.parseGrades(that.model.grades);
        options.gradeNames = options.gradeNames ? options.gradeNames.concat(dynamicGrades) : dynamicGrades;

        that.events.createComponent.fire(options);
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
        that.optionsEditor.setContent(that.options.defaults.options);
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
            grades:       ".sandbox-grades",
            options:      ".sandbox-options",
            markupInput:  ".sandbox-html-input",
            markupOutput: ".sandbox-html-output",
            start:        ".sandbox-start-button"
        },
        bindings: {
            grades:      "grades"
        },
        mergePolicy: {
            defaults: "noexpand"
        },
        defaults: {
            grades:       "fluid.viewComponent",
            options:      "{\n  \"container\": \".view-container\",\n  \"selectors\": {\n    \"input\": \".view-input\"\n  },\n  \"listeners\": {\n    \"onCreate.log\": {\n      \"funcName\": \"fluid.log\",\n      \"args\": [\"Hello, World.\"]\n    },\n    \"onCreate.setValue\": {\n      \"funcName\": \"fluid.value\",\n      \"args\": [\"{that}.dom.input\", \"this was set from the options block\"]\n    }\n  }\n}",
            markupInput:  "<div class=\"view-container\">\n\t<input type=\"text\" class=\"view-input\" value=\"default value\"/>\n</div>"
        },
        model: {
            grades:      "{that}.options.defaults.grades"
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
                type:          "fluid.sandbox.destroyable",
                options:       "{arguments}.0"
            }
        },
        listeners: {
            "onCreate.applyBindings": {
                "funcName": "gpii.templates.binder.applyBinding",
                "args":     "{that}"
            },
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