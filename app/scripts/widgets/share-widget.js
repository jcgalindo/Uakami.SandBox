/*global define, $, Handlebars */
/*jslint plusplus: true */
define([
    'backbone',
    'moontemplate',
    'text!styles/widgets/share.css',
], function (Backbone, moontemplate, css) {

    'use strict';

    return Backbone.View.extend({

        /**
        * @function
        */
        renderShareLink: function (obj) {

            // Default the network to facebook
            if (!obj.network) {
                obj.network = 'facebook';
            }

            // Default the URL to ours
            if (!obj.url) {
                obj.url = 'http://moontoast.com';
            }

            // Pass in the unique url if we need it
            if (obj.uniqueUrl) {
                if (obj.url.indexOf('?') !== -1) {
                    obj.url = obj.url + '&_=' + new Date().getTime();
                } else {
                    obj.url = obj.url + '?_=' + new Date().getTime();
                }
            }


            // Pass in arguments if there are any
            if (obj.args) {
                if (obj.url.indexOf('?') !== -1) {
                    obj.url += '?';
                }else{
                    obj.url += '&';
                }
                var i = 1;

                var queryString = '';
                var i = 1;
                $.each(obj.args, function(k, v){
                        queryString += k + '=' + v + '&';
                        i++;
                });

                obj.url = obj.url + queryString;
            }

            // Return a proper A tag
            if(obj.network == 'google+'){
                var netName = 'googlePlus';
                var imageName = 'googleplus';
            }else{
                var netName = obj.network;
                var imageName = obj.network;
            }


            return '<a data-network="' + netName + '" class="social_icon social_icon_' + obj.network + '" href="http://api.addthis.com/oexchange/0.8/forward/' + imageName + '/offer?pco=tbx32nj-1.0&url=' + Handlebars.compile(obj.url)(obj.data) + '" target="_blank" style="background-image: url(//apps.moontoast.com.s3.amazonaws.com/equinot/html/assets/' + imageName + '.png);">' + obj.network.toUpperCase() + '</a>';

        },

        /**
        * @function
        */
        render: function (obj) {

            $('head').append('<style type="text/css">' + css + '</style>');

            var template = {
                    id: 'share_' + new Date().getTime(),
                    content: ''
                },
                self = this,
                options = obj.template.options,
                uniqueUrl = true,
                i = 0,
                j = 0,
                networkParent,
                network;

            // Global uniqueURL
            if (options.uniqueUrl === false || options.uniqueUrl === 'false') {
                uniqueUrl = false;
            }

            // You'd better have this... it's kind of important
            if (options.networks) {

                // Loop over all of the parent networks
                for (i = 0; i < options.networks.length; i++) {

                    // Shorthand
                    networkParent = options.networks[i];

                    // Granular uniqueURL
                    if (networkParent.uniqueUrl === false || networkParent.uniqueUrl === 'false') {
                        uniqueUrl = false;
                    }

                    // Multiple share icons
                    if (networkParent.networks) {
                        for (j = 0; j < networkParent.networks.length; j++) {
                            template.content += self.renderShareLink({
                                network: networkParent.networks[j],
                                url: networkParent.url,
                                data: obj.data,
                                uniqueUrl: uniqueUrl,
                                args: networkParent.args
                            });
                            if (options.buttonsPerRow && (((j + 1) % options.buttonsPerRow) === 0)) {
                                template.content += '<br />';
                            }
                        }

                    // Single Share icon
                    } else if (networkParent.network) {
                        template.content += self.renderShareLink({
                            network: networkParent.network,
                            url: networkParent.url,
                            data: obj.data,
                            uniqueUrl: uniqueUrl,
                            args: networkParent.args
                        });
                    }

                }

            // Throw an error if there are no networks
            } else {
                throw 'There are no networks passed into the share widget.';
            }

            // Add the HTML to the DOM
            this.$el.moontemplate(template, obj.data);

            // DITE Logging
            this.$el.find('.social_icon').bind('click', function () {
                $('body').trigger('dite', {
                    screenName: 'share',
                    eventName: $(this).data('network'),
                    eventData: undefined
                });
                return true;
            });

        }

    });

});
