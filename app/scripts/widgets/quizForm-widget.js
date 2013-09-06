/*global define, $, Handlebars, _ */
/*jslint nomen: true */

define([
    'backbone',
    'moontemplate',
    'text!templates/quizForm.handlebars'
], function (Backbone, moontemplate, Template) {

    'use strict';

    return Backbone.View.extend({

        initEvents: function(){
            var self = this;

            $('.qtitle .title').css(self.options.mobile.questionTitleStyles);
            $('.question-title').css(self.options.mobile.questionDetailsTitle);
            $('.question-text').css(self.options.mobile.questionDetailsText);
            $('.true-false').css(self.options.mobile.questionTrueFalse);
            $('.answer-true').css(self.options.mobile.questionTrue);
            $('.answer-or').css(self.options.mobile.questionOr);
            $('.answer-false').css(self.options.mobile.questionFalse);
            $('.question-answers .multi-option').css(self.options.mobile.questionAB);
            $('.details-holder .option-a .letter').css(self.options.mobile.questionAletter);
            $('.option-b .letter').css(self.options.mobile.questionBletter);
            $('.percentage-bar').css(self.options.mobile.percentageBar);
            $('.percentage-text').css(self.options.mobile.percentageText);
            $('.percentage-sign').css(self.options.mobile.percentageSign);


            $('#link1').bind('click', function(){
                $('#video_screen').remove();
                $('body').trigger('dite', {
                    screenName: 'quiz'
                });
                if((/Android/i).test(userAgent)){
                    $('.percentage-bar').css('right', '-14%').css('top', '23%');
                    $('#birthMonth, #birthDay, #birthYear').addClass('android');
                    $('html, body').css('min-height', '635px');
                    if(window.innerHeight > 600){
                        $('.percentage-text').addClass('android-tablet-percentage-text');
                        $('#rules_link, #privacy_link').addClass('android-tablet-link');
                    }else{
                        $('.percentage-text').addClass('android-percentage-text');
                        $('#form_container').css('top', '0');
                        $('#rules_link, #privacy_link').addClass('android-link');
                        $('#thankyou_screen').addClass('android-ty');
                    }



                    $('.details').removeClass('details').css('background-size', 'contain').addClass('android-details');
                }
            })

            var wait = setTimeout(function(){
                var form = $('#birthDay').parent().parent();
                var dob = $('#birthDay');
                $('#rules_link').css({'z-index': 100});
                $('.percentage-bar').css({"display":'block'});
                $('#rules_link').css({'font-size':'25px'})
                $('#privacy_link').css({'font-size':'25px'})
                var top = parseInt( $('#birthDay').css('margin-top') );
            }, 1000)

            $('body').bind('update-data', function(data){
                //quiz/jumble/contactInformation/thankYou/conversionreferral/
                $('body').trigger('dite', {
                    screenName: 'quiz/jumble',
                    eventName: 'contactInformation/thankYou/conversionreferral',
                    eventData: undefined
                });
            });



            /******************************************************************
            ** Fix Absolute position for Form fields Widget
            ******************************************************************/
            //self.timeout = setTimeout(function(){self.formClean();}, 1000);
            /******************************************************************
            ** Handle click on questions boxes
            ******************************************************************/
            $('.qtitle').bind('click', function(event){
                var $el = $(this);
                var index = $el.data('index');
                var question = self.questions[index];
                $('.percentage-bar').show();

                if( index == self.selectedIndex || question.answered != undefined){
                    return;
                }

                if( self.timeout != undefined ){
                    clearTimeout( self.timeout );
                }

                $('body').trigger('dite', {
                    screenName: 'quiz/'+(index + 1),
                    eventName: 'preview',
                    eventData: undefined
                });

                $el.css('background-image', 'url(' + question.selected + ')');
                $('.percentage-text').hide();

                self.showQuestion(question);

                if( self.selectedIndex != null ){
                    var index2 = self.selectedItem.data('index');
                    var question2 = self.questions[index2];
                    if( question2.answered == undefined ){
                        self.selectedItem.css('background', 'url(' + question2.normal + ') top right');
                    }
                }

                self.selectedIndex = index;
                self.selectedItem = $el;

            });
            /******************************************************************
            ** Handle True or False
            ******************************************************************/
            $('.question-answers .answer-true, .question-answers .answer-false,').bind('click', function(event){
                var $el = $(this);
                var id = $el.attr('id');
                var question = self.questions[self.selectedIndex];
                var title;
                var description;

                $('body').trigger('dite', {
                    screenName: 'quiz/'+(self.selectedIndex + 1),
                    eventName: 'preview/click' + self.capitaliseFirstLetter(id),
                    eventData: undefined
                });



                $('.question-answers .true-false').hide();
                if( id == question.right ){
                    title = question.correctTitle;
                    description = question.correctText;
                    self.rights++;
                    self.movePercentBar();
                }else{
                    title = question.incorrectTitle;
                    description = question.incorrectText;
                    //$('.details-holder .details, .details-holder .android-details').css({'background': 'url(' + self.options.wrong_question_text_bg + ') no-repeat', "background-size" :"cover"});
                }
                $('.question-title').html( title );
                $('.question-text').html( description );
                question.answered = true;
                self.showCartPart(question);
                self.answers++;
            });

            /******************************************************************
            ** Handle A/B questions
            ******************************************************************/
            $('.question-answers .option-a, .question-answers .option-b,').bind('click', function(event){
                var $el = $(this);
                var id = $el.attr('id');
                var question = self.questions[self.selectedIndex];
                var title;
                var description;

                $('body').trigger('dite', {
                    screenName: 'quiz/'+(self.selectedIndex + 1),
                    eventName: 'preview/click' + self.capitaliseFirstLetter(id),
                    eventData: undefined
                });

                $('.question-answers .multi-option').hide();
                if( id == question.right ){
                    title = question.correctTitle;
                    description = question.correctText;
                    self.rights++;
                    self.movePercentBar();
                }else{
                    title = question.incorrectTitle;
                    description = question.incorrectText;
                    $('.details-holder .details, .details-holder .android-details').css({'background': 'url(' + self.options.wrong_question_text_bg + ') no-repeat', "background-size" :"cover"});
                }
                $('.question-title').html( title );
                $('.question-text').html( description );
                self.showCartPart(question);
                question.answered = true;
                self.answers++;
            });

        },

        formClean : function(){
            $('#first_name').parent().css({'position': 'absolute'})
            $('#last_name').parent().css({'position': 'absolute'})
            $('#email').parent().css({'position': 'absolute'})
            $('#zip').parent().css({'position': 'absolute'})
        },

        capitaliseFirstLetter : function(string)
        {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        movePercentBar : function(){
            self = this;
            var add = self.rights * 4 ;
            var newRight = (self.baseRight + add) + '%';

            self.percentage = self.rights * 15
            $('.percentage-bar').css({'right': newRight});
            $('.percentage-text .number').html( self.percentage )
        },

        showCartPart : function(question){
            var self = this;
            $('.title', self.selectedItem).hide();
            self.selectedItem.css({'background': 'url(' + question.puzzlePart + ') top left', "background-size" :"cover"});
            if( self.questions.length - 1 == self.answers){
                self.timeout = setTimeout(function(){self.goToPuzzle();}, parseInt( question.delay * 1000));
            }else{
                self.timeout = setTimeout(function(){self.showProgress();}, parseInt( question.delay * 1000));
            }
        },

        goToPuzzle : function(){
            var self = this;
            window.plugPercentage=self.percentage;
            if(window.isiPhone5==true)
                $('.details-holder .details, .details-holder .android-details').css({"background-image":"url("+self.options.mobile.unscramble.ip5+")","background-size":"100% 100%"})
            else
            $('.details-holder .details, .details-holder .android-details').css({'background': 'url(' + self.options.mobile.unscramble.default+ ') no-repeat', 'background-size' : 'cover'});
            $('.question-title').html( '' );
            $('.question-text').html( '' );
            $('.percentage-text').show();
             $('body').trigger('dite', {
                    screenName: 'quiz',
                    eventName: 'completed',
                    eventData: undefined
                });
            $('body').trigger('moontemplate:link', {
                data: {},
                template: {
                    click: self.options.whenFinish
                }
            });
        },

        showProgress : function(){
            var self = this;
            if(window.isiPhone5==true)
                $('.details-holder .details, .details-holder .android-details').css({"background-image":"url("+self.options.mobile.ip5_plug_init+")","background-size":"100% 100%"})
            else
            $('.details-holder .details, .details-holder .android-details').css({'background': 'url(' + self.options.plug_init + ') no-repeat', 'background-size' : 'cover'});
            $('.question-title').html( '' );
            $('.question-text').html( '' );
            $('.percentage-text').show();
        },
        showQuestion : function(question){
            var self = this;
            $('.details-holder .details, .details-holder .android-details').css('background', 'url(' + self.options.question_text_bg + ') no-repeat');
            $('.question-title').html( question.title );
            $('.question-text').html( question.question );
            if( question.type == 'tf' ){
                $('.question-answers .multi-option').hide();
                $('.question-answers .true-false').show();
            }else if(question.type == 'ab'){
                $('.question-answers .multi-option .option-a .answer').html(question.answers[0]);
                $('.question-answers .multi-option .option-b .answer').html(question.answers[1]);
                $('.question-answers .true-false').hide();
                $('.question-answers .multi-option').show();
            }
        },
        iPhone5resize:function(obj){
            var self=this;
            $('.percentage-text').css({"right":self.options.mobile.battery.right});
             window.addEventListener("orientationchange", function() {
                //self.setStyleiP5(window.orientation,obj);
            }, false);
            self.setStyleiP5(window.orientation,obj);
            $('#video_screen').css({'height': this.options.mobile.ip5_video_height});
            $('#get_started').css({'height': this.options.mobile.ip5_main_screen_height, "top" : this.options.mobile.ip5_main_screen_top})

        },
        setStyleiPad:function(orientation){
            var self=this;
             if(orientation==-90||orientation==90){
                 $(".percentage-text").css({"top":self.options.mobile.battery.ipad})
                 $('#form_widget').css({'top':'50%'})
             }else{
                 $(".percentage-text").css({"top":self.options.mobile.battery.ip5})
                 $('#form_widget').css({'top':'45.5%'})
             }
        },
        android:function(){
            $('.true-false').css({'bottom':'45%'})
            $('.percentage-bar').css({'top':'15%'})
            $('#thankyou_screen').css({'height':'82%','background-size':'100% 100%'})
            $('#thankyou_screen').bind('touchmove',function(event){event.preventDefault()})
        },
        setStyleiP5:function(orientation,obj){
            var self=this;
            if(orientation==0||orientation==180)
            {
                $('#logo_header').css({'background-image': "url("+self.options.mobile.ip5_header_img+")"});
                $('#get_started').css({'background-image': "url("+self.options.mobile.ip5_start_image+")"});
                $('#header').css({"height":self.options.mobile.header.ip5.height,"top":self.options.mobile.header.ip5.top});
                $('#link_fb').css({"left":self.options.mobile.ip5_facebook_share})
                $('#link_tw').css({"left":self.options.mobile.ip5_twitter_share})
                $('#link_gp').css({"left":self.options.mobile.ip5_googlep_share})
                $('#link1').css({'top':self.options.mobile.buttonStartPosition.ip5.top,'left':self.options.mobile.buttonStartPosition.ip5.left,'width':self.options.mobile.buttonStartPosition.ip5.width})
                $('#form_container').css({'background-image': "url("+self.options.mobile.ip5_sweepstakes+")","background-size":"100% 100%"});
                $('.percentage-bar').css({"top":self.options.mobile.battery.ip5})
                if(navigator.userAgent.match('CriOS')){
                $('.percentage-text').css({"margin-top":'55px'})}
                else{
                $('.percentage-text').css({"margin-top":'15px'})}
                $('#thankyou_screen').css({"background-image":"url("+self.options.mobile.ip5_thankyou+")","background-size":"100% 100%"});
                $('#link_fb_thanks').css({"top":self.options.mobile.thankyouShare.shareLinkip5.top,"width":self.options.mobile.thankyouShare.shareLinkip5.width,"height":self.options.mobile.thankyouShare.shareLinkip5.height,"left":self.options.mobile.thankyouShare.facebook.ip5.left})
                $('#link_tw_thanks').css({"top":self.options.mobile.thankyouShare.shareLinkip5.top,"width":self.options.mobile.thankyouShare.shareLinkip5.width,"height":self.options.mobile.thankyouShare.shareLinkip5.height,"left":self.options.mobile.thankyouShare.twitter.ip5.left})
                $('#link_gp_thanks').css({"top":self.options.mobile.thankyouShare.shareLinkip5.top,"width":self.options.mobile.thankyouShare.shareLinkip5.width,"height":self.options.mobile.thankyouShare.shareLinkip5.height,"left":self.options.mobile.thankyouShare.googleP.ip5.left})
                $('#link_learn_more').css({"top":self.options.mobile.thankyouShare.learnmore.ip5.top,"height":self.options.mobile.thankyouShare.learnmore.ip5.height})
            }else{
                $('#get_started').css({'background-image': "url("+obj.data.start_img+")"});
                $('#logo_header').css({'background-image': "url("+obj.data.header_img+")"});
                $('#header').css({"height":self.options.mobile.header.default.height,"top":self.options.mobile.header.default.top});
                $('#link_fb').css({"left":self.options.mobile.default_facebook_share})
                $('#link_tw').css({"left":self.options.mobile.default_twitter_share})
                $('#link_gp').css({"left":self.options.mobile.default_googlep_share})
                $('#link1').css({'top':self.options.mobile.buttonStartPosition.default.top,'left':self.options.mobile.buttonStartPosition.default.left,'width':self.options.mobile.buttonStartPosition.default.width})
                $('#form_container').css({'background-image': "url("+self.options.mobile.default_sweepstakes+")","background-size":"cover"});
                $('.percentage-text').css({"top":self.options.mobile.battery.default})
                $('.percentage-bar').css({"top":self.options.mobile.battery.default})
                $('#thankyou_screen').css({"background-image":"url("+obj.data.final_img+")","background-size":"cover"});
                $('#link_fb_thanks').css({"top":self.options.mobile.thankyouShare.shareLinkdefault.top,"width":self.options.mobile.thankyouShare.shareLinkdefault.width,"height":self.options.mobile.thankyouShare.shareLinkdefault.height,"left":self.options.mobile.thankyouShare.facebook.default.left})
                $('#link_tw_thanks').css({"top":self.options.mobile.thankyouShare.shareLinkdefault.top,"width":self.options.mobile.thankyouShare.shareLinkdefault.width,"height":self.options.mobile.thankyouShare.shareLinkdefault.height,"left":self.options.mobile.thankyouShare.twitter.default.left})
                $('#link_gp_thanks').css({"top":self.options.mobile.thankyouShare.shareLinkdefault.top,"width":self.options.mobile.thankyouShare.shareLinkdefault.width,"height":self.options.mobile.thankyouShare.shareLinkdefault.height,"left":self.options.mobile.thankyouShare.googleP.default.left})
                $('#link_learn_more').css({"top":self.options.mobile.thankyouShare.learnmore.default.top,"height":self.options.mobile.thankyouShare.learnmore.default.height})

            }

        },

        /**
        * @function
        */
        render: function (obj) {
            var self = this;

            if((/Android/i).test(userAgent)){
                $('.title').css('font-size', '.3em !important');
                $('meta').each(function(){
                    if($(this).attr('name') == 'viewport'){
                        $(this).remove();
                    }
                });

                $('body').css('font-size', '100%');

            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">');
            }
            self.options = obj.template.options;

            self.questions = obj.template.options.questions;
            self.selectedIndex = null;
            self.answers = 0;
            self.rights = 0;
            self.percentage = 0;
            self.timeout;
            self.clean;
            self.baseRight = parseInt(self.options.mobile.percentageBar.right);

            // Let Handlebars do its thing
            //obj.template.content = this.renderTemplate(obj.template, obj.data);
            obj.template.content = Handlebars.compile(Template)(obj.template.options);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);
            self.initEvents();
            var iHeight = window.screen.height;
            var iWidth = window.screen.width;
            window.isiPhone5 = false;
            window.isIpad = false
            if( navigator.platform.indexOf("iPhone") != -1 && iHeight > 560){
                window.isiPhone5 = true;
                self.iPhone5resize(obj);
            }
            if( navigator.platform.indexOf("iPad") != -1 ){
                $('.percentage-text').css({'margin-top':'-20px'})
                window.isIpad = true;
            }
            if( navigator.platform=="iPhone"){
                window.isIphone = true;
            }
            if(navigator.userAgent.indexOf('Android')!=-1){
                self.android();
                }
            if(window.isiPhone5==true) $('.details-holder .details, .details-holder .android-details').css({"background-image":"url("+self.options.mobile.ip5_plug_init+")","background-size":"100% 100%"})
        }

    });

    $('#link_gp').bind('click', function(){
        $('body').trigger('dite', {
            screenName: 'share/googlePlus'
        });
    });

    $('input').bind('click', function(){
        console.log('here');
    });

});
