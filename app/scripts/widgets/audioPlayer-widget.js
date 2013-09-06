/*global define, $, Handlebars */

define([
    'backbone',
    'moontemplate',
    'tysonaudio',
    'text!templates/audioPlayer.handlebars',
], function (Backbone, moontemplate, tysonAudio, Template) {

    'use strict';

    return Backbone.View.extend({

        /**
        * @function
        */
        play: function (template) {
            var self = this;
            this.audio.play();
            this.$el.find('.play_pause').attr({
                'src': '//moontoast-assets-live.s3.amazonaws.com/moontemplate/images/audioPlayer/pause.png'
            }).unbind('click').bind('click', function () {
                self.pause(template);
            });
        },

        /**
        * @function
        */
        pause: function (template) {
            var self = this;
            this.audio.pause();
            this.$el.find('.play_pause').attr({
                'src': '//moontoast-assets-live.s3.amazonaws.com/moontemplate/images/audioPlayer/play.png'
            }).unbind('click').bind('click', function () {
                self.play(template);
            });
        },

        /**
        * @function
        */
        setVolume: function (template, volume) {

            var level,
                $el = $('#volume_level_' + template.rootId + '_' + volume);

            // Set the volume display
            $el.prevAll().addClass('on');
            $el.addClass('on');
            $el.nextAll().removeClass('on');

            switch (parseInt(volume)) {
                case 1:
                    level = 0;
                    break;
                case 2:
                    level = 0.2;
                    break;
                case 3:
                    level = 0.4;
                    break;
                case 4:
                    level = 0.6;
                    break;
                case 5:
                    level = 0.8;
                    break;
                case 6:
                    level = 1;
                    break;
            }

           this.$el.find('#preview_audio_' + template.rootId).tysonAudio('setVolume', level);

        },

        /**
        * @function
        * @param {Object} template
        * @param {Object} data
        */
        createTemplate: function (template, data) {

            var self = this;

            // We'll use this id all over the place
            template.rootId = new Date().getTime();

            // Default the width and height
            template.width = template.width || '100%';
            template.height = template.height || '100%';

            // Let Handlebars do its thing
            template.content = Handlebars.compile(Template)(template);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(template, data);

            // Use TysonAudio to make the audio file have a flash fallback if needed
            this.audio = this.$el.find('#preview_audio_' + template.rootId).tysonAudio({
                swfPath: '//moontoast-assets-live.s3.amazonaws.com/moontemplate/flash/jquery-tysonaudio.swf'
            });

            // Bind the audio time update event
            this.$el.find('#preview_audio_' + template.rootId).tysonAudio('timeupdate', function (obj) {
                $('#slider_inner_' + template.rootId).css({
                    width: (100 * obj.currentTime / obj.duration) + '%'
                });
            });

            // Volume Change Click Event
            this.$el.find('.volume_level').bind('click', function () {
                self.setVolume(template, $(this).attr('id').replace('volume_level_' + template.rootId + '_', ''));
            });

            // Autoplay
            if (template.autoPlay) {
                this.play(template);

            // Not autoplay
            } else {
                this.pause(template);
            }

            this.audio.ended(null, function(){ self.pause(); });
        },

        /**
        * @function
        * @param {Object} obj
        */
        render: function (obj) {

            this.createTemplate(obj.template.options, obj.data);

        }

    });

});
