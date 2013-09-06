/*jslint nomen: true, plusplus: true */
/*global define, $, Handlebars, alert, _ */

define([
    'backbone',
    'moontemplate'
], function (Backbone, moontemplate) {

    'use strict';

    return Backbone.View.extend({

        events: {
            'submit form': 'formSubmit',
            'change select, input, textarea': 'validateChange',
            'click input, select, textarea': 'elementClick'
        },

        /**
        * @function
        */
        isValid: function (values) {

            var i, j,
                self = this,
                valid = true,
                errors = {}, validate, el,
                emailRe = /\S+@\S+/;

            // Loop over all of the elements in the template
            for (i = 0; i < self.template.options.elements.length; i++) {

                // Get the params to check
                validate = self.template.options.elements[i].validate;
                el = self.template.options.elements[i];

                // If the element expects to get validated, do it!
                if (validate) {

                    // Loop over all the validations required for each element
                    for (j = 0; j < validate.length; j++) {

                        // Conditional based on the validation type
                        switch (validate[j].type) {

                            // Standard Required Validation
                            case 'required':
                                if (!values[el.name] || !values[el.name].length) {
                                    errors[el.name] = validate[j].message;
                                    valid = false;
                                }
                                break;

                            // Validate Email
                            case 'email':
                                if (!values[el.name] || !emailRe.test(values[el.name])) {
                                    errors[el.name] = validate[j].message;
                                    valid = false;
                                }
                                break;

                            // Validate Minimum Length
                            case 'minLength':
                                if (!values[el.name] || values[el.name].length < validate[j].value) {
                                    errors[el.name] = validate[j].message;
                                    valid = false;
                                }
                                break;

                            // Validate Maximum Length
                            case 'maxLength':
                                if (!values[el.name] || values[el.name].length > validate[j].value) {
                                    errors[el.name] = validate[j].message;
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
                this.formSubmit({}, true);
            }
        },

        /**
        * @function
        */
        formSubmit: function (event, silent) {

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
                    values[$(this).attr('name')] = [];
                    $('input[name=' + $(this).attr('name') + ']:checked').each(function () {
                        values[$(this).attr('name')].push($(this).val());
                    });

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
                    $(this).parent().addClass('error');
                    $('label[for=' + $(this).attr('name') + ']').addClass('error');
                } else {
                    $(this).parent().removeClass('error');
                    $('label[for=' + $(this).attr('name') + ']').removeClass('error');
                }
            });

            // Not Valid
            if (invalid) {
                _.each(invalid, function (val) {
                    message += val + '\n';
                });

                if (!silent) {
                    alert(message);
                }

            // Ajax Submit
            } else if (this.template.options.submit) {

                if (!silent) {

                    // Make an Ajax call
                    $.ajax({

                        url: this.template.options.submit.url,
                        data: values,
                        type: this.template.options.submit.method || 'GET',
                        dataType: this.template.options.submit.dataType || 'json',

                        // Success Callback
                        success: function (data) {

                            self.data[self.template.id] = {
                                request: values,
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
        renderElement: function (el, data) {

            var html = '', i;

            // Default the border style
            if (el.type !== 'label' && el.type !== 'check' && el.type !== 'radio') {
                el.border = el.border || {
                    thickness: '2px',
                    color: '#666666'
                };
            }

            html += '<div style="position: relative; float: left; ';

            if (el.backgroundGradient)  {
                html += $.moontemplate.gradient(el, data);
            } else if (el.backgroundColor) {
                html += ' background: ' + el.backgroundColor + '; ';
            }

            if (el.height) {
                html += 'height: ' + el.height + '; ';
            } else if (el.type !== 'check' && el.type !== 'radio') {
                html += 'height: 22px; ';
            }
            
            html += 'width: ' + (el.width || '95%') + '; ';

            html += 'margin-top: ' + (el.top || '0px') + '; ';

            html += 'margin-left: ' + (el.left || '0px') + '; ';

            html += 'overflow: hidden; ';

            if (el.fontSize) {
                html += 'font-size: ' + el.fontSize + '; ';
            }

            if (el.border) {
                el.border.thickness = el.border.thickness || '2px';
                html += $.moontemplate.border(el);
            }

            html += '">';

            switch(el.type) {

                // Text field
                case 'text':
                    html += '<input id="' + el.id + '" type="text" value="' + (el.value || '') + '" placeholder="' + (el.placeholder || '') + '" name="' + (el.name || '') + '" style="width: 99%; height: 100%; position: relative; border: 0px; background: none; margin-left: 1%; color: ' + (el.fontColor || '#000000') + ';" />';
                    break;

                // Select Dropdown
                case 'select':
                    html += '<select id="' + el.id + '" type="text" value="' + (el.value || '') + '" placeholder="' + (el.placeholder || '') + '" name="' + (el.name || '') + '" style="width: 99%; height: 100%; position: relative; border: 0px; background: none; margin-left: 1%; color: ' + (el.fontColor || '#000000') + ';">';
                    if (el.placeholder) {
                        html += '<option value="" style="color: #333;">' + el.placeholder + '</option>';
                    }
                    for (i = 0; i < el.list.length; i++) {
                        if (typeof el.list[i] === 'string') {
                            html += '<option value="' + el.list[i] + '">' + el.list[i] + '</option>';
                        } else {
                            html += '<option value="' + el.list[i][1]+ '">' + el.list[i][0] + '</option>';
                        }
                    }
                    html += '</select>';
                    break;

                // Text Area
                case 'textarea':
                    html += '<textarea id="' + el.id + '" type="text" placeholder="' + (el.placeholder || '') + '" name="' + (el.name || '') + '" style="width: 99%; height: 100%; position: relative; border: 0px; background: none; margin-left: 1%; color: ' + (el.fontColor || '#000000') + ';">';
                    html += (el.value || '') ;
                    html += '</textarea>';
                    break;

                // Checkboxes
                case 'check':
                    for (i = 0; i < el.list.length; i++) {
                        if (typeof el.list[i] === 'string') {
                            html += '<input type="checkbox" value="' + el.list[i] + '" name="' + el.name + '" />&nbsp;' + el.list[i]  + '<br />';
                        } else {
                            html += '<input type="checkbox" value="' + el.list[i][1]+ '" name="' + el.name + '" />&nbsp;' + el.list[i][0]  + '<br />';
                        }
                    }
                    break;

                // Radio Buttons
                case 'radio':
                    for (i = 0; i < el.list.length; i++) {
                        if (typeof el.list[i] === 'string') {
                            html += '<input type="radio" value="' + el.list[i] + '" name="' + el.name + '" ' + ((el.value === el.list[i]) ? ' checked="checked"' : '') + ' />&nbsp;' + el.list[i]  + '<br />';
                        } else {
                            html += '<input type="radio" value="' + el.list[i][1]+ '" name="' + el.name + '" ' + ((el.value === el.list[i][1]) ? ' checked="checked"' : '') + '  />&nbsp;' + el.list[i][0]  + '<br />';
                        }
                    }
                    break;

                // Button
                case 'button':
                    html += '<input id="' + el.id + '" type="button" value="' + (el.value || 'Submit') + '" style="width: 100%; height: 100%; position: relative; border: 0px; background: none; color: ' + (el.fontColor || '#000000') + ';" />';
                    break;

                // Submit Button
                case 'submit':
                    html += '<input id="' + el.id + '" type="submit" value="' + (el.value || 'Submit') + '" style="width: 100%; height: 100%; position: relative; border: 0px; background: none; color: ' + (el.fontColor || '#000000') + ';" />';
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
                self = this,
                html = '';

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

            for (i = 0; i < this.template.options.elements.length; i++) {
                if (self.template.options.elements[i].id === $el.attr('id') && self.template.options.elements[i].click) {
                    template = self.template.options.elements[i];
                }
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

        }

    });

});