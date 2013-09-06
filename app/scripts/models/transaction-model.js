/*global define */

define([
    'backbone'
], function (Backbone) {

    'use strict';

    return Backbone.Model.extend({

        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/transactionModel.json?';
            } else {
                return '/transaction';
            }
        },

        idAttribute: 'id'

    });

});