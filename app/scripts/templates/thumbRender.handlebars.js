define(function () {
    //define to return text block to avoid cross domain issues
    //every CSS and handlebars file will need a raw version and a .js version
    //see https://github.com/requirejs/text for more details on XHR restrictions
    return "<div id=\"render_window\"> <div id=\"image_render\"> <div style=\"position: absolute; display: block;\" id=\"text_render\"> <div style=\"position: relative; width: 100%; height: 100%; overflow: hidden;\"><b>DADDY YANKEE</b> LA NOCHE DE LOS DOS FT. NATALIA JIMÉNEZ</div> </div> </div> </div>";
});
