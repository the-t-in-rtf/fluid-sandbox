// A "sandbox" learning environment where you can instantiate a Fluid component dynamically.
//
// See the README file in this project for usage details.
//
/* global fluid, jQuery */
(function () {
    "use strict";
    fluid.registerNamespace("fluid.sandbox");
    fluid.setLogging(true);

    // TODO:  Add demo for progress
    // TODO:  Add demo for pager

    fluid.registerNamespace("fluid.sandbox.codeMirror.refresh");
    fluid.sandbox.codeMirror.refresh = function (editor) {
        editor.refresh();
    };

    fluid.defaults("fluid.sandbox.codeMirror", {
        gradeNames: ["fluid.lintingCodeMirror"],
        invokers: {
            refresh: {
                funcName: "fluid.sandbox.codeMirror.refresh",
                args:     ["{that}.editor"]
            }
        }
    });

    fluid.sandbox.launch = function (that) {
        // TODO: Put fluid.destroyable marker grade back in so that we can destroy any previous dynamic components.
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
            createComponent: null,
            tabsChanged:     null
        },
        invokers: {
            launch: {
                funcName: "fluid.sandbox.launch",
                args :    ["{that}"]
            }
        },
        // TODO:  Talk with Antranig about when (if ever) we'll be able to use a regular component.
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
                type:      "fluid.sandbox.codeMirror",
                container: "{that}.options.selectors.options",
                options: {
                    mode: "application/json",
                    events: {
                        tabsChanged: "{fluid.sandbox}.events.tabsChanged"
                    },
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
                        },
                        "tabsChanged.refresh": {
                            "func": "{that}.refresh"
                        }
                    }
                }
            },
            htmlEditor: {
                type:      "fluid.sandbox.codeMirror",
                container: "{that}.options.selectors.markupInput",
                options: {
                    mode:       "htmlmixed",
                    events: {
                        tabsChanged: "{fluid.sandbox}.events.tabsChanged"
                    },
                    lineNumbers: true,
                    listeners: {
                        "onCreate.populate": {
                            "func": "{that}.setContent",
                            "args": ["{sandbox}.options.markupContent"]
                        },
                        "tabsChanged.refresh": {
                            "func": "{that}.refresh"
                        }
                    }
                }
            },
            tabControls: {
                type: "fluid.tabs",
                container: ".fluid-tabs",
                options: {
                    tabOptions: {
                        heightStyle: "content"
                    },
                    listeners: {
                        "tabsshow.notifyParent": {
                            funcName: "{fluid.sandbox}.events.tabsChanged.fire",
                            args:     []
                        }
                    }
                }
            }
        }
    });
})(jQuery);
