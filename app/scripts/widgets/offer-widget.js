/*global define, $, Handlebars, _ */
/*jslint nomen: true */

define([
    'backbone',
    'moontemplate',
    'models/offer-model'
], function (Backbone, moontemplate, Offer) {

    'use strict';

    return Backbone.View.extend({

        getUuid: function(){
            var c_name = 'mt_userid';
            var c_value = document.cookie;
            var c_start = c_value.indexOf(" " + c_name + "=");
            if (c_start == -1){
                c_start = c_value.indexOf(c_name + "=");
            }
            if (c_start == -1){
              c_value = null;
            }else{
              c_start = c_value.indexOf("=", c_start) + 1;
              var c_end = c_value.indexOf(";", c_start);
              if (c_end == -1){
                c_end = c_value.length;
                }
            c_value = unescape(c_value.substring(c_start,c_end));
            }
            return c_value;
        },

        setUuid: function(){
            var exdate=new Date();
            var exdays = 365;
            var c_name = 'mt_userid';
            var value = (function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}());
            exdate.setDate(exdate.getDate() + exdays);
            var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
            document.cookie=c_name + "=" + c_value;
            return value;
        },
        /**
        * @function
        */
        render: function (app) {
            var self = this;
            if(typeof uuid != 'undefined'){
                this.options.app.config.id = uuid;
            }

            var offer = new Offer({
                id: this.options.app.config.id || 1
            }), self = this;
            offer.fetch({

                complete: function(xhr, textStatus){
                },

                // Ajax Success
                success: function (model, data) {
                    data.id = data['@id'];
                    data.userid = self.getUuid() || self.setUuid(),
                    data = _.extend(data.templateParams || {}, data);
                    if(typeof data.stylesheetUrl != 'undefined' && data.stylesheetUrl != ''){
                        var cssLink = $("<link>");
                        $("head").append(cssLink);
                            cssLink.attr({
                            rel: "stylesheet",
                            type: "text/css",
                            href: data.stylesheetUrl
                       });
                    }

                    if(  document.addEventListener  ){
                        var isOldIe = false;
                    }else{
                        var isOldIe = true;
                    }

                    // NEW versions of CONTAINER check for mobileFirst var
                    if ((typeof data.mobileFirst != 'undefined' && data.mobileFirst == 'true')) {
                        if(app.isMobile == false){
                            $('body').css({
                                "width": "1025px",
                                "margin": "0 auto"
                            });

                            if(window.location.search.indexOf('flash=true') !== -1 || isOldIe){
                                    var flashContainer = document.getElementById('movie');
                                    if(flashContainer != null){
                                        flashContainer.style.display = 'block';
                                    }
                                    //Removing for Mobile first capabilities
                                    throw "stop execution";
                            }
                        }
                    }else{
                        var flashContainer = document.getElementById('movie');
                        if(app.isMobile){
                            if(flashContainer != null){
                                flashContainer.parentNode.removeChild(flashContainer);
                            }
                        }else{
                            if(flashContainer != null){
                                flashContainer.style.display = 'block';
                            }
                            //Removing for Mobile first capabilities
                            throw "stop execution";
                        }
                    }

                        // Initialize DITE
                        var template = model.get('template');
                        document.title = data.name;
                        $('body').trigger('dite-setup', {
                            appType: template.appId,
                            appDiteName: data.templateParams.appDiteName,
                            catId: data.templateParams.catalogId,
                            offerID: template.id,
                            originDomain: template.rootUrl
                        });

                        // Render the template with Moontemplate
                        if(typeof app.target != 'undefined'){
                            $('#' + app.target).moontemplate(data.template, data);
                        }else{
                            $('body').moontemplate(data.template, data);
                        }

                        $('body').trigger('dite2', false);

                },

                // Ajax Error
                error: function (model, data) {
                    // Render a 404 message
                    $('body').moontemplate({
                        content: '<h1>404</h1><p>The offer was not found. <br />Look in the browser console to see why the call is failing.</p>',
                        backgroundColor: '#FFFFFF',
                        left: 20
                    });

                }

            });

        }

    });

});
