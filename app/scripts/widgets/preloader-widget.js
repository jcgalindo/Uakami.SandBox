/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars */

define([
    'backbone',
    'lodash',
    'moontemplate',
    'text!templates/preloaderTemplate.handlebars'
], function (Backbone, _, moontemplate, Template) {

    'use strict';

    var objIds = {},
        assets = [],
        $loadingElements = [];

    return Backbone.View.extend({

        /**
        * @function
        * @param {Object} template
        */
        getObjIds: function (template) {

            var i,
                view = this;

            if (template.id) {
                objIds[template.id] = template;
            }

            if (template.elements) {
                for (i = 0; i < template.elements.length; i++) {
                    view.getObjIds(template.elements[i]);
                }
            }

            return objIds;

        },

        /**
        * @function
        * @param {Object} template
        */
        getAssets: function (template) {

            var i,
                view = this;

            // Add the background image to the assets array
            if (template.backgroundImage) {
                assets.push(template.backgroundImage);
            }

            // Loop over the elements and get their assets
            if (template.elements) {
                for (i = 0; i < template.elements.length; i++) {
                    view.getAssets(template.elements[i]);
                }
            }

        },

        /**
        * @function
        * @param {Array} ids
        * @param {Object} elements
        * @param {Object} obj
        */
        preloadAssets: function (ids, elements, obj) {

            var i,
                assetsLoaded = 0,
                view = this,
                network,
                loadingElementsStr = '';

            // Add the preload urls to the assets array
            assets = obj.template.options.preloadUrls || [];

            // Loop over the ids and add them to the assets array
            /*
            for (i = 0; i < ids.length; i++) {
                loadingElementsStr += ', #' + ids[i];
                view.getAssets(elements[ids[i]]);
            }

            // Add the "Elements on finish" to the loading elements array
            for (i = 0; i < obj.template.options.elementsOnFinish.length; i++) {
                loadingElementsStr += ', #' + obj.template.options.elementsOnFinish[i];
            }

            // Get the Elements from the elements string
            loadingElementsStr = loadingElementsStr.replace(',', '');
            $loadingElements = $(loadingElementsStr);
            $loadingElements.hide();
            */
            // Add the networks to be preloaded
            if (obj.template.options.networks) {
                for (i = 0; i < obj.template.options.networks.length; i++) {
                    network = obj.template.options.networks[i];
                    assets.push('//cache.addthiscdn.com/icons/v1/thumbs/32x32/' + network.replace('googleplus', 'google_plusone') + '.png');
                }
            }

            // Preload all of the assets
            $(assets).each(function () {
                var $image = $('<img />');

                // Bind a load event for each image
                $image.bind('load', function () {

                    assetsLoaded++;

                    // If all the assets are loaded
                    if (assetsLoaded === assets.length) {

                        // If there is a click event required
                        if (obj.template.options.requireClick) {

                            // Bind the click event
                            $('#' + obj.parentTemplate.id).css({
                                'cursor': 'pointer'
                            }).bind('click', function () {
                                view.ready(obj);
                            });

                        // If there is no click event required
                        } else {
                            view.ready(obj);
                        }

                    }

                });

                // Preload the image
                $image[0].src = this;

            });

        },

        /**
        * @function
        * @param {Object} obj
        */
        ready: function (obj) {

            var options = obj.template.options,
                $loader = $('#' + obj.parentTemplate.id),
                animationTime = 1000;

            switch (options.transition) {

                // Fade in transition
                case 'fadeIn':

                    // Fade out loader
                    $loader.animate({
                        'opacity': 0
                    }, animationTime);

                    // Fade in elements
                    $loadingElements.css({
                        'opacity': 0,
                        'display': 'block'
                    }).animate({
                        'opacity': 1
                    }, animationTime);

                    break;

                // Slide in right transition
                case 'slideInRight':

                    // Slide out loader
                    $loader.animate({
                        'left': $('body').width()
                    }, animationTime);

                    // Slide in elements
                    $loadingElements.each(function () {
                        var left = $(this).css('left') || 0;
                        $(this).css({
                            'display': 'block',
                            'left': - $('body').width()
                        }).animate({
                            'left': left
                        }, animationTime);
                    });

                    break;

                // Slide in left
                case 'slideInLeft':

                    // Slide out loader
                    $loader.animate({
                        'left': - $('body').width()
                    }, animationTime);

                    // Slide in elements
                    $loadingElements.each(function () {
                        var left = $(this).css('left') || 0;
                        $(this).css({
                            'display': 'block',
                            'left': $('body').width()
                        }).animate({
                            'left': left
                        }, animationTime);
                    });

                    break;

                // No transition
                default:

                    $loader.hide();
                    //$loadingElements.show();

                    break;

            }

        },


        /**
        * @function
        * @param {Object} obj
        */
        render: function (obj) {

            obj.template.options = _.extend({
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: 'transparent'
            }, obj.template.options);

            // Let Handlebars do its thing
            obj.template.content = Handlebars.compile(Template)(obj.template.options);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);

            // Get the root Ids
            obj.ids = this.getObjIds(obj.rootTemplate);

            // Preload those assets!
            this.preloadAssets(obj.template.options.elements, obj.ids, obj);

        }

    });

});
