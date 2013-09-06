require([
    'jquery',
    'lodash'
], function ($, _) {

    /*global window */
    return (function (window) {

        var $ = window.jQuery,
            dite2Config = {
                /*
                 *
*https://analytics.moontoast.com/track.gif?http_host=infiniti.moontoast.com&server_protocol=https&service_type=swf&catalog_id=2632&cart_id=&request_uri=/engagement_app/InfinityEngagementVideoLiveReveal/2632/default/videoAutoPlay/value/FF3nZLXOj5c/
            "/engagement_app/appName/" + offerId + "/default/" + (screenName ? (screenName + "/") : "") + (eventName ? (eventName + "/") : "") + (eventData ? (eventData + "/") : "");
            */
                appType: 'engagement_app_mobile',
                //May not need environment
                environment: navigator.userAgent,
                screenName: '',
                originDomain: document.location.hostname,
                referrer: document.referrer,
                userAgent: encodeURIComponent(navigator.userAgent),
                accept_language: navigator.language,
                protocol: location.protocol,
                requestUri: window.location.pathname.substring(1),
                trackingToken: String(new Date().getTime() + Math.random(4)).replace('.', ''),
                productionState: 'p'
            };

        /**
        * @function
        */
        function getTimezoneName() {

            var tmSummer, so, wo, tmWinter;
            tmSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
            so = -1 * tmSummer.getTimezoneOffset();
            tmWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
            wo = -1 * tmWinter.getTimezoneOffset();

            if (-660 === so && -660 === wo) { return 'Pacific/Midway'; }
            if (-600 === so && -600 === wo) { return 'Pacific/Tahiti'; }
            if (-570 === so && -570 === wo) { return 'Pacific/Marquesas'; }
            if (-540 === so && -600 === wo) { return 'America/Adak'; }
            if (-540 === so && -540 === wo) { return 'Pacific/Gambier'; }
            if (-480 === so && -540 === wo) { return 'US/Alaska'; }
            if (-480 === so && -480 === wo) { return 'Pacific/Pitcairn'; }
            if (-420 === so && -480 === wo) { return 'US/Pacific'; }
            if (-420 === so && -420 === wo) { return 'US/Arizona'; }
            if (-360 === so && -420 === wo) { return 'US/Mountain'; }
            if (-360 === so && -360 === wo) { return 'America/Guatemala'; }
            if (-360 === so && -300 === wo) { return 'Pacific/Easter'; }
            if (-300 === so && -360 === wo) { return 'US/Central'; }
            if (-300 === so && -300 === wo) { return 'America/Bogota'; }
            if (-240 === so && -300 === wo) { return 'US/Eastern'; }
            if (-240 === so && -240 === wo) { return 'America/Caracas'; }
            if (-240 === so && -180 === wo) { return 'America/Santiago'; }
            if (-180 === so && -240 === wo) { return 'Canada/Atlantic'; }
            if (-180 === so && -180 === wo) { return 'America/Montevideo'; }
            if (-180 === so && -120 === wo) { return 'America/Sao_Paulo'; }
            if (-150 === so && -210 === wo) { return 'America/St_Johns'; }
            if (-120 === so && -180 === wo) { return 'America/Godthab'; }
            if (-120 === so && -120 === wo) { return 'America/Noronha'; }
            if (-60 === so && -60 === wo) { return 'Atlantic/Cape_Verde'; }
            if (0 === so && -60 === wo) { return 'Atlantic/Azores'; }
            if (0 === so && 0 === wo) { return 'Africa/Casablanca'; }
            if (60 === so && 0 === wo) { return 'Europe/London'; }
            if (60 === so && 60 === wo) { return 'Africa/Algiers'; }
            if (60 === so && 120 === wo) { return 'Africa/Windhoek'; }
            if (120 === so && 60 === wo) { return 'Europe/Amsterdam'; }
            if (120 === so && 120 === wo) { return 'Africa/Harare'; }
            if (180 === so && 120 === wo) { return 'Europe/Athens'; }
            if (180 === so && 180 === wo) { return 'Africa/Nairobi'; }
            if (240 === so && 180 === wo) { return 'Europe/Moscow'; }
            if (240 === so && 240 === wo) { return 'Asia/Dubai'; }
            if (270 === so && 210 === wo) { return 'Asia/Tehran'; }
            if (270 === so && 270 === wo) { return 'Asia/Kabul'; }
            if (300 === so && 240 === wo) { return 'Asia/Baku'; }
            if (300 === so && 300 === wo) { return 'Asia/Karachi'; }
            if (330 === so && 330 === wo) { return 'Asia/Calcutta'; }
            if (345 === so && 345 === wo) { return 'Asia/Katmandu'; }
            if (360 === so && 300 === wo) { return 'Asia/Yekaterinburg'; }
            if (360 === so && 360 === wo) { return 'Asia/Colombo'; }
            if (390 === so && 390 === wo) { return 'Asia/Rangoon'; }
            if (420 === so && 360 === wo) { return 'Asia/Almaty'; }
            if (420 === so && 420 === wo) { return 'Asia/Bangkok'; }
            if (480 === so && 420 === wo) { return 'Asia/Krasnoyarsk'; }
            if (480 === so && 480 === wo) { return 'Australia/Perth'; }
            if (540 === so && 480 === wo) { return 'Asia/Irkutsk'; }
            if (540 === so && 540 === wo) { return 'Asia/Tokyo'; }
            if (570 === so && 570 === wo) { return 'Australia/Darwin'; }
            if (570 === so && 630 === wo) { return 'Australia/Adelaide'; }
            if (600 === so && 540 === wo) { return 'Asia/Yakutsk'; }
            if (600 === so && 600 === wo) { return 'Australia/Brisbane'; }
            if (600 === so && 660 === wo) { return 'Australia/Sydney'; }
            if (630 === so && 660 === wo) { return 'Australia/Lord_Howe'; }
            if (660 === so && 600 === wo) { return 'Asia/Vladivostok'; }
            if (660 === so && 660 === wo) { return 'Pacific/Guadalcanal'; }
            if (690 === so && 690 === wo) { return 'Pacific/Norfolk'; }
            if (720 === so && 660 === wo) { return 'Asia/Magadan'; }
            if (720 === so && 720 === wo) { return 'Pacific/Fiji'; }
            if (720 === so && 780 === wo) { return 'Pacific/Auckland'; }
            if (765 === so && 825 === wo) { return 'Pacific/Chatham'; }
            if (780 === so && 780 === wo) { return 'Pacific/Enderbury'; }
            if (840 === so && 840 === wo) { return 'Pacific/Kiritimati'; }
            return 'US/Pacific';
        }

        /**
        * @function
        * @param {Object} data
        */
        function pixelTrack (data) {
            /*
            "/engagement_app/appName/" + offerId + "/default/" + (screenName ? (screenName + "/") : "") + (eventName ? (eventName + "/") : "") + (eventData ? (eventData + "/") : "");
                            https://analytics.moontoast.com/track.gif?http_host=infiniti.moontoast.com&request_uri=/engagement_app_mobile/InfinitiEngagementVideoLiveReveal/2632/default/&referrer=http://infiniti-video.moontoast.com/?mobile=true&user_agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36&accept_language=en-US&request_method=get&server_protocol=https&service_type=js&tracking_token=690bf5bd-9e08-4519-9043-bf10e25e0ad6&origin_domain=infiniti.moontoast.com&_=1371045975757&catalog_id=2632
            */

            var eventType = (data.screenName ? data.screenName + '/' : '') + (data.eventName ? data.eventName + '/' : '') ;

            var $img, url = '//analytics.moontoast.com/track.gif?http_host='+dite2Config.originDomain+'&request_uri=/'+dite2Config.appType+'/'+ dite2Config.appDiteName + '/' + dite2Config.catId + '/default/' + eventType +'&referrer='+dite2Config.referrer+'&user_agent='+dite2Config.userAgent+'&accept_language='+dite2Config.accept_language+'&request_method=get&server_protocol='+dite2Config.protocol+'&service_type=js&tracking_token='+dite2Config.trackingToken+'&origin_domain='+dite2Config.originDomain+'&catalog_id='+dite2Config.catId;

            /*
            var $img, url = '//analytics.moontoast.com/track.gif?appType=[' + dite2Config.appType + ']&environment=[' + dite2Config.environment + ']&offerID=[' + dite2Config.offerID + ']&screenName=[' + data.screenName + ']&eventType=[' + (data.eventType || '') +']&eventName=[' + (data.eventName || '') + ']&eventData=[' + (data.eventData || '') + ']&originDomain=[' + (dite2Config.originDomain) + ']&timeZone=[' + getTimezoneName() + ']&trackingToken=[' + dite2Config.trackingToken + ']&productionState=[' + dite2Config.productionState + ']';
            */
            $img = new Image();
            $img.src = url;
            window.analyticsLoading = true;
            $img.onload = function(){
                window.analyticsLoading = false;
            }
        }

        /**
        * @function
        * @param {Object} data
        */
        $.diteSetup = function (data) {
            dite2Config = $.extend(dite2Config, data);
        };

        /**
        * @function
        * @param {Object} data - An object defining the DITE interaction data for this element. If this property is included, the dite information provided will be tracked when the element is rendered. The dite object supports the following properties:
        *    @config screenName - {String} The name of the screen to register this interaction with. Example: “default”
        *    @config eventName - {String} The name of the event for this interaction. Example: “clickPrivacyPolicy”
        *    @config eventData - {String} Optional: Event data to send, if applicable
        */
        $.dite = function (data) {
            pixelTrack(data);
        };

        /**
        * @event
        * @description Listens for the dite event to be called to log dite events
        * @param {Object} event
        * @param {Object} data
        */
        $('body').bind('dite2', function (event, data) {
            console.log('here');
            return false;
            $.dite(data);
        });

        /**
        * @event
        * @description Sets up the DITE config
        * @param {Object} event
        * @param {Object} data
        */
        $('body').bind('dite2-setup', function (event, data) {
            $.diteSetup(data);
        });

    }(window));

});
