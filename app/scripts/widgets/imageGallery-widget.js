/*jslint nomen: true */
/*global define, $, Handlebars, _V_ */

define([
    'backbone',
    'moontemplate',
    'text!templates/imageGallery.handlebars'
], function (Backbone, moontemplate, Template) {

    'use strict';

    return Backbone.View.extend({

        /**
        * @function
        */
        render: function (obj) {

            var self = this;
            
            // Create a unique id
            obj.template.options.rootId = new Date().getTime();
            
            // Default the width and height if they aren't implicitly stated
            obj.template.options.width = obj.template.options.width || '100%';
            obj.template.options.height = obj.template.options.height || '100%';
            obj.template.options.top = obj.template.options.top || '0px';
            obj.template.options.left = obj.template.options.left || '0px';
            
            obj.template.options.current_slide = 0;
            
            if(obj.template.options.controls == 'true'){
                obj.template.options.controls = 'block';
            }else{
                obj.template.options.controls = 'none';
            }
            
            //check for sharelinks
            /*
            var images = obj.template.options.images;
            obj.template.options.images = [];
            $(images).each(function(k,v){
               if(typeof obj.template.options.shareLinks != 'undefined'){
                    var image = {};
                    image.src = v;
                    obj.template.options.images[k] = image;
                    console.log(typeof obj.template.options.shareLinks);
                    if(typeof obj.template.options.shareLinks == 'object'){
                        obj.template.options.images[k].share = obj.template.options.shareLinks[k];
                    }else if(typeof obj.template.options.shareLinks != 'undefined'){
                        obj.template.options.images[k].share = obj.template.options.shareUrl;
                    }else{
                        obj.template.options.images[k].share = false;
                    }
                
               }
                
            });
            */
            self.currentSlide = 0;
            obj.template.options.image_count = obj.template.options.images.length;
            self.imageCount = obj.template.options.images.length - 1;
            
            var images = obj.template.options.images;
            obj.template.options.images = [];
            $(images).each(function(k, v){
                
            });
            // Let Handlebars do its thing
            obj.template.content = Handlebars.compile(Template)(obj.template.options);
            
            var element = {};
            element.id = "TEST_ID";
            obj.template.elements = [];
            obj.template.elements[0] = element;
            
            console.log(obj.template, obj.data);
            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);
            
            
            this.prepareSlides();
            this.updateCurrent();
            this.startSlideshow();


        },
        events:{
            "click #slide-controls i": "slideControl"
        },
        prepareSlides: function(){
        },
        slideControl: function(evt){
            var self = this;
            var action = $(evt.target).attr('rel');
            
            switch (action){
                case "previous":
                    var prev = self.currentSlide - 1;
                    if(prev < 0){
                        prev = self.imageCount;
                    }
                    self.goToSlide(prev);
                    self.pauseSlideshow();
                    break;
                case "pause":
                    self.pauseSlideshow();
                    break;
                case "play":
                    self.startSlideshow();
                    break;
                case "current":
                    
                    break;
                case "total":
                    
                    break;
                case "next":
                    var next = self.currentSlide + 1;
                    if(next > self.imageCount){
                        next = 0;
                    }
                    self.goToSlide(next);
                    self.pauseSlideshow();
                    break;
            }
            
            //self.goToSlide(index);
            //self.pauseSlideshow();
            //self.startSlideShow();
        },
        goToSlide: function(index){
            var self = this;
            
            if(index < 0){
                index = self.imageCount;
            }else if(index > self.imageCount){
                index = 0;
            }
            
            var slides = $('.slide');
            
            $(slides).eq(self.currentSlide).fadeOut('slow', function(){
                $(slides).eq(index).fadeIn();
                self.currentSlide = index;
                self.updateCurrent();
            });
        },
        pauseSlideshow: function(){
            var self = this;
            self.currentState = 'paused';
            self.togglePlayPause('play');
            clearInterval(self.slideShow);
        },
        startSlideshow: function(){
            var self = this;
            self.currentState = 'playing';
            self.togglePlayPause('pause');
            self.slideShow = setInterval(function(){
                var nextSlide = self.currentSlide + 1;
                if(nextSlide > self.imageCount){
                    nextSlide = 0;
                }
                self.goToSlide(nextSlide);
            },7000);
        },
        updateCurrent: function(){
            var self = this;
            this.$el.find('#slides-current').html(self.currentSlide + 1);
        },
        togglePlayPause: function(action){
            this.$el.find('#slides-PlayPause').attr('rel', action);
            
            if(action == 'play'){
                this.$el.find('#slides-PlayPause').html('<i class="icon-play" rel="play"></i>');
            }else{
                this.$el.find('#slides-PlayPause').html('<i class="icon-pause" rel="pause"></i>');
            }
        }

    });

});