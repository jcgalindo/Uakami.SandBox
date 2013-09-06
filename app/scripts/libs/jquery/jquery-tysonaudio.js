/**
* @namespace
*/
var tysonAudioListener = {

  onInit: function () {},

  /**
  * @function
  */
  onUpdate: function () {

    // Local variables
    var audioObject = this, elementIndex = 0, audioElement, timeupdate;

    // Link the flash object we are listening to to the HTML5 audio object it is inheriting
    for (var i = 0; i < tysonAudioObjects.length; i++) {
      if (audioObject.url.indexOf(tysonAudioObjects[i].html5.find('source').attr('src')) !== -1) {
        elementIndex = i;
      }
    }

    // Set the isPlaying variable
    tysonAudioObjects[elementIndex].isPlaying = this.isPlaying;

    tysonAudioObjects[elementIndex].currentState = {
       currentTime: parseInt(audioObject.position) / 1000,
       duration: parseInt(audioObject.duration) / 1000,
       volume: audioObject.volume,
       src: audioObject.url
    };

    // If the audio is playing
    if (tysonAudioObjects[elementIndex].isPlaying === 'true') {

      if (tysonAudioObjects[elementIndex].timeupdate) {
        tysonAudioObjects[elementIndex].timeupdate(
           tysonAudioObjects[elementIndex].currentState
        );
      }

    // If the audio is not playing
    } else {

      if (parseInt(audioObject.position) === 0) {
        if (typeof tysonAudioObjects[elementIndex].ended === 'function') {
          tysonAudioObjects[elementIndex].ended(
             tysonAudioObjects[elementIndex].currentState
          );
        }
      }

    }

  }

}, tysonAudioObjects = [];

/**
* @class
*/
jQuery.fn.tysonAudio = function (options, params) {

  var $this = $(this), controller = {

    /**
    * @function
    */
    init: function () {

      // Loop over all of the elements that match the selector
      $this.each(function () {

        // Local variables
        var audioElement = $(this)[0], $el = $(this), timeupdate;

        // Add the flash element to the body
        $('body').append('<object class="playerpreview" data-id="' + tysonAudioObjects.length + '" type="application/x-shockwave-flash" data="' + options.swfPath + '" width="1" height="1"><param name="movie" value="' + options.swfPath + '" /><param name="AllowScriptAccess" value="always" /><param name="FlashVars" value="listener=tysonAudioListener&amp;interval=500" /></object>');

        // Set the data-id on the audio tags as well
        $(this).attr('data-id', tysonAudioObjects.length);

        // Store the audio information for this element
        tysonAudioObjects.push({
          id: tysonAudioObjects.length,
          html5: $el,
          flash: controller.getFlashObject($el.attr('data-id')),
          position: 0,
          volume: 100,
          isPlaying: false
        });

      });

    },

    /**
    * @function
    * @param {Int} id
    */
    getFlashObject: function (id) {
      return $('.playerpreview[data-id=' + id + ']')[0];
    },

    /**
    * @function
    * @param {Int} id
    * @param {String} url
    */
    setUrl: function (id, url) {
      if (options.needsFallback) {
        controller.getFlashObject(id).SetVariable('method:setUrl', url);
      } else {
        $this[0].load(url);
      }
    },

    /**
    * @function
    * @param {Int} id
    * @param {String} url
    */
    play: function (id, url) {
      if (options.needsFallback) {
        if (!tysonAudioObjects[id].position) {
          controller.setUrl(id, url);
          controller.getFlashObject(id).SetVariable('enabled', 'true');
        }
        controller.getFlashObject(id).SetVariable('method:play', '');
      } else {
        $this[0].play();
      }
    },

    /**
    * @function
    * @param {Int} id
    */
    pause: function (id) {
      if (options.needsFallback && typeof controller.getFlashObject(id) === 'function' || typeof controller.getFlashObject(id) === 'object') {
        controller.getFlashObject(id).SetVariable('method:stop', '');
        tysonAudioObjects[id].isPlaying = false;
      } else if (typeof $this[0].pause === 'function') {
        $this[0].pause();
      }
    },

    /**
    * @function
    * @param {Int} id
    */
    stop: function (id) {
      if (options.needsFallback) {
        controller.getFlashObject(id).SetVariable('method:stop', '');
        tysonAudioObjects[id].isPlaying = false;
      } else {
        $this[0].stop();
      }
    },

    /**
    * @function
    */
    getDuration: function (id) {
       id = id || $this.attr('data-id');
       if (options.needsFallback) {
        return (tysonAudioObjects[id].currentState) ? tysonAudioObjects[id].currentState.duration : 0;
      } else {
        return $this[0].duration;
      }
    },

    /**
    * @function
    */
    getPosition: function (id) {
       id = id || $this.attr('data-id');
       if (options.needsFallback) {
        return tysonAudioObjects[id].currentState.currentTime;
      } else {
        return $this[0].currentTime;
      }
    },

    /**
    * @function
    * @param {Int} id
    * @param {Int} position
    */
    setPosition: function (id, position) {
      if (options.needsFallback) {
        controller.getFlashObject(id).SetVariable('method:setPosition', (position * 1000));
      } else {
        $this[0].currentTime = position;
      }
    },

    /**
    * @function
    * @param {Int} id
    * @param {Int} volume
    */
    setVolume: function (id, volume) {
      if (options.needsFallback) {
        controller.getFlashObject(id).SetVariable('method:setVolume', volume);
      } else {
        $this[0].volume = volume;
      }
    },

    /**
    * @function
    * @param {Int} id
    * @param {Function} fn
    */
    ended: function (id, fn) {
      if (options.needsFallback) {
        tysonAudioObjects[id].ended = fn;
      } else {
        $this[0].addEventListener('ended', function() {
          fn({
             currentTime: $this[0].currentTime,
             duration: $this[0].duration,
             volume: $this[0].volume,
             src: $this[0].src
          });
      }, false);
      }
    },

    /**
    * @function
    * @param {Int} id
    * @param {Function} fn
    */
    timeupdate: function (id, fn) {
      if (options.needsFallback) {
        tysonAudioObjects[id].timeupdate = fn;
      } else {
         $this[0].addEventListener('timeupdate', function() {
           fn({
               currentTime: $this[0].currentTime,
               duration: $this[0].duration,
               volume: $this[0].volume,
               src: $this[0].src
            });
        }, false);
      }
    }

  };

  /**
  * @function
  */
  (function () {

    var method = options,
           types = [];

    $this.find('source').each(function () {
      types.push($(this).attr('type'));
    });

    // Extend the options so they can be passed in
    options = $.extend({
      types: types,
      needsFallback: false,
      swfPath: 'jquery-tysonaudio.swf'
    }, options);

    // We don't need the fallback if HTML5 audio is supported.
    if (document.createElement('audio').canPlayType) {

      options.needsFallback = true;

      // Loop over the supported types to determine if this browser supports them
      for  (var i = 0; i < options.types.length; i++) {

        // If the browser does not support them
        if (document.createElement('audio').canPlayType(options.types[i])) {
          options.needsFallback = false;
        }

      }

    // We need the fallback
    } else {
      options.needsFallback = true;
    }

    if (typeof method === 'string') {

      if (method === 'play') {
        return controller[method]($($this[0]).attr('data-id'), $($this[0]).find('source').attr('src'), params);
      } else {
         return controller[method]($($this[0]).attr('data-id'), params);
      }

    } else {

      // Only init the controller if we need a flash fallback
      if (options.needsFallback) {
        controller.init();
      }

    }

  }());

  return controller;

};
