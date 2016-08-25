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
        fluid.destroy(that.options.componentPath);

        // Update the markup before we recreate the dynamic component.
        var markupInput = that.htmlEditor.getContent();
        if (markupInput) {
            var htmlContainer = that.locate("markupOutput");
            htmlContainer.html(markupInput);
        }

        /*

            (Re)create our dynamic component.  `configJson` is expected to correspond to a subcomponent definition, and
            should contain a `type`, `options`, and (for viewComponent grades) a `container`.

         */
        fluid.construct(that.options.componentPath, {
            type: "fluid.sandbox.dynamicComponent",
            components: {
                innerComponent: JSON.parse(that.optionsEditor.getContent())
            }
        });

        that.events.onRefresh.fire(that);
    };

    // A "marker" grade that can be use to our dynamic component externally.
    fluid.defaults("fluid.sandbox.dynamicComponent", {
        gradeNames: ["fluid.component"]
    });

    fluid.defaults("fluid.sandbox", {
        gradeNames: ["fluid.viewComponent"],
        componentPath: "fluid_sandbox_dynamic_component",
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
            onRefresh:   null,
            tabsChanged: null
        },
        invokers: {
            launch: {
                funcName: "fluid.sandbox.launch",
                args :    ["{that}"]
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
        members: {
            configJSON: {
                type: "fluid.component"
            }
        },
        components: {
            optionsEditor: {
                type:      "fluid.sandbox.codeMirror",
                container: "{that}.options.selectors.options",
                options: {
                    // TODO: Make this work with JSON5
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
                    input: "contenteditable",
                    mode: "htmlmixed",
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
                        heightStyle: "auto"
                    },
                    events: {
                        onComponentRefresh: "{fluid.sandbox}.events.onRefresh"
                    },
                    listeners: {
                        "tabsshow.notifyParent": {
                            funcName: "{fluid.sandbox}.events.tabsChanged.fire",
                            args:     []
                        },
                        "onComponentRefresh.refresh": {
                            "this":   "{that}.container",
                            "method": "tabs",
                            "args":   ["refresh"]
                        }
                    }
                }
            }
        }
    });
})(jQuery);
