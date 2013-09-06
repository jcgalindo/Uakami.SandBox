/*global define */

define([
    'backbone',
    'models/logger-model'
], function (Backbone, Logger) {

    'use strict';

    return Backbone.Collection.extend({

        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/loggerCollection.json?';
            } else {
                return this.model.urlRoot();
            }
        },
        
        model: Logger

    });

});