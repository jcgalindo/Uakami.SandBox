/*jslint nomen: true */
/*global define, $, Handlebars, _V_ */

define([
    'backbone',
    'moontemplate',
    'libs/jwplayer/jwplayer',
    'text!templates/videoStream.handlebars'
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
            
            this.renderPlayer();

        },
        
        renderPlayer: function(){
            if(/(iPhone|iPod|iPad|Android|webOS|BlackBerry|Android)/i.test(navigator.userAgent)) {
                var mobile = true;
            } else {
                var mobile = false;
            }
            
            if(mobile){
                //window.location.hash = '/youtube';
                jwplayer("video_container").setup({
                    "id": "video_container",
                    "width": "280",
                    "height": "200",
                    "image": "http://www.imax.com/t-rex/images/Tcentralimg.gif",
                    "autoStart": "false",
                    "modes": [
                      {
                            "type": "html5",
                            "config": {
                              "file": "http://aegdm.edgesuite.net/jackmorton/moontoast/hls1/master.m3u8",
                              "provider": "video"
                            }
                      }
                    ]
                });

                //jwplayer().onPlay(function() { view.analytics.track('default/clickPlay'); });
                //jwplayer().onPause(function() { view.analytics.track('default/clickPause'); });

            }else{
                jwplayer("video_stream").setup({
                    "id": "video_stream",
                    "width": "280",
                    "height": "200",
                    "image": "https://lexus-moontoast.s3.amazonaws.com/lexus-live-reveal/vid_poster.png",
                    "autoStart": "false",
                    "modes": [
                      {
                            "type": "flash",
                            "src": "https://s3.amazonaws.com/apps.moontoast.com/alienware_live/app/scripts/libs/jwplayer/player.swf",
                            "config": {
                              "playlist": [
                                    {
                                      "title": "Lexus Reveal",
                                      "provider": "rtmp",
                                      "rtmp.subscribe": "true",
                                      "streamer": "rtmp://cp140826.live.edgefcs.net/live",
                                      "levels": [
                                            {
                                              "bitrate": "435",
                                              "width": "286",
                                              "file": "jackmorton_1_400@118701"
                                            },
                                            {
                                              "bitrate": "778",
                                              "width": "480",
                                              "file": "jackmorton_1_600@118701"
                                            },
                                            {
                                              "bitrate": "1328",
                                              "width": "720",
                                              "file": "jackmorton_1_1300@118701"
                                            }
                                      ]
                                    }
                              ]
                            }
                      },
                      {
                            "type": "html5",
                            "config": {
                              "image": "http://www.imax.com/t-rex/images/Tcentralimg.gif",
                              "file": "http://aegdm.edgesuite.net/jackmorton/moontoast/hls1/master.m3u8",
                              "provider": "video"
                            }
                      }
                    ]
                });

                jwplayer().onPlay(function() { view.analytics.track('default/clickPlay'); });
                jwplayer().onPause(function() { view.analytics.track('default/clickPause'); });
            }
        }

    });

});