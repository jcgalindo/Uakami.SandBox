/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars, alert, _ */
/*Thumb selector widget to fire events from image thumbnails into the app container
 *
 **/

define([
    'backbone',
    'moontemplate',
    //'text!styles/widgets/thumbSelector.css',
    'text!templates/thumbRender.handlebars'
], function (Backbone, moontemplate, Template) {

    'use strict';

    return Backbone.View.extend({

        render: function (obj) {
            var self = this;
            self.template = obj.template;
            self.options = obj.template.options;
            // Let Handlebars do its thing
            obj.template.content = Handlebars.compile(Template)(obj.template.options);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);

            $('body').on('select-event', function(event, index, title){
                self.renderImage(self.options.assets[index]);
            });

            //$('head').append('<style type="text/css">' + css + '</style>');
        },

        events: {},

        /**
        * @function
        */
        renderImage: function(assets, title){
            $('#text_render').animate({
                bottom: "-" + $('#text_render').height()
                }, 500, function() {
                // Animation complete.
            });
            var self = this;
            var $el = $('#image_render');
            $el.stop().fadeOut('slow', function(){
                $('#text_render').html('<b>' + assets.name + '</b>' + assets.title);
                var img = new Image();
                img.src = assets.image;
                img.onload = function(){
                    $('#text_render').animate({
                        bottom: "0"
                        }, 500, function() {
                        // Animation complete.
                    });
                    $el.css({
                        'background': 'url("' + assets.image + '")',
                        'background-size': 'cover',
                        'background-position': 'center center'
                    }).stop().fadeIn('slow');

                }

            });
        }

    });

});
