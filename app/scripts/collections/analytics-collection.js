/*global define */

define([
    'backbone',
    'models/analytics-model'
], function (Backbone, Analytics) {

    'use strict';

    return Backbone.Collection.extend({

        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/analyticsCollection.json?';
            } else {
                return this.model.urlRoot();
            }
        },

        model: Analytics
    });

});