/*

    A script to call `fluid.sandbox.generator` with the default options.  Generates a page per demo component and an
    about/index page.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);
require("../../");

fluid.sandbox.generator();
