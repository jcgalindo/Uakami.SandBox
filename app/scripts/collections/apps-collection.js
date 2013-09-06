/*global define */

define([
    'backbone',
    'models/app-model'
], function (Backbone, App) {

    'use strict';

    return Backbone.Collection.extend({
            
        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/appsCollection.json?';
            } else {
                return this.model.urlRoot();
            }
        },

        model: App
        
    });

});