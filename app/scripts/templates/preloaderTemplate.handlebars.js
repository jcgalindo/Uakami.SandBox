define(function () {
    //define to return text block to avoid cross domain issues
    //every CSS and handlebars file will need a raw version and a .js version
    //see https://github.com/requirejs/text for more details on XHR restrictions
    return "<div id=\"{{id}}\" style=\"width: {{width}}; height: {{height}}; top: {{top}}; left: {{left}}; background: {{backgroundColor}}{{#backgroundImage}} url('{{this}}'){{/backgroundImage}} no-repeat; position: absolute; z-index: 9;\"></div>";
});
