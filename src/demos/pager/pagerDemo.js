/*
Copyright 2008-2009 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2014 OCAD University
Copyright 2010 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt

*/
/* global fluid */
(function ($, fluid) {
    "use strict";
    fluid.defaults("demo.pager.pagedTable", {
        gradeNames: ["fluid.pagedTable"],
        components: {
            // TODO:  This cannot be collapsed into options.  Review with Justin and Antranig
            bodyRenderer: {
                type: "fluid.table.selfRender",
                options: {
                    selectors: {
                        root: ".demo-pager-table-data",
                        "user-link": ".demo-user-link",
                        "user-comment": ".demo-user-comment",
                        "user-role": ".demo-user-role",
                        "user-email": ".demo-user-email"
                    },
                    rendererOptions: {debugMode: false}
                }
            }
        }
    });
})(jQuery, fluid);
