/*global define, app */

define([
    'backbone'
], function (Backbone) {

    'use strict';

    return Backbone.Model.extend({

        urlRoot: function () {
            var getHost = document.createElement('a');
            getHost.href = require.toUrl('');
            if(typeof config.hostUrl != 'undefined' && typeof config.rootUrl != 'undefined'){
                if(config.rootUrl.hostname == config.hostUrl.hostname){
                    var root = '/app/scripts/fixtures/';
                }else{
                    var root = '//' + config.rootUrl.hostname + '/app/scripts/fixtures/';
                }
            }
            var rand = Math.random().toString(36).substring(7);

            if(typeof uuid != 'undefined'){
                app.config.id = uuid;
            }
            // Use a fixture
            if (app.config.fixtures) {
                // If the widget is specified, the fixture for that widget should be returned
                switch (app.config.widget) {
                    case 'audio': return root + 'offerModelAudio.json?'; break;
                    case 'form': return root + 'offerModelForm.json?'; break;
                    case 'preloader': return root + 'offerModelPreloader.json?'; break;
                    case 'youtube': return root + 'offerModelYouTube.json?'; break;
                    case 'videolooper': return root + 'offerModelVidLoop.json?'; break;
                    default: return root + 'offerModelVideo.json?'; break;
                }

            // Use the local fixtures folder
            } else if (app.config.debug == 'true') {
                if(config.hostUrl.domain !== config.rootUrl.domain){
                    // allow cross-domain requests
                    // remote server allows CORS
                    return root + app.config.id +'.json.js?cache=' + rand;
                }else{
                    return root + app.config.id +'.json?cache=' + rand;
                }

            }else{
                // Use the real offers api
                if(typeof app.config == 'undefined' || typeof app.config.id == 'undefined'){

                    // Render a 404 message
                    $('body').moontemplate({
                        content: '<h1>404</h1><p>The offer was not found. <br />Look in the browser console to see why the call is failing.</p>',
                        backgroundColor: '#FFFFFF',
                        left: 20
                    });
                    throw 'no config or config ID found';
                }else{
                    if(typeof offerEndpoint != 'undefined'){
                        return offerEndpoint;
                    }else{
                        return '//api.moontoast.com/offers/';
                    }
                }

            }
        },

        idAttribute: 'id'

    });

});
