/*global define, document, window */

define([
    'jquery',
    'backbone',
    'libs/json2/json2'
], function ($, Backbone, JSON) {

    'use strict';

    return Backbone.View.extend({

        /**
        * @function
        * @param {Object} data
        */
        announce: function (data, config) {

            var proxy = config.proxy || config.caller,
                $iframe,
                jsonData = {
                    r: config.resp,
                    d: data,
                    f: (data.success === false) ? 'error' : 'success'
                };

            // Same domain
            if (proxy.indexOf(document.location.hostname) !== -1) {

                // Call the iframe's parent one level up
                window.parent.moontoastApplication('callback', jsonData);

            // Different domain
            } else {

                $iframe = $('<iframe />');

                if (proxy.indexOf('?') !== -1) {
                    proxy += '&r=' + config.resp;
                } else {
                    proxy += '?r=' + config.resp;
                }

                // Set up the iframe inside of the caller domain to call up to the parent
                $iframe.attr({
                    src: proxy + '#' + JSON.stringify(jsonData),
                    height: 0,
                    width: 0,
                    frameborder: 0
                });

                // Append the iframe to the body
                $('body').append($iframe);

            }

        },

        /**
        * @function
        */
        render: function (obj) {

            var self = this;
            console.log(obj);
            // We use a plain jQuery ajax call here instead of a backbone model interation to make it more flexible
            $.ajax($.extend(obj, {

                // Success Callback
                success: function (data) {
                    self.announce(data, obj);
                },

                // Error Callback
                error: function (data) {
                    data.success = false;
                    self.announce(data, obj);
                }

            }));
        }

    });

});
