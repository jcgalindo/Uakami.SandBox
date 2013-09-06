/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars, alert, _ */

define([
    'backbone',
    'moontemplate',
    'text!styles/widgets/simpleForm.css',
], function (Backbone, moontemplate, css) {

    'use strict';

    return Backbone.View.extend({

        events: {
            'submit form': 'formSubmit',
            'change select, input, textarea': 'validateChange',
            'click input, select, textarea': 'elementClick',
            'blur input, select, textarea': 'checkField'
        },

        /**
        * @function
        */
        activateLink: function(template, data){
        },

        ucFirst: function(str){
            var text = str;


            var parts = text.split(' '),
                len = parts.length,
                i, words = [];
            for (i = 0; i < len; i++) {
                var part = parts[i];
                var first = part[0].toUpperCase();
                var rest = part.substring(1, part.length).toLowerCase();
                var word = first + rest;
                words.push(word);

            }
            return words.join(' ');
        },

        htmlEntities: function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
},

        /**
        * @function
        */
        isValid: function (values) {
            var i, j, k,
                self = this,
                valid = true,
                errors = {}, validate, el,
                emailRe = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;


            // Loop over all of the elements in the template
            for (i = 0; i < self.inputs.fields.length; i++) {

                // Get the params to check
                validate = self.inputs.fields[i].validate;
                el = self.inputs.fields[i];

                // If the element expects to get validated, do it!
                if (validate) {
                    // Loop over all the validations required for each element
                    for (k = 0; k < validate.length; k++) {
                        // Conditional based on the validation type
                        switch (validate[k].type) {

                            // Standard Required Validation
                            case 'required':
                                if (!values[el.name] || !values[el.name].length) {
                                    errors[el.name] = validate[k].message;
                                    valid = false;
                                }

                                if(el.type == 'check'){
                                    if($('input[name=' + el.name + ']').is(':checked')){
                                        $('input[name=' + el.name + ']').parent('label').removeClass('error');
                                    }else{
                                        errors[el.name] = validate[k].message;
                                        $('input[name=' + el.name + ']').parent('label').addClass('error');
                                        valid = false;
                                    }
                                }
                                break;

                            // Validate Email
                            case 'email':
                                var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                if (!values[el.name] || !emailRe.test(values[el.name])) {
                                    errors[el.name] = validate[k].message;
                                    valid = false;
                                }
                                break;

                            case 'email_confirm':
                                if ($('#' + el.id).val() != $('#' + el.id + '_confirm').val()) {
                                    errors[el.name] = validate[k].message;
                                    errors[el.name + '_confirm'] = validate[k].message;
                                    valid = false;
                                }
                                break;

                            // Validate Minimum Length
                            case 'minLength':
                                if (!values[el.name] || values[el.name].length < validate[k].value) {
                                    errors[el.name] = validate[k].message;
                                    valid = false;
                                }
                                break;

                            // Validate Maximum Length
                            case 'maxLength':
                                if (!values[el.name] || values[el.name].length > validate[k].value) {
                                    errors[el.name] = validate[k].message;
                                    valid = false;
                                }
                                break;

                            case 'minor':
                                if(typeof self.age == 'undefined' || self.age.length >= 3){
                                    self.age = [];
                                    self.age.push(values[el.name]);
                                }else{
                                    self.age.push(values[el.name]);
                                }
                                if(self.age.length == 3){
                                    var date1 = new Date(self.age.join('/'));
                                    var date2 = new Date();
                                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                                    var diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24))/365;
                                    if (diffYears < 18 || isNaN(diffYears) == true) {
                                        errors['birthYear'] = 'You must be 18 years of age';
                                        errors['birthMonth'] = 'You must be 18 years of age';
                                        errors['birthDay'] = 'You must be 18 years of age';
                                        valid = false;
                                    }else{
                                        values['dob'] = self.age.join('/');
                                    }
                                }
                                break;

                            //Validate Zip code only numbers and 5 lenght
                            case 'phone':
                                var phone = values[el.name].replace(/\D/g, "");
                                var phoneRegex = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
                                if(phone.length > 0){
                                    if (!phoneRegex.test(phone) || phone.length < 10){
                                        errors[el.name] = validate[k].message;
                                        valid = false;
                                    }
                                }
                                break;

                            //Validate Zip code only numbers and 5 lenght
                            case 'zip':
                                var zipRegex = /^\d{5}$/;
                                if (!zipRegex.test(values[el.name])){
                                    errors[el.name] = validate[k].message;
                                    valid = false;
                                }
                                break;

                        }

                    }
                }
            }
            // Invalid - Return errors
            if (!valid) {
                return errors;

            // Valid - Return null
            } else {
                return null;
            }

        },

        /**
        * @function
        * @description This is called after a submitted form is validated and passes
        */
        submitSuccess: function () {

            if (this.template.options.afterSubmit) {
                $('body').trigger('moontemplate:link', {
                    data: this.data,
                    template: {
                        click: this.template.options.afterSubmit
                    }
                });
            }

            // Notify all of the widgets that data has been updated
            $('body').trigger('update-data', this.data);

        },

        /**
        * @function
        */
        validateChange: function () {
            if (this.needsValidation) {
                //this.formSubmit({}, true);
            }
        },

        /**
        * @function
        */
        formSubmit: function (event, silent) {
            event.preventDefault();
            var $elements = this.$el.find('input[type=text], select, textarea, input[type=checkbox], input[type=radio]'),
                values = {}, invalid,
                self = this, message = '';

            // From this point on, validate all changes
            this.needsValidation = true;

            // Loop over the elements and add them to the values object
            $elements.each(function () {

                // Radio Buttons
                if ($(this).attr('type') === 'radio') {
                    values[$(this).attr('name')] = $('input[name=' + $(this).attr('name') + ']:checked').val();

                // Checkboxes
                } else if ($(this).attr('type') === 'checkbox') {
                    if($(this).is(':checked')){
                        values[$(this).attr('name')] = '1';
                    }else{
                        values[$(this).attr('name')] = '0';
                    }
                // Other
                } else {
                    values[$(this).attr('name')] = $(this).val();
                }

            });

            // Validate the values
            invalid = this.isValid(values);

            // Add error classes from the bad elements.  Remove error classes from good elements.
            $elements.each(function () {
                if (invalid && invalid[$(this).attr('name')]) {
                    $(this).addClass('error');
                    $('label[for=' + $(this).attr('name') + ']').addClass('error');
                } else {
                    $(this).removeClass('error');
                    $('label[for=' + $(this).attr('name') + ']').removeClass('error');
                }
            });

            // Not Valid
            if (invalid) {
                _.each(invalid, function (val) {
                    message += val + '\n';
                });

                if (!silent) {
                    //alert(message);
                }

            // Ajax Submit
            } else if (this.template.options.submit) {
                if (!silent) {

                    values.catalog_id = this.data.catalogId;
                    values.offerId = this.data.appId;

                    var submitData = [];

                    $.each(values, function(k, v){
                        submitData[k] = v;
                    });

                    // Make an Ajax call

                    $.ajax({

                        url: this.template.options.submit.url,
                        jsonp: 'jsonp',
                        data : values,
                        type: this.template.options.submit.method || 'GET',
                        dataType: this.template.options.submit.dataType || 'jsonp',

                        // Success Callback
                        success: function (data) {
                            self.data[self.template.id] = {
                                request: submitData,
                                response: data
                            };

                            self.submitSuccess();

                        // Error Callback
                        }, error: function (data) {
                            alert(data.statusText || 'Oops... Something went wrong.');
                        }

                    });
                }

            // No Submit
            } else {

                if (!silent) {

                    this.data[this.template.id] = {
                        request: values
                    };

                    this.submitSuccess();
                }

            }

            return false;
        },

        /**
        * @function
        */
        checkField: function (evt) {
            if($(evt.target).val() == "" || $(evt.target).val() == null){
                $(evt.target).attr('placeholder', $(evt.target).attr('placeholder-text'));
            }
        },
        /**
        * @function
        */
        renderElement: function (el, data) {
            var html = '', i, self = this;

            // Default the border style
            if (el.type !== 'label' && el.type !== 'check' && el.type !== 'radio' && el.type !== 'submit') {
                el.border = el.border || {
                    thickness: '1px',
                    color: '#666666'
                };
            }
            if(el.type == 'radio' || el.type == 'check'){
                self.inputs.fields.push(el);
                html += '<div style="';

                if (el.backgroundGradient)  {
                    html += $.moontemplate.gradient(el, data);
                } else if (el.backgroundColor) {
                    html += ' background: ' + el.backgroundColor + '; ';
                }

                if (el.position) {
                    html += ' position: ' + (el.position || 'absolute') + '; ';
                }

                if (el.height) {
                    html += 'height: ' + el.height + '; ';
                } else if (el.type !== 'check' && el.type !== 'radio') {
                    html += 'height: 22px; ';
                }

                html += 'width: ' + (el.width || '95%') + '; ';

                html += 'top: ' + (el.top || '0px') + '; ';

                if(typeof el.left != 'undefined'){
                    html += 'left: ' + (el.left) + '; ';
                }

                if(typeof el.right != 'undefined'){
                    html += 'right: ' + (el.right) + '; ';
                }

                html += 'overflow: '+ (el.overflow || 'hidden') +'; ';

                if (el.fontSize) {
                    html += 'font-size: ' + el.fontSize + '; ';
                }

                html += 'text-align: ' + (el.textAlign || 'left') + '; ';

                if (el.border) {
                    el.border.thickness = el.border.thickness || '1px';
                    html += $.moontemplate.border(el);
                }

                html += '">';
            }

            switch(el.type) {

                // Text field
                case 'text':

                    self.inputs.fields.push(el);
                    html += '<input id="' + el.id + '" type="text" value="' + (el.value || '') + '" placeholder="' + (el.placeholder || '') + '" name="' + (el.name || '') + '" style="width: '+ (el.width || '') +'; height: '+ (el.height || '22px') +'; position: '+ (el.position || 'relative') +'; border: 0px; background: ' + (el.backgroundColor || 'none') + '; margin-left: ' + (el.marginLeft || 'none') + '; margin-right: ' + (el.marginRight || 'none') + '; margin-bottom: ' + (el.marginBottom || 'none') + '; margin-top: ' + (el.marginTop || 'none') + '; color: ' + (el.fontColor || '#000000') + '; border: 1px solid #000000;" />';
                    if(el.name == 'email'){
                        $.each(el.validate, function(){
                        if(this.type == 'email_confirm'){
                            html += '<input id="' + el.id + '_confirm" type="text" value="' + (el.value || '') + '" placeholder="Confirm Email*" name="' + (el.name || '') + '" style="width: '+ (el.width || '') +'; height: '+ (el.height || '22px') +'; position: '+ (el.position || 'relative') +'; border: 0px; background: ' + (el.backgroundColor || 'none') + '; margin-left: ' + (el.marginLeft || 'none') + '; margin-right: ' + (el.marginRight || 'none') + '; margin-bottom: ' + (el.marginBottom || 'none') + '; margin-top: ' + (el.marginTop || 'none') + '; color: ' + (el.fontColor || '#000000') + '; border: 1px solid #000000;" />';
                            if(el.click && el.click.dite){
                                var confirmDite = {};
                                confirmDite.screenName = el.click.dite.screenName + 'Confirm';
                                $('#' + el.id + '_confirm').live('focus', function(){
                                    $('body').trigger('dite', confirmDite);
                                });
                            }
                        }
                        });
                    }
                    break;

                // Select Dropdown
                case 'select':
                    self.inputs.fields.push(el);
                    html += '<select id="' + el.id + '" type="select" value="' + (el.value || '') + '" placeholder="' + (el.placeholder || '') + '" name="' + (el.name || '') + '" style="width: '+ (el.width || '') +'; height: 100%; position: '+ (el.position || 'relative') +'; border: 0px; background: none; margin-left: 5%; color: ' + (el.fontColor || '#000000') + ';">';
                    if (el.placeholder) {
                        html += '<option value="" style="color: #333;">' + self.htmlEntities(self.ucFirst(el.placeholder)) + '</option>';
                    }
                    for (i = 0; i < el.list.length; i++) {
                        if (typeof el.list[i] === 'string') {
                            html += '<option value="' + el.list[i] + '">' + self.htmlEntities(self.ucFirst(el.list[i])) + '</option>';
                        } else {
                            html += '<option value="' + el.list[i][1]+ '">' + self.htmlEntities(self.ucFirst(el.list[i][0])) + '</option>';
                        }
                    }
                    html += '</select>';
                    break;


                //  Field for a set value
                case 'setValueField':
                    self.inputs.fields.push(el);
                    html += '<input id="' + el.id + '" disabled type="text" value="' + (el.value) + '" name="' + (el.name || '') + '" style="width: '+ (el.width || '') +'; height: '+ (el.height || '22px') +'; position: '+ (el.position || 'relative') +'; border: 0px; background: ' + (el.backgroundColor || 'none') + '; margin-left: ' + (el.marginLeft || 'none') + '; margin-right: ' + (el.marginRight || 'none') + '; margin-bottom: ' + (el.marginBottom || 'none') + '; margin-top: ' + (el.marginTop || 'none') + '; color: ' + (el.fontColor || '#000000') + '; border: 1px solid #000000;" />';
                    break;

                // Text Area
                case 'textarea':
                    self.inputs.fields.push(el);
                    html += '<textarea id="' + el.id + '" type="text" placeholder="' + (el.placeholder || '') + '" name="' + (el.name || '') + '" style="width: 99%; height: 100%; position: '+ (el.position || 'relative') +'; border: 0px; background: none; margi`n-left: 1%; color: ' + (el.fontColor || '#000000') + ';">';
                    html += (el.value || '') ;
                    html += '</textarea>';
                    break;

                // Checkboxes
                case 'check':
                    self.inputs.fields.push(el);

                    html += '<div class="mtt-form-check" style="font-size: '+ (el.fontSize || 'inherit' ) +'; ';

                    if(el.top){
                        html += 'top: ' + el.top + '; ';
                    }

                    if(el.left){
                        html += 'left: ' + el.left + '; ';
                    }

                    html += '" ';

                    html += '>';
                    for (i = 0; i < el.list.length; i++) {
                        if (typeof el.list[i] === 'string') {
                            if(typeof el.checked == 'undefined' || el.checked != 'true'){
                                el.checked = "";
                            }else{
                                el.checked = 'checked="checked"';
                            }
                            if(el.checked == "checked=\"checked\""){
                                var checked = "checked";
                            }else{
                                var checked = "";
                            }
                            html += '<label class="checkbox_label ' + checked + '">' + el.list[i] + '<input '+ el.checked +' class="visuallyhidden" type="checkbox" value="' + el.list[i] + '" name="' + el.name + '" />';
                        } else {
                            html += '<input id="' + el.id + '" type="checkbox" value="' + el.list[i][1]+ '" name="' + el.name + '" />&nbsp;' + el.list[i][0]  + '<br />';
                        }
                    }
                    html += '</label></div>';
                    break;

                //Phone inputs
                case 'tel':
                self.inputs.fields.push(el);
                html += '<input id="' + el.id + '" type="tel" value="' + (el.value || '') + '" placeholder="' + (el.placeholder || '') + '" name="' + (el.name || '') + '" style="width: '+ (el.width || '') +'; height: '+ (el.height || '22px') +'; position: '+ (el.position || 'relative') +'; border: 0px; background: ' + (el.backgroundColor || 'none') + '; margin-left: ' + (el.marginLeft || 'none') + '; margin-right: ' + (el.marginRight || 'none') + '; margin-bottom: ' + (el.marginBottom || 'none') + '; margin-top: ' + (el.marginTop || 'none') + '; color: ' + (el.fontColor || '#000000') + '; border: 1px solid #000000;" pattern="([0-9]{3}) [0-9]{3}-[0-9]{4}"/>';
                html += '</div>';
                    break;

                // Radio Buttons
                case 'radio':
                    self.inputs.fields.push(el);
                    html += '<div style="width: '+( el.width || '100%' )+'; font-size: '+ (el.fontSize || 'inherit' ) +';">';
                    for (i = 0; i < el.list.length; i++) {
                        if (typeof el.list[i] === 'string') {
                            html += '<input type="radio" style="margin: 2px 0 0 2px;" value="' + el.list[i] + '" name="' + el.name + '" ' + ((el.value === el.list[i]) ? ' checked="checked"' : '') + ' />&nbsp;' + el.list[i]  + '<br />';
                        } else {
                            html += '<input type="radio" value="' + el.list[i][1]+ '" name="' + el.name + '" ' + ((el.value === el.list[i][1]) ? ' checked="checked"' : '') + '  />&nbsp;' + el.list[i][0]  + '<br />';
                        }
                    }
                    html += '</div>';
                    break;

                // Button
                case 'button':
                    html += '<input id="' + el.id + '" type="button" value="' + (el.value || 'Submit') + '" style="width: 100%; height: 100%; position: relative; border: 0px; background: none; color: ' + (el.fontColor || '#000000') + ';" />';
                    break;

                // Submit Button
                case 'submit':
                    if (el.backgroundGradient)  {
                        var gradient = $.moontemplate.gradient(el, data);
                    }

                    html += '<input id="' + el.id + '" type="submit" value="' + (el.value || '') + '" style="width: ' + (el.width || '100%') + '; height: ' + (el.height || '100%') + '; position: ' + (el.position || 'relative') + '; border: ' + (el.border || 'none') + '; border-radius: ' + (el.borderRadius || 'none') + '; background: ' + (el.backgroundColor || 'none') + '; color: ' + (el.fontColor || '#000000') + '; outline: none;  top: ' + (el.top || '') + '; left: ' + (el.left || '') + ';' + (gradient || '') + '" />';
                    break;

                // Label
                case 'label':
                    html += '<label id="' + el.id + '"';
                    if (el['for']) {
                        html += ' for="' + el['for'] + '"';
                    }
                    html += ' style="width: 100%; height: 100%; position: relative; border: 0px; background: none; color: ' + (el.fontColor || '#000000') + ';"';
                    html += '>';
                    html += el.value;
                    html += '</label>';
                    break;

                // Default Elements
                default:
                    break;

            }

            if(el.type == 'radio' || el.type == 'check'){
                html += '</div>';
            }


            //check for DITE events on inputs and bind
            if(typeof el.click != 'undefined' && el.click.dite != 'undefined'){
                if(el.type == 'check'){
                    $('input[name=' + el.name + ']').live('change', function(){
                        $('body').trigger('dite', el.click.dite);
                    });
                }else if(el.type == 'select'){
                    $('#' + el.id).live('blur', function(){
                        $('body').trigger('dite', el.click.dite);
                    });
                }else if(el.type == 'text'){
                    $('#' + el.id).live('mouseout', function(){
                        //$('body').trigger('dite', el.click.dite);
                    });
                }else{
                    $('#' + el.id).live('click', function(){
                        $('body').trigger('dite', el.click.dite);
                    });
                }
            }

            return html;

        },
        /**
        * @function
        */
        renderPreset: function (el, cols, data) {
            var html = '', i;
            var self = this;
            var colWidth = Math.round(100/cols)  + '%';
            html += '<div class="mtt-form-col" style="float: left; width: ' + colWidth + ';">';
                $(el).each(function(){
                    switch (this.preset){
                        case "address":
                            var address =
                            {
                                "id": this.id || "address",
                                "name": "address",
                                "position": "relative",
                                "width": this.width || "auto",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "backgroundColor": this.backgroundColor || "#ffffff",
                                "type": "text",
                                "placeholder": this.placeholder || "Address",
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "Address is required"
                                    }
                                ],
                                "click": this.click || "[]"
                            };
                            html += self.renderElement(address, data);
                            break;

                        case "ageRange":
                            var ageRange =
                            {
                                "id": this.id,
                                "name": "ageRange",
                                "position": "relative",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "height": "10%",
                                "top": "10px",
                                "backgroundColor": "#ffffff",
                                "type": "select",
                                "list": ["18-25", "26-30", "31-40", "41-60", "61+"],
                                "placeholder": this.placeholder || 'Age Range',
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "First Name is required"
                                    }
                                ],
                                "click": this.click || "[]"
                            };
                            html += self.renderElement(ageRange, data);
                            break;

                        case "country":
                            var country =
                            {
                                "id": this.id || "country",
                                "name": "country",
                                "position": "relative",
                                "width": this.width || "auto",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "backgroundColor": this.backgroundColor || "#ffffff",
                                "type": "select",
                                "placeholder": this.placeholder || "Country",
                                "list":['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'The Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia', 'Botswana', 'Bougainville', 'Brazil', 'British Indian Ocean', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde Islands', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'China - Hong Kong', 'China - Macau', 'China - Peoples Republic of', 'China - Taiwan', 'Colombia', 'Comoros', 'Democratic Republic of Congo', 'Republic of Congo', 'Cook Islands', 'Costa Rica', 'Cote d Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Faeroe Islands', 'Falkland Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See - Vatican City State', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthelemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor Leste', 'Togo', 'Tokelau Islands', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'U S Virgin Islands', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Wallis and Futuna Islands', 'Yemen', 'Zambia', 'Zimbabwe'],
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "Country is required"
                                    }
                                ],
                                "click": this.click || "[]"
                            };
                            html += self.renderElement(country, data);
                            break;

                        case "dob":

                            var birthMonth =
                            {
                                "id": "birthMonth",
                                "name": "birthMonth",
                                "position": "relative",
                                "width": this.width||"25%",
                                "marginLeft": "5%",
                                "marginRight": "1%",
                                "height": "10%",
                                "top": "10px",
                                "backgroundColor": "#ffffff",
                                "type": "text",
                                "placeholder": "MM",
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "Month is required"
                                    },
                                    {
                                        "type": "minor",
                                        "message": "You must be 18"
                                    }
                                ],
                                "click": this.click[0] || "[]"
                            }
                            html += self.renderElement(birthMonth, data);

                            var birthDay =
                            {
                                "id": "birthDay",
                                "name": "birthDay",
                                "position": "relative",
                                "width": this.width||"25%",
                                "marginLeft": "1%",
                                "marginRight": "1%",
                                "height": "10%",
                                "top": "10px",
                                "backgroundColor": "#ffffff",
                                "type": "text",
                                "placeholder": "DD",
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "Last Name is required"
                                    },
                                    {
                                        "type": "minor",
                                        "message": "You must be 18"
                                    }
                                ],
                                "click": this.click[1] || "[]"
                            }
                            html += self.renderElement(birthDay, data);

                            var birthYear =
                            {
                                "id": "birthYear",
                                "name": "birthYear",
                                "position": "relative",
                                "width": this.width||"25%",
                                "marginLeft": "1%",
                                "marginRight": "1%",
                                "height": "10%",
                                "top": "10px",
                                "backgroundColor": "#ffffff",
                                "type": "text",
                                "placeholder": "YYYY",
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "Birth Year is required"
                                    },
                                    {
                                        "type": "minor",
                                        "message": "You must be 18"
                                    }
                                ],
                                "click": this.click [2]|| "[]"
                            }
                            html += self.renderElement(birthYear, data);
                            break;

                        case "email":
                            var email =
                            {
                                "id": this.id,
                                "name": "email",
                                "height": "10%",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "type": "text",
                                "backgroundColor": "#ffffff",
                                "placeholder": this.placeholder || "Email Address",
                                "validate": this.validate || '[]',
                                "click": this.click || "[]",
                            };
                            html += self.renderElement(email, data);
                            break;

                        case "emailOptIn":
                            var emailOptIn =
                            {
                                "id": this.id,
                                "type": "check",
                                "name": this.name || "optin",
                                "checked": this.value || "false",
                                "width": this.width || "100%",
                                "listWidth": "95%",
                                "position": this.position || "absolute",
                                "list": [
                                    this.placeholder || ''
                                ],
                                "click": this.click || "[]",
                                "validate": this.validate || "[]"
                            };
                            html += self.renderElement(emailOptIn, data);
                            break;

                        case "checkBox":
                            if(typeof self.checkBoxCount == 'undefined'){
                                self.checkBoxCount = 0;
                            }else{
                                self.checkBoxCount++;
                            }

                            this.name = this.name || "checkbox" + self.checkBoxCount;

                            var checkBox =
                            {
                                "id": this.id,
                                "type": "check",
                                "name": this.name,
                                "checked": this.value || "false",
                                "width": this.width || "100%",
                                "listWidth": "95%",
                                "position": this.position || "absolute",
                                "list": [
                                    this.placeholder || ''
                                ],
                                "click": this.click || "[]",
                            };
                            html += self.renderElement(checkBox, data);
                            break;

                        case "city":
                            var city =
                            {
                                "id": this.id || "city",
                                "name": "city",
                                "position": "relative",
                                "width": this.width || "auto",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "backgroundColor": this.backgroundColor || "#ffffff",
                                "type": "text",
                                "placeholder": this.placeholder || "City",
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "City is required"
                                    }
                                ],
                                "click": this.click || "[]",
                            };
                            html += self.renderElement(city, data);
                            break;

                        case "firstName":
                            var firstName =
                            {
                                "id": this.id,
                                "name": "firstName",
                                "position": "relative",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "height": "10%",
                                "top": "10px",
                                "backgroundColor": "#ffffff",
                                "type": "text",
                                "placeholder": this.placeholder || "First Name",
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "First Name is required"
                                    }
                                ],
                                "click": this.click || "[]",
                            };
                            html += self.renderElement(firstName, data);
                            break;

                        case "gender":
                            var gender =
                            {
                               "id": this.id,
                                "name": "gender",
                                "position": "relative",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "height": "10%",
                                "top": "10px",
                                "backgroundColor": "#ffffff",
                                "type": "select",
                                "list": ["Male", "Female"],
                                "placeholder": this.placeholder || 'Gender',
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "First Name is required"
                                    }
                                ],
                                "click": this.click || "[]",
                            };
                            html += self.renderElement(gender, data);
                            break;

                        case "lastName":
                            var lastName =
                            {
                                "id": this.id,
                                "position": "relative",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "name": "lastName",
                                "height": "10%",
                                "top": "10px",
                                "backgroundColor": "#ffffff",
                                "type": "text",
                                "placeholder": this.placeholder || "Last Name",
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "Last Name is required"
                                    }
                                ],
                                "click": this.click || "[]"
                            }
                            html += self.renderElement(lastName, data);
                            break;

                        case "phone":
                            var phone =
                            {
                                "id": this.id || "phone",
                                "position": "relative",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "name": "phone",
                                "backgroundColor": "#ffffff",
                                "type": "text",
                                "placeholder": this.placeholder || "Phone Number",
                                "validate": this.validate || '[]',
                                "click": this.click || "[]"
                            }
                            html += self.renderElement(phone, data);
                            break;

                        case "setValue":
                            var setValueField =
                            {
                                "id": this.id || "",
                                "position": "relative",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "value": this.value,
                                "name": this.name || 'set-value',
                                "backgroundColor": "#ffffff",
                                "type": "setValueField",
                                "validate": this.validate || '[]',
                                "click": this.click || "[]"
                            }
                            html += self.renderElement(setValueField, data);
                            break;

                        case "state":
                            var state =
                            {
                                "id": this.id || "state",
                                "position": "relative",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "name": "state",
                                "backgroundColor": "#ffffff",
                                "type": "select",
                                "placeholder": this.placeholder || "State",
                                "list":[ 'ALABAMA','ALASKA','AMERICAN SAMOA','ARIZONA','ARKANSAS','CALIFORNIA', 'COLORADO', 'CONNECTICUT', 'DELAWARE', 'DISTRICT OF COLUMBIA','FEDERATED STATES OF MICRONESIA','FLORIDA',
                                    'GEORGIA','GUAM','HAWAII','IDAHO','ILLINOIS','INDIANA','IOWA','KANSAS','KENTUCKY','LOUISIANA','MAINE','MARSHALL ISLANDS','MARYLAND','MASSACHUSETTS','MICHIGAN','MINNESOTA','MISSISSIPPI','MISSOURI','MONTANA','NEBRASKA','NEVADA', 'NEW HAMPSHIRE','NEW JERSEY','NEW MEXICO','NEW YORK','NORTH CAROLINA','NORTH DAKOTA','NORTHERN MARIANA ISLANDS','OHIO','OKLAHOMA','OREGON','PALAU','PENNSYLVANIA','PUERTO RICO','RHODE ISLAND','SOUTH CAROLINA','SOUTH DAKOTA','TENNESSEE','TEXAS','UTAH','VERMONT','VIRGIN ISLANDS','VIRGINIA','WASHINGTON','WEST VIRGINIA','WISCONSIN','WYOMING'],
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "State is required"
                                    }
                                ],
                                "click": this.click || "[]"
                            }
                            html += self.renderElement(state, data);
                            break;

                        case "submit":
                            var submit =
                            {
                                "id": "form_widget_submit",
                                "type": "submit",
                                "value": "Submit",
                                "width": "20%",
                                "height": "10%",
                                "position": "absolute",
                                "max-height": el.maxHeight || 'inherit',
                                "top": "61%",
                                "left": "75%",
                                "name": "colors",
                                "fontColor": "#ffffff",
                                "backgroundColor": "#0d4e89",
                                "borderRadius": "2px",
                                "border": "1px solid #000000",
                                "click": this.click || "[]"
                            };
                            html += self.renderElement(submit, data);
                            break;

                        case "zipUS":
                            var zip =
                            {
                                "id": this.id,
                                "name": "zipUS",
                                "width": this.width || "100%",
                                "marginLeft": "5%",
                                "marginRight": "5%",
                                "backgroundColor": "#ffffff",
                                "height": "10%",
                                "type": "text",
                                "placeholder": this.placeholder || 'Zip Code',
                                "validate": [
                                    {
                                        "type": "required",
                                        "message": "Zip Code is required"
                                    },
                                    {
                                        "type" : "zip",
                                        "message": "Zip Code is not valid"
                                    }
                                ],
                                "click": this.click || "[]"
                            };
                            html += self.renderElement(zip, data);
                            break;

                    case "rowSpacer":
                        break;
                    }
                })
            html += '</div>';
            return html;

        },

        /**
        * @function
        * @param {Object} template
        * @param {Object} data
        */
        renderTemplate: function (template, data) {

            var i = 0,
                j = 0,
                self = this,
                html = '';

            this.inputs = [];
            this.inputs.fields = [];

            html += '<form';
            if (template.options.submit) {
                if (template.options.submit.method) {
                    html += ' method="' + template.options.submit.method + '"';
                }
                if (template.options.submit.url) {
                    html += ' action="' + template.options.submit.url + '"';
                }
                html += ' data-type="' + (template.options.submit.dataType || 'json') + '"';
            }
            html += ' style="width: 100%; height: 100%; position: relative;">';

            // Loop over all of the elements and add them to our HTML string
            if (template.options.elements) {
                for (i = 0; i < template.options.elements.length; i++) {
                    if (!template.options.elements[i].id) {
                        template.options.elements[i].id = new Date().getTime() + String(Math.random()).replace('.', '_');
                    }
                    html += self.renderElement(template.options.elements[i], data);
                }
            }

            // Loop over all of the presets and add them to our HTML string
            if (template.options.fields) {
                for (i = 0; i < template.options.fields.length; i++) {
                    for(j = 0; j < template.options.fields[i].length; j++){
                        if (!template.options.fields[i][j].id) {
                            template.options.fields[i][j].id = new Date().getTime() + String(Math.random()).replace('.', '_');
                        }
                    }
                    html += self.renderPreset(template.options.fields[i], template.options.fields.length, data);
                }
            }

            html += '</form>';

            return html;

        },

        /**
        * @function
        * @param {Object} event
        */
        elementClick: function (event) {

            var self = this, template, i,
                $el = $(event.target);

            if($el.attr('type') !== 'checkbox'){
                if(typeof this.template.options.elements != 'undefined'){
                    for (i = 0; i < this.template.options.elements.length; i++) {
                        if (self.template.options.elements[i].id === $el.attr('id') && self.template.options.elements[i].click) {
                            template = self.template.options.elements[i];
                        }
                    }

                }

                var placeHolder = $el.attr('placeholder');
                $el.attr('placeholder', '');
                if(typeof $el.attr('placeholder-text') == 'undefined' || $el.attr('placeholder-text') == '')
                $el.attr('placeholder-text', placeHolder);

            }

            if (template) {
                $('body').trigger('moontemplate:link', {
                    data: self.data,
                    template: template
                });
            }

        },

        /**
        * @function
        * @param {Object} obj
        */
        render: function (obj) {

            var self = this, i;

            // Default the width and height
            obj.template.width = obj.template.width || '100%';
            obj.template.height = obj.template.height || '100%';

            this.template = obj.template;
            this.data = obj.data;

            // Let Handlebars do its thing
            obj.template.content = this.renderTemplate(obj.template, obj.data);

            // Run the widget through MoonTemplate
            this.$el.moontemplate(obj.template, obj.data);

            $('head').append('<style type="text/css">' + css + '</style>');

            $('input:checkbox').click(function(){
                var $this = $(this);
                if ( $this.is(':checked') ) {
                    $this.parent('label').addClass('checked');
                    //$this.attr('checked','checked');
                } else {
                    $this.parent('label').removeClass('checked');
                    //$this.attr('checked','');
                }
            });
            $('input:radio').change(function() {
                var $this = $(this);
                var $group = $this.attr('name');
                $("input[name="+$group+"]").parent('label').removeClass('checked');
                if ( $this.is(':checked') ) {
                    $this.parent('label').addClass('checked');
                }
            });


            if ($.browser.msie  && parseInt($.browser.version, 9)) {
                var ie9 = true;
            } else {
                var ie9 = false;
            }

            if ( ie9 ) {
                $('[placeholder]:not(select)').focus(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                          input.val('');
                          input.removeClass('placeholder');
                    }
                  }).blur(function() {
                    var input = $(this);
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                          input.addClass('placeholder');
                          input.val(input.attr('placeholder'));
                    }
                  }).blur().parents('form').submit(function() {
                    $(this).find('[placeholder]').each(function() {
                          var input = $(this);
                          if (input.val() == input.attr('placeholder')) {
                            input.val('');
                          }
                    })
              });
            }

        }



    });

});
