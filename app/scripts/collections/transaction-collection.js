/*global define */

define([
    'backbone',
    'models/transaction-model'
], function (Backbone, Transaction) {

    'use strict';

    return Backbone.Collection.extend({

        urlRoot: function () {
            if (app.config.fixtures) {
                return 'scripts/fixtures/transactionsCollection.json?';
            } else {
                return this.model.urlRoot();
            }
        },

        model: Transaction
        
    });

});