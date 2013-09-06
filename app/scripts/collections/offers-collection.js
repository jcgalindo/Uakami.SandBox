/*global define */

define([
    'backbone',
    'models/offer-model'
], function (Backbone, Offer) {

    'use strict';

    return Backbone.Collection.extend({

        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/offersCollection.json?';
            } else {
                return this.model.urlRoot();
            }
        },

        model: Offer

    });

});