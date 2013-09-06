define(function () {
    //define to return text block to avoid cross domain issues
    //every CSS and handlebars file will need a raw version and a .js version
    //see https://github.com/requirejs/text for more details on XHR restrictions
    return "<div style=\"position: relative; display: block; \" class=\"undefined\" id=\"{{id}}\"> <div style=\"position: relative; width: 100%; height: 100%; overflow: hidden;\">{{content}}</div> </div>";
});
