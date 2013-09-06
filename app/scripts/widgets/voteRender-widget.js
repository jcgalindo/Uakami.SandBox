/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars, alert, _ */
/*Vote render
 *
 **/

define([
    'backbone',
    'moontemplate',
    'text!templates/voteRender.handlebars'
], function (Backbone, moontemplate, Template) {

    'use strict';

    return Backbone.View.extend({

        render: function (obj) {
            var self = this;

            self.data = obj.data;
            self.template = obj.template;
            self.options = obj.template.options;
            self.currentVote = {};
            self.voteResults = obj.data.data;

            // Let Handlebars do its thing
            obj.template.content = Handlebars.compile(Template)(obj.template.options);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);

            $(obj.$el.selector).css('cursor', 'pointer').on('click', function(){
                $('body').trigger('vote-event', self.currentVote);
            });

            $('body').on('select-event', function(event, index, text){
                self.currentVote = [index, text];
            });

            $('body').on('vote-event', function(){
                self.submitVote(self.currentVote);
            });

            //$('head').append('<style type="text/css">' + css + '</style>');
        },

        events: {},

        submitVote: function(vote){
            var self = this;
            var url = self.data.txnBaseUrl + "/api/rpc?methodName=recordVote&1=" + self.data['@id'] + "&2=" + vote[1] + "&3=" + vote[0] + "&4=" + self.data.userid;
            $('body').trigger('dite', {screenName:"feature/" + vote[0] + "/preview/clickCastYourVote"});
            var img = new Image();
            img.src = url;
            if(typeof self.options.afterSubmit != 'undefined'){
                $.each(self.options.afterSubmit, function(k, v){
                    switch(k){
                        case "hide":
                            $('#' + v).hide();
                            break;

                        case "show":
                            $('#' + v).show();
                            break;
                    }
                });
            }
        }

    });

});
