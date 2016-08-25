/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.defaults("fluid.sandbox.dynamicDemo", {
    gradeNames: ["fluid.component"],
    events: {
        createComponent: null
    },
    components: {
        bucket: {
            createOnEvent: "createComponent",
            type:          "{arguments}.0.type",
            container:     "{arguments}.0.container",
            options:       "{arguments}.0.options"
        }
    }
});

var dynamo = fluid.sandbox.dynamicDemo();

dynamo.events.createComponent.fire({
    type: "fluid.component",
    options: {
        listeners: {
            onCreate: {
                funcName: "console.log",
                args: ["dynamic component, top-level listener"]
            }
        }
    }
});
