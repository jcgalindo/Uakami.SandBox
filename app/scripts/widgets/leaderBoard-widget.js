/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars, alert, _ */
/*Leaderboard
 *
 **/

define([
    'backbone',
    'moontemplate',
    'text!templates/leaderBoard.handlebars'
], function (Backbone, moontemplate, Template) {

    'use strict';

    return Backbone.View.extend({

        render: function (obj) {
            var self = this;
            self.template = obj.template;
            self.options = obj.template.options;

            $(self.options.assets).each(function(){
                //console.log(this);
            });

            self.voteResults = obj.data.data;
            self.voteDisplay = [];
            //console.log(self.voteResults);
            var count = 0

            $('#vote_button').on('click', function(){
                $('body').trigger('dite', {screenName:"thankYou/conversionreferral"});
                $('body').trigger('dite', {screenName:"thankYou"});
            });

            $(self.voteResults.voteWidget.byIdAndName).each(function(){
                if(typeof self.options.assets[this.itemId] != 'undefined'){
                    self.voteDisplay[count] =  self.options.assets[this.itemId];
                    self.voteDisplay[count]['rank'] = count + 1;
                    self.voteDisplay[count]['progress'] = Math.round((this.count/self.voteResults.voteWidget.totalVotes) * 100);
                    if(self.voteDisplay[count]['progress'] < 20){
                        self.voteDisplay[count]['progress'] = self.voteDisplay[count]['progress'] * 4.5;
                    }else if(self.voteDisplay[count]['progress'] < 30){
                        self.voteDisplay[count]['progress'] = self.voteDisplay[count]['progress'] * 3;
                    }else if(self.voteDisplay[count]['progress'] < 40){
                        self.voteDisplay[count]['progress'] = self.voteDisplay[count]['progress'] * 2;
                    }
                    self.voteDisplay[count]['color'] = obj.template.options.colorBars[count]
                    count++;
                }
            });

            var data = [];
            data['subLeaders'] = self.voteDisplay;
            data['topLeaders'] = self.voteDisplay.splice(0, 3);

            // Let Handlebars do its thing
            obj.template.content = Handlebars.compile(Template)(data);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);

            //$('head').append('<style type="text/css">' + css + '</style>');

            $(document).ready(function(){
                //$('#main_wrapper').hide();
                //$('#leaderboard').show();
            });

        },

        events: {}

    });
});
