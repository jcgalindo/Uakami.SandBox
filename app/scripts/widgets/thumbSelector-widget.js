/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars, alert, _ */
/*Thumb selector widget to fire events from image thumbnails into the app container
 *
 **/

define([
    'backbone',
    'moontemplate',
    'text!styles/widgets/thumbSelector.css',
    'text!templates/thumbSelector.handlebars'
], function (Backbone, moontemplate, css, Template) {

    'use strict';

    return Backbone.View.extend({

        render: function (obj) {
            var self = this;
            self.options = obj.template.options;

            // Let Handlebars do its thing
            obj.template.content = Handlebars.compile(Template)(obj.template.options);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);

            $('head').append('<style type="text/css">' + css + '</style>');

            //Not always firing on load (spinner will sometimes remain indefinitely)
            var t=setTimeout(function(){$('#images-wrapper li:first-child').click();},2000);

        },

        events: {
            "click #images-wrapper li": "fireEvent",
            "click .arrow": "scrollThumbs",
            "ready window": "windowLoad"
        },

        /**
        * @function
        */
        fireEvent: function(evt){
            var self = this,
            thumbIndex = $(evt.currentTarget).index(),
            title = self.options.titles[thumbIndex];
            $('#images-wrapper li').removeClass('thumb-overlay');
            $(evt.currentTarget).addClass('thumb-overlay');
            $('body').trigger('select-event', [thumbIndex, title])
            .trigger('dite', {screenName:"feature/" + thumbIndex + "/preview"});
        },

        /**
        * @function
        */
        scrollThumbs: function(evt){
            var self = this,
            currentScroll = $('#images-wrapper').scrollLeft();

            if($(evt.currentTarget).hasClass('right')){
                var dir = 'right';
            }else{
                var dir = 'left';
            }

            var scrollLength = $('#images-wrapper li').outerWidth(true);
            if(currentScroll > 0){

            }

            if(currentScroll < $('#images-wrapper').innerWidth()){

                }


            if(dir == 'right'){
                $( "#images-wrapper" ).animate({
                    scrollLeft: "+=" + scrollLength,
                }, 1000, function() {
                // Animation complete.
                });
                //$('#images-wrapper').scrollLeft(currentScroll + scrollLength);
                if(currentScroll > 0){
                    //$('#images-wrapper').scrollLeft(currentScroll + 5);
                }
            }else{
                $( "#images-wrapper" ).animate({
                    scrollLeft: "-=" + scrollLength,
                }, 1000, function() {
                // Animation complete.
                });
                if(currentScroll < $('#images-wrapper').innerWidth()){

                }
            }
        },

        startScroll: function(evt){
            var self = this;
            console.log('start');
            if($(evt.currentTarget).hasClass('right')){
                var dir = 'right';
            }else{
                var dir = 'left';
            }
            //self.scrollThumbs();
            window.scrolling = setInterval(function(){ self.scrollThumbs(dir) }, 10);
        },

        stopScroll: function(){
            var self = this;
            console.log('stop', window.scrolling);
            clearInterval(window.scrolling);
        },

        windowLoad: function(){
            console.log('load');
        }
    });

});
