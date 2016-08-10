// A "sandbox" learning environment where you can instantiate a Fluid component dynamically.
//
// See the README file in this project for usage details.
//
/* global fluid, jQuery */
(function () {
    "use strict";
    fluid.registerNamespace("fluid.sandbox");
    fluid.setLogging(true);

    fluid.sandbox.launch = function (that) {
        var markupInput = that.htmlEditor.getContent();
        if (markupInput) {
            var htmlContainer = that.locate("markupOutput");
            htmlContainer.html(markupInput);
        }

        var configJSON = JSON.parse(that.optionsEditor.getContent());

        /*

            This event results in the creation of a single disposable dynamic component.  `configJson` is expected to
            contain a `type`, `container`, and `options`.

         */
        that.events.createComponent.fire(configJSON);
    };

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
        model: {
            type:      "{that}.options.defaults.type"
        },
        events: {
            createComponent: null
        },
        invokers: {
            launch: {
                funcName: "fluid.sandbox.launch",
                args :    ["{that}"]
            }
        },
        dynamicComponents: {
            // TODO:  Test with non-viewComponent
            bucket: {
                createOnEvent: "createComponent",
                type:          "{arguments}.0.type",
                container:     "{arguments}.0.container",
                options:       "{arguments}.0.options"
            }
        },
        listeners: {
            "onCreate.launch": {
                func: "{that}.launch"
            },
            "onCreate.bindStartButton": [
                {
                    "this": "{that}.dom.start",
                    method: "click",
                    args:   "{that}.launch"
                }
            ]
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
                    gutters: ["CodeMirror-lint-markers"],
                    listeners: {
                        "onCreate.populate": {
                            "func": "{that}.setContent",
                            "args": ["@expand:JSON.stringify({sandbox}.options.componentOptions, null, 2)"]
                        }
                    }
                }
            },
            htmlEditor: {
                type:      "fluid.lintingCodeMirror",
                container: "{that}.options.selectors.markupInput",
                options: {
                    mode:       "htmlmixed",
                    lineNumbers: true,
                    listeners: {
                        "onCreate.populate": {
                            "func": "{that}.setContent",
                            "args": ["{sandbox}.options.markupContent"]
                        }
                    }
                }
            }
        }
    });
})(jQuery);
