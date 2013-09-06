var moontoastApplication, moontoastCallback, getParams, parseQuery;

(function () {

  var moontoastCallbacks = {};

  /**
  * @function
  */
  window.jsonParse=function(){
    var r="(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)",k='(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';k='(?:"'+k+'*")';
    var s=new RegExp("(?:false|true|null|[\\{\\}\\[\\]]|"+r+"|"+k+")","g"),t=new RegExp("\\\\(?:([^u])|u(.{4}))","g"),u={'"':'"',"/":"/","\\":"\\",b:"\u0008",f:"\u000c",n:"\n",r:"\r",t:"\t"};
    function v(h,j,e){return j?u[j]:String.fromCharCode(parseInt(e,16))}var w=new String(""),x=Object.hasOwnProperty;return function(h,
j){h=h.match(s);var e,c=h[0],l=false;if("{"===c)e={};else if("["===c)e=[];else{e=[];l=true}for(var b,d=[e],m=1-l,y=h.length;m<y;++m){c=h[m];var a;switch(c.charCodeAt(0)){default:a=d[0];a[b||a.length]=+c;b=void 0;break;case 34:c=c.substring(1,c.length-1);if(c.indexOf("\\")!==-1)c=c.replace(t,v);a=d[0];if(!b)if(a instanceof Array)b=a.length;else{b=c||w;break}a[b]=c;b=void 0;break;case 91:a=d[0];d.unshift(a[b||a.length]=[]);b=void 0;break;case 93:d.shift();break;case 102:a=d[0];a[b||a.length]=false;
b=void 0;break;case 110:a=d[0];a[b||a.length]=null;b=void 0;break;case 116:a=d[0];a[b||a.length]=true;b=void 0;break;case 123:a=d[0];d.unshift(a[b||a.length]={});b=void 0;break;case 125:d.shift();break}}if(l){if(d.length!==1)throw new Error;e=e[0]}else if(d.length)throw new Error;if(j){var p=function(n,o){var f=n[o];if(f&&typeof f==="object"){var i=null;for(var g in f)if(x.call(f,g)&&f!==n){var q=p(f,g);if(q!==void 0)f[g]=q;else{i||(i=[]);i.push(g)}}if(i)for(g=i.length;--g>=0;)delete f[i[g]]}return j.call(n,
o,f)};e=p({"":e},"")}return e}
  }();

  // JSON2
  if(!this.JSON){this.JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

  /**
  * @function
  */
  function getDomain () {
    var script = document.getElementById('moontoast_application');
    var src = script.getAttribute('src');
    if (src.indexOf('/moontoast.js') !== -1) {
      return src.split('/moontoast.js')[0] + '/';
    } else {
      return src.split('moontoast.js')[0];
    }
  };

  /**
  * @function
  */
  parseQuery = function (query) {
     var Params = new Object ();
     if ( ! query ) return Params; // return empty object
     var Pairs = query.split(/[;&]/);
     for ( var i = 0; i < Pairs.length; i++ ) {
        var KeyVal = Pairs[i].split('=');
        if ( ! KeyVal || KeyVal.length != 2 ) continue;
        var key = unescape( KeyVal[0] );
        var val = unescape( KeyVal[1] );
        val = val.replace(/\+/g, ' ');
        Params[key] = val;
     }
     return Params;
  };
  
  /**
  * @function
  */
  getParams = function (str) {
    return str.replace(/^[^\?]+\??/,'').replace('?', '');
  };

  /**
  * @function
  */
  function getScriptParams () {
    var scriptsInDOM = document.getElementsByTagName('script');
    var loaderScript = scriptsInDOM[scriptsInDOM.length - 1];
    return parseQuery(getParams(String(loaderScript.src)));
  };

  /**
  * @function
  */
  function getUserAgent () {
    return navigator.userAgent || navigator.vendor || window.opera;
  };

  /**
  * @function
  */
  function isMobileBrowser () {
    var userAgent = getUserAgent();

    // Mobile Param passed in the query string
    if (typeof parseQuery(getParams(window.location.search)).mobile !== 'undefined') {
      if (parseQuery(getParams(window.location.search)).mobile === 'false') {
        return false;
      } else {
        return true;
      }

    // User Agent Detection
    } else if (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) ||  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)) || userAgent.indexOf('iPad') !== -1 || userAgent.indexOf('iPod') !== -1) {
      return true;

    // Not Mobile
    } else {
      return false;
    }
    
  };

  /**
  * @function
  */
  function resize (id, data) {
    var iframe = document.getElementById('iframe_' + id);
    if (data.height) {
      iframe.parentNode.style.height = data.height;
    }
    if (data.width) {
      iframe.parentNode.style.width = data.width;
    }
  };

  /**
  * @function
  */
  function closePopup () {

    var $modal = document.getElementById('moontoast_popup'), 
      $opacity = document.getElementById('moontoast_popup_opacity'),
      $body = document.getElementsByTagName('body')[0];

    $body.removeChild($opacity);
    $body.removeChild($modal);

  };

  /**
  * @function
  */
  function openPopup (application, params) {

    var $modal = document.createElement('div'), 
      $opacity = document.createElement('div'),
      $body = document.getElementsByTagName('body')[0],
      $inner = document.createElement('div'),
      $close = document.createElement('div'),
      obj = {
        height: '700px',
        width: '525px'
      };

    // Close Button
    $close.style.background = 'url("//live.moontoast.com/images/buybutton/bb_close.png")';
    $close.style.cursor = 'pointer';
    $close.style.height = '25px';
    $close.style.position = 'absolute';
    $close.style.right = '-12px';
    $close.style.top = '-12px';
    $close.style.width = '25px';

    // Modal Inner
    $inner.setAttribute('id', 'moontoast_popup_inner');
    $inner.style.position = 'relative';
    $inner.style.width = obj.width;
    $inner.style.height = obj.height;
    $inner.style.margin = 'auto';
    $inner.appendChild($close);

    // Style the popup
    $modal.setAttribute('id', 'moontoast_popup');
    $modal.style.position = 'fixed';
    $modal.style.width = '100%';
    $modal.style.top = '50px';
    $modal.style.left = '0px';
    $modal.style.cursor = 'pointer';
    $modal.style.textAlign = 'center';
    $modal.appendChild($inner);

    // Style the opacity layer
    $opacity.setAttribute('id', 'moontoast_popup_opacity');
    $opacity.style.position = 'fixed';
    $opacity.style.width = '100%';
    $opacity.style.height = '100%';
    $opacity.style.background = '#000000';
    $opacity.style.top = '0px';
    $opacity.style.left = '0px';
    $opacity.style.opacity = '0.5';
    $opacity.style.cursor = 'pointer';

    // Remove the modal on click
    $opacity.onclick = closePopup;
    $modal.onclick = closePopup;

    // Add the modal to the body
    $body.appendChild($opacity);
    $body.appendChild($modal);

    params.renderTo = 'moontoast_popup_inner';

    renderIframe(application, obj, params);

  };

  /**
  * @function
  */
  function renderPopup (application, params) {
    var $renderTo = document.getElementById(params.renderTo);
    $renderTo.style.display = 'block';
    $renderTo.onclick = function () {
      if (isMobileBrowser()) {
        document.location = getDomain() + '/index.html' + params.catalogId + '?mobile=true';
      } else {
        openPopup(application, params);
      }
    };
    
  };

  /**
  * @function
  */
  function renderIframe (application, iframeParams, params) {
    console.log(application);
    var renderToId, iframe, urlParams = '#' + (window.location.search || '?1=1') + '&appType=' + application,
           id = new Date().getTime();

    moontoastCallbacks[id] = {};

    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        if (typeof params[param] === 'function') {
          moontoastCallbacks[id][param] = params[param];
        } else if (typeof params[param] === 'object') {
          urlParams += '&' + param + '=' + JSON.stringify(params[param]);
        } else {
          urlParams += '&' + param + '=' + params[param];
        }
      }
    }
    urlParams += '&resp=' + id;
    urlParams += '&caller=' + window.location.protocol + '//' + window.location.host + window.location.pathname;

    if (params.renderTo) {
       renderTo = document.getElementById(params.renderTo);
    } else {
      renderTo = document.createElement('div');
      document.getElementsByTagName('body')[0].appendChild(renderTo);
    }

    iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'iframe_' + id);

    if (iframeParams.height) {
      iframe.setAttribute('height', iframeParams.height);
    } else if (params.height) {
      iframe.setAttribute('height', params.height);
    } else {
       iframe.setAttribute('height', '100%');
    }

    if (iframeParams.width) {
      iframe.setAttribute('width', iframeParams.width);
    } else if (params.width) {
      iframe.setAttribute('width', params.width);
    } else {
      iframe.setAttribute('width', '100%');
    }

    iframe.setAttribute('frameborder', 0);
    iframe.style.margin = 'auto';
    iframe.style.overflow = 'hidden';
    iframe.style.background = '#fff url(//live.moontoast.com/images/lightbox-ico-loading.gif) no-repeat center center';
    
    iframe.setAttribute('src', getDomain() + 'index.html' + urlParams);

    renderTo.appendChild(iframe);
    renderTo.style.display = 'block';

    if (typeof params.rendering === 'function') {
      params.rendering();
    }

  };

  /**
  * @function
  * @param {Object} params
  */
  moontoastCallback = function (params) {

      if (params.f === 'resize') {
        resize(params.r, params.d);
      } else if (typeof moontoastCallbacks[params.r] === 'object' && typeof moontoastCallbacks[params.r][params.f] === 'function') {
        moontoastCallbacks[params.r][params.f](params.d);
      }
    
  };

  /**
  * @function
  * @param {String} application
  * @param {Object} params
  */
  moontoastApplication = function (application, params) {

    if (window.location.hash.indexOf('{') === -1) {

      switch (application) {

        // Cross-Domain Callback
        case 'callback' :
          moontoastCallback(params);
        break;

        // API
        case 'api' :
          renderIframe(application, {
            height: '0px',
            width: '0px'
          }, params);
        break;

        // Mobile Fallbacks
        default :
          if (params.popup) {
            renderPopup(application, params)
          } else {
            renderIframe(application, {}, params);
          }
        break;

      };


    }

  };

  if (window.location.hash.indexOf('{') !== -1) {
    window.parent.parent.moontoastCallback(
      jsonParse(window.location.hash.replace('#', ''))
    );
  }

}());