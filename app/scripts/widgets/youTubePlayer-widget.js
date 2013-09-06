/*global define, require, $, document, window, YT, setTimeout */

var onYouTubeIframeAPIReady;

define([
    'backbone',
    'moontemplate',
    'text!styles/index.css',
], function (Backbone) {

    'use strict';

    return Backbone.View.extend({

        /**
        * @function
        */
        createPoster: function (event) {

            var $iframe =  $('#' + this.$el.attr('id')),
                self = this;

            // Generate the poster image

            if (this.template.options.posterImage) {

                // Create the Element
                this.$posterImage = $('<div />'

                // Set the attributes
                ).attr({
                    'id': 'poster_image_' + new Date().getTime()

                // Style it
                }).css({
                    'background-image': 'url(' + this.template.options.posterImage + ')',
                    'width': this.parentTemplate.width || '100%',
                    'height': this.parentTemplate.height || '100%',
                    'left': this.parentTemplate.left || '0px',
                    'top': this.parentTemplate.top || '0px',
                    'position': 'absolute',
                    'cursor': 'pointer'

                // Bind the click
                }).bind('click', function () {
                    self.hidePoster();
                    self.playVideo();
                });

                // Append the poster image element after the video element
                $iframe.after(this.$posterImage);

                // Hide the poster image if autoplay is on
                if (this.template.options.autoPlay) {
                    this.hidePoster();
                }

            }
        },

        /**
        * @function
        */
        playVideo: function () {
            var self = this;
            if (typeof this.player.playVideo === 'function') {
                this.player.playVideo();
            } else {
                setTimeout(function () {
                    self.playVideo();
                }, 100);
            }
        },

        /**
        * @function
        */
        showPoster: function () {
            if (this.$posterImage) {
                this.$posterImage.show();
                $('#' + this.$el.attr('id')).hide();
            }
        },

        /**
        * @function
        */
        hidePoster: function () {
            if (this.$posterImage) {
                this.$posterImage.hide();
            }
            $('#' + this.$el.attr('id')).show();
        },

        /**
        * @function
        */
        onStateChange: function (event) {

            var self = this;
            switch (event.data) {

                // Loaded
                case -1:
                break;

                // Movie Ended
                case 0:
                    if (self.template.options.videoEnd) {

                        // Trigger the videoEnd as a moontemplate link
                        /*
                        $('body').trigger('moontemplate:link', {
                            data: self.data,
                            template: {
                                click: self.template.options.videoEnd
                            }
                        });
                        */

                        self.template.options.dite.eventName = "videoComplete";
                        $('body').trigger('dite', self.template.options.dite);

                    } else {
                        self.showPoster();
                    }
                break;

                // Playing
                case 1:
                    if(/iphone|ipad/i.test(navigator.userAgent)){
                        //check if the player is new
                        //check if the player has been paused
                        if(!self.playerStart || self.paused){
                            self.playerStart = true;
                            self.paused = false;
                            self.template.options.dite.eventName = "videoPlay";
                            $('body').trigger('dite', self.template.options.dite);
                        }
                    }else{
                        self.template.options.dite.eventName = "videoPlay";
                        $('body').trigger('dite', self.template.options.dite);
                    }
                    self.hidePoster();
                    self.playCount++;
                break;

                // Pause
                case 2:
                    self.template.options.dite.eventName = "videoPause";
                    $('body').trigger('dite', self.template.options.dite);
                    self.paused = true;
                break;

            }
        },

        /**
        * @function
        */
        renderPlayer: function (obj) {

            var self = this, $iframe;
            this.player = new YT.Player(this.$el.attr('id'), {
                height: obj.template.options.height || '100%',
                width: obj.template.options.width || '100%',
                videoId: obj.template.options.videoId,
                playerVars: {
                    autoplay: ((obj.template.options.autoPlay) ? 1 : 0),
                    controls: ((obj.template.options.showControls) ? 1 : 0)
                },
                events: {
                    onReady: function () {
                        $iframe = $('#' + self.$el.attr('id'));
                        $iframe.bind('show', function () {
                            self.render(obj);
                        });
                        $iframe.bind('hide', function () {
                            self.remove(obj);
                        });
                    },
                    onStateChange: function (event) {
                        self.onStateChange(event);
                    }
                }
            });

            // This is a hack... for some reason it renders with display: none >:(
            $(this.player.getIframe()).css('display', 'block');

            // Create the poster image
            this.createPoster();

        },

        /**
        * @function
        */
        remove: function (obj) {
            var self = this;
            $('#' + this.$el.attr('id')).replaceWith('<div id="' + this.$el.attr('id') + '" style="' + this.$el.attr('style') + '" />');
            $('#' + this.$el.attr('id')).bind('show', function () {
                self.render(obj);
                self.playVideo();
            });
            if (this.$posterImage) {
                this.$posterImage.remove();
            }
        },

        /**
        * @function
        */
        render: function (obj) {

            var self = this;

            this.data = obj.data;
            this.template = obj.template;
            this.parentTemplate = obj.parentTemplate;
            this.playCount = 0;
            this.playerStart = false;
            this.paused = false;

            if (typeof YT === 'undefined') {
                require(['//www.youtube.com/iframe_api'], function (YouTube) {
                    onYouTubeIframeAPIReady = function () {
                        self.renderPlayer(obj);
                    };
                });
            } else {
                this.renderPlayer(obj);
            }

        }

    });

});
