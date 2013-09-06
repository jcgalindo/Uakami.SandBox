/*jslint nomen: true */
/*global define, $, Handlebars, _V_ */

define([
    'backbone',
    'moontemplate',
    'libs/video/video',
    'text!templates/videoPlayer.handlebars'
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
            obj.template.content = Handlebars.compile(Template)(obj.template.options); 

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);

            setTimeout(function () {

                self.player = _V_('video_' + obj.template.options.rootId);

                // Play Event
                self.player.addEvent('play', function () {
                    if (obj.template.options.showControls) {
                        self.player.controlBar.show();
                    } else {
                        self.player.controlBar.hide();
                    }
                    $('.vjs-loading-spinner').css('opacity', 0);
                });

                // Ended Event
                self.player.addEvent('ended', function () {

                    self.player.posterImage.show();
                    self.player.controlBar.hide();

                    if (obj.template.options.videoEnd) {

                        // Trigger the videoEnd as a moontemplate link
                        $('body').trigger('moontemplate:link', {
                            data: obj.data,
                            template: {
                                click: obj.template.options.videoEnd
                            }
                        });

                    }

                });

                // Play the video if the element is shown
                self.$el.bind('show', function () {
                    self.player.play();
                });

                // Pause the video if the element is hidden
                self.$el.bind('hide', function () {
                    self.player.pause();
                });

                // Autoplay
                if (obj.template.options.autoPlay) {
                    self.player.play();
                }

            }, 100);

        }

    });

});