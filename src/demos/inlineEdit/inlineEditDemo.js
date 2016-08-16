/*
Copyright 2010 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* global fluid */

var demo = demo || {};
(function ($, fluid) {
    "use strict";
    
    fluid.registerNamespace("demo.inlineEdit");
    demo.inlineEdit.undoRenderer = function (that, targetContainer) {
        var markup =
            "<span class='flc-undo'>" +
            "<span class='demo-undoContainer' role='button'><a href='#' class='demo-undoControl'>Undo</a></span>" +
            "<span class='demo-redoContainer' role='button'><a href='#' class='demo-redoControl'>Redo</a></span>" +
            "</span>";
        var markupNode = $(markup);
        targetContainer.append(markupNode);
        return markupNode;
    };


    fluid.defaults("demo.inlineEdit.title", {
        gradeNames: ["fluid.inlineEdit"],
        components: {
            undo: {
                type: "fluid.undo",
                options: {
                    selectors: "{demo.inlineEdit}.options.selectors",
                    renderer:  demo.inlineEdit.undoRenderer
                }
            }
        },
        styles: {
            edit: "demo-inlineEdit-title-edit demo-inlineEdit-edit"
        },
        strings: {
            defaultViewText: "Edit this",
            defaultFocussedViewText: "Edit this (click or press enter)"
        }
    });

    fluid.defaults("demo.inlineEdit.caption", {
        gradeNames: ["fluid.inlineEdit"],
        components: {
            undo: {
                type: "fluid.undo",
                options: {
                    selectors: "{demo.inlineEdit}.options.selectors",
                    renderer:  demo.inlineEdit.undoRenderer
                }
            }
        },
        strings: {
            defaultViewText: "Edit this",
            defaultFocussedViewText: "Edit this (click or press enter)"
        }
    });

    fluid.defaults("demo.inlineEdit", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            undoContainer: ".demo-undoContainer",
            undoControl: ".demo-undoControl",
            redoContainer: ".demo-redoContainer",
            redoControl: ".demo-redoControl"
        },
        components: {
            title: {
                type:      "demo.inlineEdit.title",
                container: ".demoSelector-inlineEdit-container-title"
            },
            caption: {
                type:      "demo.inlineEdit.caption",
                container: ".demoSelector-inlineEdit-container-caption"
            }
        }
    })
})(jQuery, fluid);
