This package provides a sandbox in which you can learn to work with Fluid using only configuration options.

The interface asks you to enter a base gradeName (`fluid.component` by default) and the `options` for the component in JSON format..

If your component expects to work with particular markup, you are expected to enter it in the `markup` input field.

When you press the "Start" button:

1. Any previously created components will be destroyed.
2. Your markup will be added to the DOM
3. A component with the selected grade will be created with the selected options.

The Fluid components included with the framework are all available, for more information see the [Infusion documentation](http://docs.fluidproject.org/infusion/development/).

To get started, run `npm install` and then open the file src/html/index.html in your browser.