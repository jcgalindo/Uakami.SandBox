/*global define */

define([
    'backbone'
], function (Backbone) {

    'use strict';

    return Backbone.Model.extend({

        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/loggerModel.json?';
            } else {
                return '/logger';
            }
        },

        idAttribute: 'id'

    });

});