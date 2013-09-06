/*global define */

define([
    'backbone'
], function (Backbone) {

    'use strict';

    return Backbone.Model.extend({

        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/appModel.json?';
            } else {
                return '/apps';
            }
        },

        idAttribute: 'id'

    });

});