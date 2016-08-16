/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.module.register("fluid-sandbox", __dirname, require);

// Only the loader grades are available from within node.  Everything else is a client-side grade.
require("./src/js/loader");

require("./src/demos/component/loader");
require("./src/demos/inlineEdit/loader");
require("./src/demos/pager/loader");
require("./src/demos/reorderer/loader");
require("./src/demos/viewComponent/loader");
