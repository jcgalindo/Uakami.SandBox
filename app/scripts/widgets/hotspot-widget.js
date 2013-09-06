/*jslint nomen: true */
/*global define, $, Handlebars, _V_ */

define([
    'backbone',
    'moontemplate',
    'libs/video/video',
    'text!templates/hotspot.handlebars'
], function (Backbone, moontemplate, VideoJs, Template) {

    'use strict';

    return Backbone.View.extend({

        /**
        * @function
        */
        render: function (obj) {

            var self = this;

            // Create a unique id for the video player
            obj.template.options.rootId = new Date().getTime();

            // Default the width and height if they aren't implicitly stated
            obj.template.options.width = obj.template.options.width || '100%';
            obj.template.options.height = obj.template.options.height || '100%';
            obj.template.options.top = obj.template.options.top || '0px';
            obj.template.options.left = obj.template.options.left || '0px';

            // Let Handlebars do its thing
            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);
            
            console.log(obj.template);

        }

    });

});