# The Fluid Sandbox

This package provides a sandbox that helps you learn to work with Fluid using only configuration options and markup.

The interface allows you to enter:

1.  Any additional HTML markup that is required (for example, for a view component).
2.  The component options.  NOTE:  The options are entered in [the format used for a dynamic component](http://docs.fluidproject.org/infusion/development/SubcomponentDeclaration.html#dynamic-components), so you are expected to specify a `type` and `options` at a minimum.

When you press the "Reload" button:

1. Any previously created dynamic components will be destroyed.
2. Your markup will be added to the DOM
3. A dynamic component will be created with the selected options.

The Fluid components included with the framework are all available, for more information see the [Infusion documentation](http://docs.fluidproject.org/infusion/development/).

# Viewing the Included Demos

To view the bundled demos as a static site:

1. `npm install`
2. `npm run generateContent`
3. Open `generated/index.html` in a browser.