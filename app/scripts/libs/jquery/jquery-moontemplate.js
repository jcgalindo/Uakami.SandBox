require([
    'jquery',
    'lodash'
], function ($, _) {

    /*jslint plusplus: true */
    /*global window */
    return (function (window) {

        'use strict';

        // Shorthand
        var $ = window.jQuery,
            Color = window.Color;

        /**
        * @function
        * @param {Object} template
        */
        function renderBorder (template) {
            var html = '';

            // Border - {Object} An object that defines the border for this element
            if (template.border) {
                if (template.border.position){
                    html += 'border-' + template.border.position + ':';
                }else{
                    html += 'border: ';
                }

                // Border Thickness  - {String} The thickness, in pixels, of the border.
                if (template.border.thickness) {
                    html += template.border.thickness;
                }

                template.border.colorOpacity = new Color(template.border.color);

                // Border Color - {String} The hex value of the color of the border.
                if (template.border.color) {
                    html += ' ' + template.border.colorOpacity.getOpacityRGB(template.border.alpha || 1);
                }

                html += ' solid; ';

            }

            return html;

        }

        /**
        * @function
        * @description There is a lot of work that goes in to rendering a cross-browser HTML5 gradient.  This function makes it easier
        * @param {Object} template
        * @param {Object} data
        */
        function renderGradient (template, data) {

            var html = '', i;

            // Background Gradient  - {Object} A gradient definition to use for the background.
            if (template.backgroundGradient) {
                if (template.backgroundGradient.colors) {

                    template.backgroundGradient.valuesString = '';
                    template.backgroundGradient.alphas = template.backgroundGradient.alphas || [];

                    // Mozilla and Webkit tend to disagree on what degree the gradient rotation starts at.  This hack gets around it
                    template.backgroundGradient.valuesStringRotation = ((template.backgroundGradient.rotation) ? template.backgroundGradient.rotation + 'deg' : 'top');
                    template.backgroundGradient.valuesStringRotationMoz = ((template.backgroundGradient.rotation) ? (parseFloat(template.backgroundGradient.rotation) + 90) + 'deg' : 'top');

                    // Loop over the colors and build the gradient
                    for (i = 0; i < template.backgroundGradient.colors.length; i++) {
                        var color = new Color(template.backgroundGradient.colors[i]);
                        template.backgroundGradient.colors[i] = color.getOpacityRGB(template.backgroundGradient.alphas[i] || 1);
                        template.backgroundGradient.valuesString +=  ',' + template.backgroundGradient.colors[i] + ' ' + ((template.backgroundGradient.ratios[i]) ? parseInt(parseFloat(template.backgroundGradient.ratios[i] || '255') / 255 * 100) : 0) + '%';
                    }

                }

                // Old busted browsers
                html += 'background: ' + (template.backgroundGradient.colors[0] || '#000000') + '; ';

                // Mozilla
                html += 'background: -moz-' + (template.backgroundGradient.type || 'linear') + '-gradient(' + template.backgroundGradient.valuesStringRotationMoz + template.backgroundGradient.valuesString  + '); ';

                // Webkit
                html += 'background: -webkit-' + (template.backgroundGradient.type || 'linear') + '-gradient(' + template.backgroundGradient.valuesStringRotation + template.backgroundGradient.valuesString  + '); ';

                // Opera
                html += 'background: -o-' + (template.backgroundGradient.type || 'linear') + '-gradient(' + template.backgroundGradient.valuesStringRotation+  template.backgroundGradient.valuesString  + '); ';

                // Internet Explorer 9 >
                html += 'background: -ms-' + (template.backgroundGradient.type || 'linear') + '-gradient(' + template.backgroundGradient.valuesStringRotation + template.backgroundGradient.valuesString  + '); ';

                // Compliant Browsers
                html += 'background: ' + (template.backgroundGradient.type || 'linear') + '-gradient(' + template.backgroundGradient.valuesStringRotationMoz + template.backgroundGradient.valuesString  + '); ';

            }

            return html;

        }

        /**
        * @function
        * @param {Object} template
        * @param {Object} data
        */
        function renderElements (template, data) {
            // Begin opening tag
            var i,
                html = '<div';

                // id {String} A unique id for the element
                if (!template.id) {
                    template.id = String(new Date().getTime() + Math.random()).replace('.', '_');
                }
                html += ' id="' + template.id + '"';

                html += ' class="' + template.className + '"';

                // Begin Style!
                if(typeof template.position == 'undefined'){
                    html += ' style="position: relative; ';
                }else{
                    html += ' style="position: ' + template.position + '; ';
                }

                if(typeof template.floatDir != 'undefined'){
                    html += 'float: ' + template.floatDir + '; ';
                }

                    // Visible
                    if (template.visible === false) {
                        html += 'display: none; ';
                    } else {
                        if(typeof template.display != 'undefined'){
                            html += 'display: ' + template.display + '; ';
                        }else{
                            html += 'display: block' + '; ';
                        }
                    }

                    if(typeof template.nowrap !== 'undefined' && template.nowrap == 'true'){
                        html += 'white-space: nowrap; ';
                    }

                    if(typeof template.height != 'undefined'){
                        // Height - {String} The height of the element.
                        html += 'height: ' + template.height + '; ';
                    }

                    if(typeof template.width != 'undefined'){
                        // Width - {String} The width of the element.
                        html += 'width: ' + (template.width) + '; ';
                    }

                    if (template.minHeight) {
                        html += 'min-height: ' +  template.minHeight + '; ';
                    }

                    if (template.minWidth) {
                        html += 'min-width: ' +  template.minWidth + '; ';
                    }

                    // Left - {String} The distance from the left edge of the application.
                    if(typeof template.left != 'undefined'){
                        html += ' left: ' + template.left + '; ';
                    }else if(typeof template.right != 'undefined'){
                        html += ' right: ' + template.right + '; ';
                    }

                    // Top - {String} The distance from the top edge of the application.
                    if(template.top){
                    html += 'top: ' + (template.top) + '; ';
                    }

                    // Top - {String} The distance from the top edge of the application.
                    if(template.bottom){
                    html += 'bottom: ' + (template.bottom) + '; ';
                    }

                    // Background Color - {String} A color to use for the background. If this is undefined, the background color is always transparent. (Example: #000000)
                    if (template.backgroundColor) {
                        html += 'background-color: ' + template.backgroundColor + '; ';
                    }

                    // Background Image - {String} The URL of an image to use in the background of the element. (Example: “http://mysite/myImage.jpg”)
                    if (template.backgroundImage) {
                        html += 'background-image: url(' +  template.backgroundImage + '); ';
                    }

                    if (template.backgroundSize) {
                        html += 'background-size: '+  template.backgroundSize + '; ';
                    }

                    if (template.backgroundRepeat) {
                        html += 'background-repeat: '+  template.backgroundRepeat + '; ';
                    }

                    if (template.borderRadius) {
                        //html += renderBorderRadius(template, data);
                        html += 'border-radius: ' +  template.borderRadius + '; ';
                    }

                    // Font Size - {String} The size of the font within the element.
                    if (template.fontSize) {
                        html += 'font-size: ' +  template.fontSize + '; ';
                    }

                    // Font Color - {String} The color of the font within the element.
                    if (template.fontColor) {
                        html += 'color: ' +  template.fontColor + '; ';
                    }

                    if (template.fontFamily) {
                        html += 'font-family: ' +  template.fontFamily + '; ';
                    }

                    // Z-Index - {String} The layer value of the element.
                    if (template.z) {
                        html += 'z-index: ' +  template.z + '; ';
                    }

                    // backgroundPosition - {String} The position of the background.
                    if (template.backgroundPosition) {
                        html += 'background-position: ' +  template.backgroundPosition + '; ';
                    }

                    if (template.margin) {
                        html += 'margin: ' +  template.margin + '; ';
                    }

                    if (template.paddingTop) {
                        html += 'padding-top: ' +  template.paddingTop + '; ';
                    }

                    if (template.paddingLeft) {
                        html += 'padding-left: ' +  template.paddingLeft + '; ';
                    }

                    if (template.paddingRight) {
                        html += 'padding-right: ' +  template.paddingRight + '; ';
                    }

                    // Text Formatting - {Object} An object with properties that describe how the content text should be formatted.
                    if (template.textFormatting) {

                        // Text Align - {String} Sets the alignment of the content text. Allows the following values: left, right, center
                        if (template.textFormatting.align) {
                            html += 'text-align: ' + template.textFormatting.align + '; ';
                        }

                        // Selectable - {Boolean} Sets whether the content text can be highlighted and copied. If omitted, defaults to false.
                        if (!template.textFormatting.selectable) {
                            html += '-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none; ';
                        }

                        if (template.textFormatting.lineHeight) {
                            html += 'line-height: ' + template.textFormatting.lineHeight + '; ';
                        }

                        if (template.textFormatting.fontWeight) {
                            html += 'font-weight: ' + template.textFormatting.fontWeight + '; ';
                        }

                    }

                    // Border - {Object} An object that defines the border for this element
                    html += renderBorder(template);

                    // Shows cursor on clickable elements
                    if (template.click) {
                        html += 'cursor: pointer; ';
                    }

                    // Background Gradient  - {Object} A gradient definition to use for the background.
                    html += renderGradient(template, data);

                html += '">';
                // End Style
            // End Opening tag

            // Open relative-positioned inner-inner div for appending content
            html += '<div style="position: relative; width: 100%; height: 100%; overflow: hidden;">';

            // Content - {String} Text to go inside of the element. (Perhaps using mustache to pass data in)
            if (template.content) {

                // Multiline Opening Tag - {Boolean} Sets whether the content text is allowed to be multiline or not. If omitted, defaults to false.
                if (template.textFormatting && !template.textFormatting.multiline) {
                    if (template.textFormatting.align === 'center') {
                        html += '<div class="multiline" style="width: 100%; position: relative; overflow: hidden;">'
                    } else {
                        html += '<div class="multiline" style="position: relative; overflow: hidden;">';
                    }
                }

                html += template.content;

                // Multiline Closing tag
                if (template.textFormatting && !template.textFormatting.multiline) {
                    html += '</div>';
                }

            // Elements - {Object} An array of elements to render to the element. These elements can include the same properties as the root element.
            } else if (template.elements) {
                for (i = 0; i < template.elements.length; i++) {
                    html += renderElements(template.elements[i], data);
                }
            }

            // Close relative-positioned div
            html += '</div>';

            // Closing Tag
            html += '</div>';

            return html;
        }

        /**
        * @function
        * @param {Object} template
        */
        function activateLink (template, data) {
            var animationSpeed = data.animationSpeed || 1000,
                $item,
                appWidth = $('.moontemplate').width(),
                i;

            // Open a link - {String} The URL to navigate to when the element is clicked.
            if (template.click.link) {
                window.open(template.click.link);
            }

            // Dite - {Object} An object defining the DITE interaction data for this element. If this property is included, the dite information provided will be tracked when the element is clicked. To see the supported properties, refer to the standard element “dite” property.
            if (template.click.dite) {
                $('body').trigger('dite', template.click.dite);
            }

            // Share - {Object} A network object that defines share behavior when clicked. See the share widget definition for the network object configurations.
            if (template.click.share) {
                window.open('http://api.addthis.com/oexchange/0.8/forward/' + (template.click.share.network || 'facebook') + '/offer?pco=tbx32nj-1.0&url=' + ((template.click.share.url) ? template.click.share.url : 'http://moontoast.com') + '&pubid=moontoast');
            }

            // Share - {Object} A network object that defines share behavior when clicked. See the share widget definition for the network object configurations.
            if (template.click.trigger) {

            }

            // Copy Text
            if (template.click.copyText) {
                window.prompt ("Copy to clipboard: Ctrl+C, Enter", template.click.copyText);
            }

            // Fade In - {Array} Fades in the elements of the IDs provided.
            if (template.click.fadeIn) {
                for (i = 0; i < template.click.fadeIn.length; i++) {
                    $item = $('#' + template.click.fadeIn[i]);
                    $item.css({
                        display: 'block'
                    }).animate({
                        opacity: 1
                    }, animationSpeed).trigger('show');
                }
            }

            if (template.click.toggle) {
                for (i = 0; i < template.click.toggle.length; i++) {
                    $item = $('#' + template.click.toggle[i]);
                    if($($item).css('display') == 'none'){
                        $item.css({
                            display: 'block'
                        });
                    }else{
                        $item.css({
                            display: 'none'
                        });
                    }
                }
            }

            // Fade Out - {Array} Fades out the elements of the IDs provide
            if (template.click.fadeOut) {
                for (i = 0; i < template.click.fadeOut.length; i++) {
                        $item = $('#' + template.click.fadeOut[i]);

                        $item.animate({
                            opacity: 0
                        }, animationSpeed, function () {
                            $(this).css('display', 'none');
                        }).trigger('hide');
                    }
            }

            // Show - {Array} Shows the elements of the IDs provided instantly, with no transition.
            if (template.click.show) {
                for (i = 0; i < template.click.show.length; i++) {
                    $item = $('#' + template.click.show[i]);
                    $item.css({
                        display: 'block',
                        opacity: 1
                    }, animationSpeed).trigger('show');
                }
            }

            // Hide - {Array} Hides the elements of the IDs provided instantly, with no transition.
            if (template.click.hide) {
                for (i = 0; i < template.click.hide.length; i++) {
                    $item = $('#' + template.click.hide[i]);
                    $item.css({
                        display: 'none'
                    }, animationSpeed).trigger('hide');
                }
            }

            // Slide In Right - {Array} Shows the elements of the IDs provided by sliding them in towards the right of the screen.
            if (template.click.slideInRight) {
                for (i = 0; i < template.click.slideInRight.length; i++) {
                    $item = $('#' + template.click.slideInRight[i]);
                    $item.css({
                        left: - (appWidth)
                    }).animate({
                        left: 0
                    }, animationSpeed).trigger('show');
                }
            }

            // Slide In Left - {Array} Shows the elements of the IDs provided by sliding them in towards the left of the screen.
            if (template.click.slideInLeft) {
                for (i = 0; i < template.click.slideInLeft.length; i++) {
                    $item = $('#' + template.click.slideInLeft[i]);
                    $item.css({
                        left: appWidth
                    }).animate({
                        left: 0
                    }, animationSpeed).trigger('show');
                }
            }

            // Slide Out Right - {Array} Hides the elements of the IDs provided by sliding them out towards the right of the screen.
            if (template.click.slideOutRight) {
                for (i = 0; i < template.click.slideOutRight.length; i++) {
                    $item = $('#' + template.click.slideOutRight[i]);
                    $item.animate({
                        left: appWidth
                    }, animationSpeed).trigger('hide');
                }
            }

            // Slide Out Left - {Array} Hides the elements of the IDs provided by sliding them out towards the left of the screen.
            if (template.click.slideOutLeft) {
                for (i = 0; i < template.click.slideOutLeft.length; i++) {
                    $item = $('#' + template.click.slideOutLeft[i]);
                    $item.animate({
                        left: - (appWidth)
                    }, animationSpeed).trigger('hide');
                }
            }

            // Event - fire the specified event.  In place to interact with a render widget
            if (template.click.event) {
                $('body').trigger(template.click.event.eventName, template.click.event);
            }

        }

        function changeFonts(width){
            //alert(width);
            //alert(window.devicePixelRatio);
                if(/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) ||  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)) || userAgent.indexOf('iPad') !== -1 || userAgent.indexOf('iPod') !== -1){
        var isMobile = true;
    }else{
        var isMobile = false;
    }

            if(width > 900 && isMobile){
                //alert('WIDER');
                //$('body').css('font-size', '200%');
            }else{
                //$('body').css('font-size', '100%');
            }
        }

        /**
        * @function
        * @param {Object} $html
        * @param {Object} template
        * @param {Object} data
        */
        function bindEvents ($html, template, data, rootTemplate) {

            var i = 0,
                $el = $html.find('#' + template.id);

            // Link Color - {String} The color of the links
            if (template.linkColor) {
                $el.find('a').css('color', template.linkColor);
            }

            // Link Underline - {Boolean} Whether or not to underline the links. Defaults to true.
            if (template.linkUnderline) {
                $el.find('a').css('text-decoration', 'underline');
            }

            // Widget - {Object} The definition for a widget. This can be used instead of content to render a widget.
            if (template.widget) {
                $('body').trigger('render-widget', {
                    $el: $el,
                    template: template.widget,
                    parentTemplate: template,
                    rootTemplate: rootTemplate,
                    data: data
                });
            }

            // Load / Show DITE Event
            if (template.dite) {
                // If it's already show, trigger the dite event
                if ($el.css('display') !== 'none') {
                    $('body').trigger('dite', template.dite);
                }

                // Bind the dite event if it is re-shown
                $el.bind('show', function () {

                    // @TODO: For some reason, it keeps triggering the loadDefault event when new elements are shown... this conditional gets around it, but it would be better to not have to use it and figure out why we're triggering it
                    if (template.dite.eventName !== 'default' && template.dite.eventName !== '') {
                        $('body').trigger('dite', template.dite);
                    }

                });

            }

            // Click - {Object} An object that describes the behavior of the element when clicked. Supports the following configurations:
            if (template.click) {
                $el.bind('click', function () {
                    activateLink(template, data);
                });
            }

            if (template.elements) {
                for (i = 0; i < template.elements.length; i++) {
                    bindEvents($html, template.elements[i], data, rootTemplate);
                }
            }

            return $html;

        }

        /**
        * @function
        */
        function compile (template, data) {

            var compiled;

            if (typeof template === 'string') {
                compiled = Handlebars.compile(template)(data);
            } else {
                compiled = template;
            }

            if (template.length && !compiled.length) {
                if (template.indexOf('true') === -1) {
                    compiled = data[template.replace(/\{/g, '').replace(/\}/g, '')];
                }
            }

            return compiled;

        }

         /**
        * @function
        */
        function fillInData (template, data) {

            var item;

            for (item in template) {
                if (template.hasOwnProperty(item)) {
                    if (typeof template[item] === 'string') {
                        template[item] = compile(template[item], data);
                    } else if (typeof template[item] === 'object') {
                        template[item] = fillInData(template[item], data);
                    }
                }
            }

            return template;

        }

        /**
        * @function
        * @param {Object} template
        * @param {Object} data
        */
        $.fn.moontemplate = function (template, data) {

            var html, item;

            // Loop over all of the data items and compile them
            for (item in data) {
                if (data.hasOwnProperty(item) && typeof data[item] === 'string') {
                    data[item] = compile(data[item], data);
                }
            }

            template = fillInData(template, data);

            // Create a moontemplate
            html = '<div class="moontemplate" style="overflow: '+ (template.overflow || 'hidden') + '; margin: 0 auto; position: relative; width: ' + (template.width || '100%') + '; height: ' + (template.height || '100%') + '; ">';
                html += renderElements(template, data);
            html += '</div />';

            // Compile the template twice in case the data expects data of its own and return it
            return $(this).html(bindEvents($(
                html
            ), template, data, template));

        };

        // This event listener listens for links to be triggered
        $('body').bind('moontemplate:link', function (event, obj) {
            activateLink(obj.template, obj.data);
        });

        $.moontemplate = {
            gradient: renderGradient,
            border: renderBorder
        };

    }(window));

});
