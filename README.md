# App.ApiHtml5

The HTML5 API is the browser-based client-side API for building Moontoast Social Engagement applications and communicating with the Moontoast Platform API. It will be namespaced under the main Moontoast API domain so that its files are served from the same domain as the API it makes requests against, eliminating cross-domain issues.

The code that is built from this project will be placed into the `public/` directory, which will be deployed along with the rest of the API. The `public/` directory will be mapped to the `html5/` web path of the APi. This will result in the JavaScript files being loaded in production from `https://api.moontoast.com/html5/`.  All of the development for the project should take place in the 'app' directory.

To build this project, you will need to have Yeoman installed (http://yeoman.io/)

To run the project in development mode, run "yeoman server:app".  To run in production mode, run "yeoman server:dist".  To build the project, run "yeoman build".

The project consists of:

<pre>
    /app - Development
        /scripts

            /collections
            - Backbone.js collections

            /fixtures
            - Static JSON files for testing

            /libs
            - Third party libraries and reusable Moontoast libraries.

            /models
            - Backbone.js models

            /templates
            - Handlebars templates used by the widgets

            /widgets 
            - All of the modular widgets are here.  Widgets are called from the templates.  Widgets can be included by other widgets and are used to render offers and even make cross-domain api calls.  All of the widgets should be valid Backbone.js views with a render() method.
            
            /main.js
            - This manages loading widgets and initializes the primary requested widget

            /config.js
            - The require.js build file.  This loads in all of the dependencies.

        /images

        /styles
        - These should all be compass .scss files.
        
        /flash
        - Flash fallbacks for old browsers

        moontoast.js 
        - The Moontoast core JavaScript library.  Everything is loaded through this file.

    /public
    - Automatically generated from the build (excluded from git)

    /test
    - JavaScript Unit and Functional tests

    /Gruntfile.js
    - The Yeoman Grunt File.  Specifies how the app is loaded and built.  See the Yeoman docs.
</pre>

The primary JavaScript dependencies for the HTML5 API are:

<pre>
    - Require.js - for modular loading
    - Backbone.js - for organization and models
    - Lodash - for convenience methods.  It is a drop-in replacement for Underscore.
    - jQuery - for DOM selection and Ajax
    - Handlebars - for templating
    - jQuery.moontemplate - JSON-based HTML5 / Actionscript templating system for shared code
    - jQuery.dite - Analytics event tracking
</pre>

The only dependency for style is the combination of compass and SASS.

The HTML5 API is designed to serve up any app type from the same code-base.  A sample embed code using the JavaScript API might look like this:

<pre>
    <div id="moontoast_embed"></div>
      <script type="text/javascript">
        document.write('<script type="text\/javascript" src="\/\/api.moontoast.com\/html5\/moontoast.js?_=' + new Date().getTime() + '" id="moontoast_application"><\/script>');
      </script>
      <script type="text/javascript">
        new moontoastApplication('offer', {
          renderTo: 'moontoast_embed',
          id: '30',
          width: 398,
          height: 460
        });
      </script>
</pre>

The code above is rendering a 398px x 460px offers app inside of the #moontoast_embed div and passing in the offer ID of 30 to the app itself.  The app will take that information and make a call to the server requesting the offer with an ID of 30.  When the data comes back, the offer widget will render the app and all of the widgets requested in the app template.

The JavaScript API can also be used to make cross-domain GET, POST, PUT and DELETE requests to the server.  A direct API request might look like this:

<pre>
      <script type="text/javascript">
        document.write('<script type="text\/javascript" src="\/\/api.moontoast.com\/html5\/moontoast.js?_=' + new Date().getTime() + '" id="moontoast_application"><\/script>');
      </script>
      <script type="text/javascript">
        new moontoastApplication ('api', {
            method: 'GET',
            url: 'offers/e8a6e0f5-cba8-11e1-9b3f-c8bcc8a476f4',
            success: function (data) {
                console.log(data);
            },
            error: function (data) {
                console.log(data);
            }
        });
      </script>
</pre>

The above code would get around cross-domain issues and the console would have the requested data.  The object can contain any strings that the jQuery ajax function will accept.