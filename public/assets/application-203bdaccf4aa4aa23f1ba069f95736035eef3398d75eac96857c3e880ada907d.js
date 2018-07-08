/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if (!(typeof options.beforeSend === "function" ? options.beforeSend(xhr, options) : void 0)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
(function() {


}).call(this);
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=286)}([function(e,t,n){e.exports=n(205)()},function(e,t,n){"use strict";e.exports=n(285)},function(e,t,n){"use strict";e.exports=function(){}},function(e,t,n){"use strict";e.exports=function(e,t,n,r,o,i,a,u){if(!e){var s;if(void 0===t)s=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,o,i,a,u],c=0;(s=new Error(t.replace(/%s/g,function(){return l[c++]}))).name="Invariant Violation"}throw s.framesToPop=1,s}}},function(e,t,n){"use strict";n.r(t);var r=n(2),o=n.n(r),i=n(1),a=n.n(i),u=n(0),s=n.n(u),l=n(104),c=n.n(l),f=n(3),p=n.n(f),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function h(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var v=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=h(this,e.call.apply(e,[this].concat(i))),r.state={match:r.computeMatch(r.props.history.location.pathname)},h(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:d({},this.context.router,{history:this.props.history,route:{location:this.props.history.location,match:this.state.match}})}},t.prototype.computeMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}},t.prototype.componentWillMount=function(){var e=this,t=this.props,n=t.children,r=t.history;p()(null==n||1===a.a.Children.count(n),"A <Router> may have only one child element"),this.unlisten=r.listen(function(){e.setState({match:e.computeMatch(r.location.pathname)})})},t.prototype.componentWillReceiveProps=function(e){o()(this.props.history===e.history,"You cannot change <Router history>")},t.prototype.componentWillUnmount=function(){this.unlisten()},t.prototype.render=function(){var e=this.props.children;return e?a.a.Children.only(e):null},t}(a.a.Component);v.propTypes={history:s.a.object.isRequired,children:s.a.node},v.contextTypes={router:s.a.object},v.childContextTypes={router:s.a.object.isRequired};var m=v,y=m;function g(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var b=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=g(this,e.call.apply(e,[this].concat(i))),r.history=c()(r.props),g(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){o()(!this.props.history,"<BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { BrowserRouter as Router }`.")},t.prototype.render=function(){return a.a.createElement(y,{history:this.history,children:this.props.children})},t}(a.a.Component);b.propTypes={basename:s.a.string,forceRefresh:s.a.bool,getUserConfirmation:s.a.func,keyLength:s.a.number,children:s.a.node};var _=b,w=n(103),E=n.n(w);function x(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var O=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=x(this,e.call.apply(e,[this].concat(i))),r.history=E()(r.props),x(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){o()(!this.props.history,"<HashRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { HashRouter as Router }`.")},t.prototype.render=function(){return a.a.createElement(y,{history:this.history,children:this.props.children})},t}(a.a.Component);O.propTypes={basename:s.a.string,getUserConfirmation:s.a.func,hashType:s.a.oneOf(["hashbang","noslash","slash"]),children:s.a.node};var C=O,S=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function k(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var P=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},j=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=k(this,e.call.apply(e,[this].concat(i))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!P(e)){e.preventDefault();var t=r.context.router.history,n=r.props,o=n.replace,i=n.to;o?t.replace(i):t.push(i)}},k(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),n=e.innerRef,r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["replace","to","innerRef"]);p()(this.context.router,"You should not use <Link> outside a <Router>");var o=this.context.router.history.createHref("string"==typeof t?{pathname:t}:t);return a.a.createElement("a",S({},r,{onClick:this.handleClick,href:o,ref:n}))},t}(a.a.Component);j.propTypes={onClick:s.a.func,target:s.a.string,replace:s.a.bool,to:s.a.oneOfType([s.a.string,s.a.object]).isRequired,innerRef:s.a.oneOfType([s.a.string,s.a.func])},j.defaultProps={replace:!1},j.contextTypes={router:s.a.shape({history:s.a.shape({push:s.a.func.isRequired,replace:s.a.func.isRequired,createHref:s.a.func.isRequired}).isRequired}).isRequired};var T=j,R=n(102),N=n.n(R);function M(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var A=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=M(this,e.call.apply(e,[this].concat(i))),r.history=N()(r.props),M(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){o()(!this.props.history,"<MemoryRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { MemoryRouter as Router }`.")},t.prototype.render=function(){return a.a.createElement(m,{history:this.history,children:this.props.children})},t}(a.a.Component);A.propTypes={initialEntries:s.a.array,initialIndex:s.a.number,getUserConfirmation:s.a.func,keyLength:s.a.number,children:s.a.node};var D=A,I=n(101),L=n.n(I),z={},U=0,F=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"string"==typeof t&&(t={path:t});var n=t,r=n.path,o=void 0===r?"/":r,i=n.exact,a=void 0!==i&&i,u=n.strict,s=void 0!==u&&u,l=n.sensitive,c=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=z[n]||(z[n]={});if(r[e])return r[e];var o=[],i={re:L()(e,o,t),keys:o};return U<1e4&&(r[e]=i,U++),i}(o,{end:a,strict:s,sensitive:void 0!==l&&l}),f=c.re,p=c.keys,d=f.exec(e);if(!d)return null;var h=d[0],v=d.slice(1),m=e===h;return a&&!m?null:{path:o,url:"/"===o&&""===h?"/":h,isExact:m,params:p.reduce(function(e,t,n){return e[t.name]=v[n],e},{})}},B=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function W(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var q=function(e){return 0===a.a.Children.count(e)},H=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=W(this,e.call.apply(e,[this].concat(i))),r.state={match:r.computeMatch(r.props,r.context.router)},W(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:B({},this.context.router,{route:{location:this.props.location||this.context.router.route.location,match:this.state.match}})}},t.prototype.computeMatch=function(e,t){var n=e.computedMatch,r=e.location,o=e.path,i=e.strict,a=e.exact,u=e.sensitive;if(n)return n;p()(t,"You should not use <Route> or withRouter() outside a <Router>");var s=t.route,l=(r||s.location).pathname;return o?F(l,{path:o,strict:i,exact:a,sensitive:u}):s.match},t.prototype.componentWillMount=function(){o()(!(this.props.component&&this.props.render),"You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"),o()(!(this.props.component&&this.props.children&&!q(this.props.children)),"You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"),o()(!(this.props.render&&this.props.children&&!q(this.props.children)),"You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored")},t.prototype.componentWillReceiveProps=function(e,t){o()(!(e.location&&!this.props.location),'<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),o()(!(!e.location&&this.props.location),'<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'),this.setState({match:this.computeMatch(e,t.router)})},t.prototype.render=function(){var e=this.state.match,t=this.props,n=t.children,r=t.component,o=t.render,i=this.context.router,u=i.history,s=i.route,l=i.staticContext,c={match:e,location:this.props.location||s.location,history:u,staticContext:l};return r?e?a.a.createElement(r,c):null:o?e?o(c):null:n?"function"==typeof n?n(c):q(n)?null:a.a.Children.only(n):null},t}(a.a.Component);H.propTypes={computedMatch:s.a.object,path:s.a.string,exact:s.a.bool,strict:s.a.bool,sensitive:s.a.bool,component:s.a.func,render:s.a.func,children:s.a.oneOfType([s.a.func,s.a.node]),location:s.a.object},H.contextTypes={router:s.a.shape({history:s.a.object.isRequired,route:s.a.object.isRequired,staticContext:s.a.object})},H.childContextTypes={router:s.a.object.isRequired};var $=H,V=$,Y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},G="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};var K=function(e){var t=e.to,n=e.exact,r=e.strict,o=e.location,i=e.activeClassName,u=e.className,s=e.activeStyle,l=e.style,c=e.isActive,f=e.ariaCurrent,p=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["to","exact","strict","location","activeClassName","className","activeStyle","style","isActive","ariaCurrent"]);return a.a.createElement(V,{path:"object"===(void 0===t?"undefined":G(t))?t.pathname:t,exact:n,strict:r,location:o,children:function(e){var n=e.location,r=e.match,o=!!(c?c(r,n):r);return a.a.createElement(T,Y({to:t,className:o?[u,i].filter(function(e){return e}).join(" "):u,style:o?Y({},l,s):l,"aria-current":o&&f},p))}})};K.propTypes={to:T.propTypes.to,exact:s.a.bool,strict:s.a.bool,location:s.a.object,activeClassName:s.a.string,className:s.a.string,activeStyle:s.a.object,style:s.a.object,isActive:s.a.func,ariaCurrent:s.a.oneOf(["page","step","location","true"])},K.defaultProps={activeClassName:"active",ariaCurrent:"true"};var Q=K;var X=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.enable=function(e){this.unblock&&this.unblock(),this.unblock=this.context.router.history.block(e)},t.prototype.disable=function(){this.unblock&&(this.unblock(),this.unblock=null)},t.prototype.componentWillMount=function(){p()(this.context.router,"You should not use <Prompt> outside a <Router>"),this.props.when&&this.enable(this.props.message)},t.prototype.componentWillReceiveProps=function(e){e.when?this.props.when&&this.props.message===e.message||this.enable(e.message):this.disable()},t.prototype.componentWillUnmount=function(){this.disable()},t.prototype.render=function(){return null},t}(a.a.Component);X.propTypes={when:s.a.bool,message:s.a.oneOfType([s.a.func,s.a.string]).isRequired},X.defaultProps={when:!0},X.contextTypes={router:s.a.shape({history:s.a.shape({block:s.a.func.isRequired}).isRequired}).isRequired};var J=X,Z=n(60),ee=n(59),te=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ne=function(e,t,n,r){var o=void 0;"string"==typeof e?(o=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}}(e)).state=t:(void 0===(o=te({},e)).pathname&&(o.pathname=""),o.search?"?"!==o.search.charAt(0)&&(o.search="?"+o.search):o.search="",o.hash?"#"!==o.hash.charAt(0)&&(o.hash="#"+o.hash):o.hash="",void 0!==t&&void 0===o.state&&(o.state=t));try{o.pathname=decodeURI(o.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+o.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(o.key=n),r?o.pathname?"/"!==o.pathname.charAt(0)&&(o.pathname=Object(Z.default)(o.pathname,r.pathname)):o.pathname=r.pathname:o.pathname||(o.pathname="/"),o},re=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&Object(ee.default)(e.state,t.state)};"undefined"==typeof window||!window.document||window.document.createElement,"function"==typeof Symbol&&Symbol.iterator,Object.assign,Object.assign,"function"==typeof Symbol&&Symbol.iterator,Object.assign;var oe=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){p()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=ne(e.to),n=ne(this.props.to);re(t,n)?o()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"'):this.perform()},t.prototype.perform=function(){var e=this.context.router.history,t=this.props,n=t.push,r=t.to;n?e.push(r):e.replace(r)},t.prototype.render=function(){return null},t}(a.a.Component);oe.propTypes={push:s.a.bool,from:s.a.string,to:s.a.oneOfType([s.a.string,s.a.object]).isRequired},oe.defaultProps={push:!1},oe.contextTypes={router:s.a.shape({history:s.a.shape({push:s.a.func.isRequired,replace:s.a.func.isRequired}).isRequired,staticContext:s.a.object}).isRequired};var ie=oe,ae=n(11),ue=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function se(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var le=function(e,t){return e?ue({},t,{pathname:Object(ae.addLeadingSlash)(e)+t.pathname}):t},ce=function(e){return"string"==typeof e?Object(ae.parsePath)(e):(n=(t=e).pathname,r=void 0===n?"/":n,o=t.search,i=void 0===o?"":o,a=t.hash,u=void 0===a?"":a,{pathname:r,search:"?"===i?"":i,hash:"#"===u?"":u});var t,n,r,o,i,a,u},fe=function(e){return"string"==typeof e?e:Object(ae.createPath)(e)},pe=function(e){return function(){p()(!1,"You cannot %s with <StaticRouter>",e)}},de=function(){},he=function(e){function t(){var n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=se(this,e.call.apply(e,[this].concat(i))),r.createHref=function(e){return Object(ae.addLeadingSlash)(r.props.basename+fe(e))},r.handlePush=function(e){var t=r.props,n=t.basename,o=t.context;o.action="PUSH",o.location=le(n,ce(e)),o.url=fe(o.location)},r.handleReplace=function(e){var t=r.props,n=t.basename,o=t.context;o.action="REPLACE",o.location=le(n,ce(e)),o.url=fe(o.location)},r.handleListen=function(){return de},r.handleBlock=function(){return de},se(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.getChildContext=function(){return{router:{staticContext:this.props.context}}},t.prototype.componentWillMount=function(){o()(!this.props.history,"<StaticRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { StaticRouter as Router }`.")},t.prototype.render=function(){var e=this.props,t=e.basename,n=(e.context,e.location),r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["basename","context","location"]),o={createHref:this.createHref,action:"POP",location:function(e,t){if(!e)return t;var n=Object(ae.addLeadingSlash)(e);return 0!==t.pathname.indexOf(n)?t:ue({},t,{pathname:t.pathname.substr(n.length)})}(t,ce(n)),push:this.handlePush,replace:this.handleReplace,go:pe("go"),goBack:pe("goBack"),goForward:pe("goForward"),listen:this.handleListen,block:this.handleBlock};return a.a.createElement(m,ue({},r,{history:o}))},t}(a.a.Component);he.propTypes={basename:s.a.string,context:s.a.object.isRequired,location:s.a.oneOfType([s.a.string,s.a.object])},he.defaultProps={basename:"",location:"/"},he.childContextTypes={router:s.a.object.isRequired};var ve=he;var me=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.componentWillMount=function(){p()(this.context.router,"You should not use <Switch> outside a <Router>")},t.prototype.componentWillReceiveProps=function(e){o()(!(e.location&&!this.props.location),'<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),o()(!(!e.location&&this.props.location),'<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.')},t.prototype.render=function(){var e=this.context.router.route,t=this.props.children,n=this.props.location||e.location,r=void 0,o=void 0;return a.a.Children.forEach(t,function(t){if(a.a.isValidElement(t)){var i=t.props,u=i.path,s=i.exact,l=i.strict,c=i.sensitive,f=i.from,p=u||f;null==r&&(o=t,r=p?F(n.pathname,{path:p,exact:s,strict:l,sensitive:c}):e.match)}}),r?a.a.cloneElement(o,{location:n,computedMatch:r}):null},t}(a.a.Component);me.contextTypes={router:s.a.shape({route:s.a.object.isRequired}).isRequired},me.propTypes={children:s.a.node,location:s.a.object};var ye=me,ge=F,be=n(34),_e=n.n(be),we=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var Ee=function(e){var t=function(t){var n=t.wrappedComponentRef,r=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["wrappedComponentRef"]);return a.a.createElement($,{render:function(t){return a.a.createElement(e,we({},r,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,t.propTypes={wrappedComponentRef:s.a.func},_e()(t,e)};n.d(t,"BrowserRouter",function(){return _}),n.d(t,"HashRouter",function(){return C}),n.d(t,"Link",function(){return T}),n.d(t,"MemoryRouter",function(){return D}),n.d(t,"NavLink",function(){return Q}),n.d(t,"Prompt",function(){return J}),n.d(t,"Redirect",function(){return ie}),n.d(t,"Route",function(){return V}),n.d(t,"Router",function(){return y}),n.d(t,"StaticRouter",function(){return ve}),n.d(t,"Switch",function(){return ye}),n.d(t,"matchPath",function(){return ge}),n.d(t,"withRouter",function(){return Ee})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=t.OPEN_MODAL="OPEN_MODAL",o=t.CLOSE_MODAL="CLOSE_MODAL";t.openModal=function(e){var t=e.modal,n=e.peg;return{type:r,modal:t,peg:n}},t.closeModal=function(){return{type:o}}},function(e,t,n){"use strict";n.r(t);var r=n(1),o=n(0),i=n.n(o),a=i.a.shape({trySubscribe:i.a.func.isRequired,tryUnsubscribe:i.a.func.isRequired,notifyNestedSubs:i.a.func.isRequired,isSubscribed:i.a.func.isRequired}),u=i.a.shape({subscribe:i.a.func.isRequired,dispatch:i.a.func.isRequired,getState:i.a.func.isRequired});function s(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"store",n=arguments[1]||t+"Subscription",o=function(e){function o(n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o);var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,e.call(this,n,r));return i[t]=n.store,i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(o,e),o.prototype.getChildContext=function(){var e;return(e={})[t]=this[t],e[n]=null,e},o.prototype.render=function(){return r.Children.only(this.props.children)},o}(r.Component);return o.propTypes={store:u.isRequired,children:i.a.element.isRequired},o.childContextTypes=((e={})[t]=u.isRequired,e[n]=a,e),o}var l=s(),c=n(34),f=n.n(c),p=n(3),d=n.n(p);var h=null,v={notify:function(){}};var m=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.store=t,this.parentSub=n,this.onStateChange=r,this.unsubscribe=null,this.listeners=v}return e.prototype.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},e.prototype.notifyNestedSubs=function(){this.listeners.notify()},e.prototype.isSubscribed=function(){return Boolean(this.unsubscribe)},e.prototype.trySubscribe=function(){var e,t;this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=(e=[],t=[],{clear:function(){t=h,e=h},notify:function(){for(var n=e=t,r=0;r<n.length;r++)n[r]()},get:function(){return t},subscribe:function(n){var r=!0;return t===e&&(t=e.slice()),t.push(n),function(){r&&e!==h&&(r=!1,t===e&&(t=e.slice()),t.splice(t.indexOf(n),1))}}}))},e.prototype.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=v)},e}(),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};var g=0,b={};function _(){}function w(e){var t,n,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=o.getDisplayName,s=void 0===i?function(e){return"ConnectAdvanced("+e+")"}:i,l=o.methodName,c=void 0===l?"connectAdvanced":l,p=o.renderCountProp,h=void 0===p?void 0:p,v=o.shouldHandleStateChanges,w=void 0===v||v,E=o.storeKey,x=void 0===E?"store":E,O=o.withRef,C=void 0!==O&&O,S=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(o,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),k=x+"Subscription",P=g++,j=((t={})[x]=u,t[k]=a,t),T=((n={})[k]=a,n);return function(t){d()("function"==typeof t,"You must pass a component to the function returned by "+c+". Instead received "+JSON.stringify(t));var n=t.displayName||t.name||"Component",o=s(n),i=y({},S,{getDisplayName:s,methodName:c,renderCountProp:h,shouldHandleStateChanges:w,storeKey:x,withRef:C,displayName:o,wrappedComponentName:n,WrappedComponent:t}),a=function(n){function a(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,n.call(this,e,t));return r.version=P,r.state={},r.renderCount=0,r.store=e[x]||t[x],r.propsMode=Boolean(e[x]),r.setWrappedInstance=r.setWrappedInstance.bind(r),d()(r.store,'Could not find "'+x+'" in either the context or props of "'+o+'". Either wrap the root component in a <Provider>, or explicitly pass "'+x+'" as a prop to "'+o+'".'),r.initSelector(),r.initSubscription(),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(a,n),a.prototype.getChildContext=function(){var e,t=this.propsMode?null:this.subscription;return(e={})[k]=t||this.context[k],e},a.prototype.componentDidMount=function(){w&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},a.prototype.componentWillReceiveProps=function(e){this.selector.run(e)},a.prototype.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},a.prototype.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=_,this.store=null,this.selector.run=_,this.selector.shouldComponentUpdate=!1},a.prototype.getWrappedInstance=function(){return d()(C,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+c+"() call."),this.wrappedInstance},a.prototype.setWrappedInstance=function(e){this.wrappedInstance=e},a.prototype.initSelector=function(){var t=e(this.store.dispatch,i);this.selector=function(e,t){var n={run:function(r){try{var o=e(t.getState(),r);(o!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=o,n.error=null)}catch(e){n.shouldComponentUpdate=!0,n.error=e}}};return n}(t,this.store),this.selector.run(this.props)},a.prototype.initSubscription=function(){if(w){var e=(this.propsMode?this.props:this.context)[k];this.subscription=new m(this.store,e,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},a.prototype.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(b)):this.notifyNestedSubs()},a.prototype.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},a.prototype.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},a.prototype.addExtraProps=function(e){if(!(C||h||this.propsMode&&this.subscription))return e;var t=y({},e);return C&&(t.ref=this.setWrappedInstance),h&&(t[h]=this.renderCount++),this.propsMode&&this.subscription&&(t[k]=this.subscription),t},a.prototype.render=function(){var e=this.selector;if(e.shouldComponentUpdate=!1,e.error)throw e.error;return Object(r.createElement)(t,this.addExtraProps(e.props))},a}(r.Component);return a.WrappedComponent=t,a.displayName=o,a.childContextTypes=T,a.contextTypes=j,a.propTypes=j,f()(a,t)}}var E=Object.prototype.hasOwnProperty;function x(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function O(e,t){if(x(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(var o=0;o<n.length;o++)if(!E.call(t,n[o])||!x(e[n[o]],t[n[o]]))return!1;return!0}var C=n(17),S=n(105),k="object"==typeof self&&self&&self.Object===Object&&self,P=(S.a||k||Function("return this")()).Symbol,j=Object.prototype;j.hasOwnProperty,j.toString,P&&P.toStringTag;Object.prototype.toString;P&&P.toStringTag;Object.getPrototypeOf,Object;var T=Function.prototype,R=Object.prototype,N=T.toString;R.hasOwnProperty,N.call(Object);function M(e){return function(t,n){var r=e(t,n);function o(){return r}return o.dependsOnOwnProps=!1,o}}function A(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function D(e,t){return function(t,n){n.displayName;var r=function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)};return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=A(e);var o=r(t,n);return"function"==typeof o&&(r.mapToProps=o,r.dependsOnOwnProps=A(o),o=r(t,n)),o},r}}var I=[function(e){return"function"==typeof e?D(e):void 0},function(e){return e?void 0:M(function(e){return{dispatch:e}})},function(e){return e&&"object"==typeof e?M(function(t){return Object(C.bindActionCreators)(e,t)}):void 0}];var L=[function(e){return"function"==typeof e?D(e):void 0},function(e){return e?void 0:M(function(){return{}})}],z=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function U(e,t,n){return z({},n,e,t)}var F=[function(e){return"function"==typeof e?function(e){return function(t,n){n.displayName;var r=n.pure,o=n.areMergedPropsEqual,i=!1,a=void 0;return function(t,n,u){var s=e(t,n,u);return i?r&&o(s,a)||(a=s):(i=!0,a=s),a}}}(e):void 0},function(e){return e?void 0:function(){return U}}];function B(e,t,n,r){return function(o,i){return n(e(o,i),t(r,i),i)}}function W(e,t,n,r,o){var i=o.areStatesEqual,a=o.areOwnPropsEqual,u=o.areStatePropsEqual,s=!1,l=void 0,c=void 0,f=void 0,p=void 0,d=void 0;function h(o,s){var h,v,m=!a(s,c),y=!i(o,l);return l=o,c=s,m&&y?(f=e(l,c),t.dependsOnOwnProps&&(p=t(r,c)),d=n(f,p,c)):m?(e.dependsOnOwnProps&&(f=e(l,c)),t.dependsOnOwnProps&&(p=t(r,c)),d=n(f,p,c)):y?(h=e(l,c),v=!u(h,f),f=h,v&&(d=n(f,p,c)),d):d}return function(o,i){return s?h(o,i):(f=e(l=o,c=i),p=t(r,c),d=n(f,p,c),s=!0,d)}}function q(e,t){var n=t.initMapStateToProps,r=t.initMapDispatchToProps,o=t.initMergeProps,i=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),a=n(e,i),u=r(e,i),s=o(e,i);return(i.pure?W:B)(a,u,s,e,i)}var H=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function $(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function V(e,t){return e===t}var Y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.connectHOC,n=void 0===t?w:t,r=e.mapStateToPropsFactories,o=void 0===r?L:r,i=e.mapDispatchToPropsFactories,a=void 0===i?I:i,u=e.mergePropsFactories,s=void 0===u?F:u,l=e.selectorFactory,c=void 0===l?q:l;return function(e,t,r){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},u=i.pure,l=void 0===u||u,f=i.areStatesEqual,p=void 0===f?V:f,d=i.areOwnPropsEqual,h=void 0===d?O:d,v=i.areStatePropsEqual,m=void 0===v?O:v,y=i.areMergedPropsEqual,g=void 0===y?O:y,b=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(i,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),_=$(e,o,"mapStateToProps"),w=$(t,a,"mapDispatchToProps"),E=$(r,s,"mergeProps");return n(c,H({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:_,initMapDispatchToProps:w,initMergeProps:E,pure:l,areStatesEqual:p,areOwnPropsEqual:h,areStatePropsEqual:m,areMergedPropsEqual:g},b))}}();n.d(t,"Provider",function(){return l}),n.d(t,"createProvider",function(){return s}),n.d(t,"connectAdvanced",function(){return w}),n.d(t,"connect",function(){return Y})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.updateBoard=t.createBoard=t.clearBoardErrors=t.receiveBoardErrors=t.deleteBoard=t.requestOneBoard=t.requestAllBoards=t.CLEAR_BOARD_ERRORS=t.RECEIVE_BOARD_ERRORS=t.REMOVE_BOARD=t.RECEIVE_SINGLE_BOARD=t.RECEIVE_BOARDS=void 0;var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(218));var o=t.RECEIVE_BOARDS="RECEIVE_BOARDS",i=t.RECEIVE_SINGLE_BOARD="RECEIVE_SINGLE_BOARD",a=t.REMOVE_BOARD="REMOVE_BOARD",u=t.RECEIVE_BOARD_ERRORS="RECEIVE_BOARD_ERRORS",s=t.CLEAR_BOARD_ERRORS="CLEAR_BOARD_ERRORS";t.requestAllBoards=function(){return function(e){return r.fetchBoards().then(function(t){return e({type:o,payload:t})})}},t.requestOneBoard=function(e){return function(t){return r.fetchBoard(e).then(function(e){return t({type:i,payload:e})})}},t.deleteBoard=function(e){return function(t){return r.deleteBoard(e).then(function(e){return t({type:a,id:e})})}},t.receiveBoardErrors=function(e){return{type:u,errors:e}},t.clearBoardErrors=function(){return{type:s}},t.createBoard=function(e){return function(t){return r.createBoard(e).then(function(e){return t({type:i,board:e})})}},t.updateBoard=function(e){return function(t){return r.updateBoard(e).then(function(e){return t({type:i,board:e})})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.deletePeg=t.updatePeg=t.createPeg=t.requestOnePeg=t.requestAllPegs=t.clearPegErrors=t.receivePegErrors=t.removePeg=t.receiveSinglePeg=t.receivePegs=t.CLEAR_PEG_ERRORS=t.RECEIVE_PEG_ERRORS=t.REMOVE_PEG=t.RECEIVE_SINGLE_PEG=t.RECEIVE_PEGS=void 0;var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(217));var o=t.RECEIVE_PEGS="RECEIVE_PEGS",i=t.RECEIVE_SINGLE_PEG="RECEIVE_SINGLE_PEG",a=t.REMOVE_PEG="REMOVE_PEG",u=t.RECEIVE_PEG_ERRORS="RECEIVE_PEG_ERRORS",s=t.CLEAR_PEG_ERRORS="CLEAR_PEG_ERRORS",l=t.receivePegs=function(e){return{type:o,pegs:e}},c=t.receiveSinglePeg=function(e){return{type:i,peg:e}},f=t.removePeg=function(e){return{type:a,peg:e}},p=t.receivePegErrors=function(e){return{type:u,errors:e}};t.clearPegErrors=function(){return{type:s}},t.requestAllPegs=function(){return function(e){return r.fetchAllPegs().then(function(t){return e(l(t))})}},t.requestOnePeg=function(e){return function(t){return r.fetchSinglePeg(e).then(function(e){return t(c(e))})}},t.createPeg=function(e){return function(t){return r.createPeg(e).then(function(e){return t(c(e))},function(e){return t(p(e.responseJSON))})}},t.updatePeg=function(e){return function(t){return r.updatePeg(e).then(function(e){return t(c(e))},function(e){return t(p(e.responseJSON))})}},t.deletePeg=function(e){return function(t){return r.deletePeg(e).then(function(e){return t(f(e))})}}},function(e,t,n){var r=n(97),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();e.exports=i},function(e,t){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},function(e,t,n){"use strict";t.__esModule=!0;t.addLeadingSlash=function(e){return"/"===e.charAt(0)?e:"/"+e},t.stripLeadingSlash=function(e){return"/"===e.charAt(0)?e.substr(1):e};var r=t.hasBasename=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)};t.stripBasename=function(e,t){return r(e,t)?e.substr(t.length):e},t.stripTrailingSlash=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},t.parsePath=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var i=t.indexOf("?");return-1!==i&&(n=t.substr(i),t=t.substr(0,i)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},t.createPath=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}},function(e,t){var n=Array.isArray;e.exports=n},function(e,t){e.exports=function(e){return null!=e&&"object"==typeof e}},function(e,t,n){var r=n(46),o=n(53);e.exports=function(e,t,n,i){var a=!n;n||(n={});for(var u=-1,s=t.length;++u<s;){var l=t[u],c=i?i(n[l],e[l],l,n,e):void 0;void 0===c&&(c=e[l]),a?o(n,l,c):r(n,l,c)}return n}},function(e,t,n){var r=n(255),o=n(250);e.exports=function(e,t){var n=o(e,t);return r(n)?n:void 0}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clearErrors=t.signup=t.logout=t.login=t.receiveErrors=t.logoutCurrentUser=t.receiveCurrentUser=t.CLEARERRORS=t.RECEIVE_SESSION_ERRORS=t.LOGOUT_CURRENT_USER=t.RECEIVE_CURRENT_USER=void 0;var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(269));var o=t.RECEIVE_CURRENT_USER="RECEIVE_CURRENT_USER",i=t.LOGOUT_CURRENT_USER="LOGOUT_CURRENT_USER",a=t.RECEIVE_SESSION_ERRORS="RECEIVE_SESSION_ERRORS",u=t.CLEARERRORS="CLEARERRORS",s=t.receiveCurrentUser=function(e){return{type:o,currentUser:e}},l=t.logoutCurrentUser=function(){return{type:i}},c=t.receiveErrors=function(e){return{type:a,errors:e}};t.login=function(e){return function(t){return r.login(e).then(function(e){return t(s(e))},function(e){return t(c(e.responseJSON))})}},t.logout=function(){return function(e){return r.logout().then(function(t){return e(l())})}},t.signup=function(e){return function(t){return r.signup(e).then(function(e){return t(s(e))},function(e){return t(c(e.responseJSON))})}},t.clearErrors=function(){return{type:u}}},function(e,t,n){"use strict";n.r(t),n.d(t,"createStore",function(){return s}),n.d(t,"combineReducers",function(){return c}),n.d(t,"bindActionCreators",function(){return p}),n.d(t,"applyMiddleware",function(){return h}),n.d(t,"compose",function(){return d}),n.d(t,"__DO_NOT_USE__ActionTypes",function(){return o});var r=n(61),o={INIT:"@@redux/INIT"+Math.random().toString(36).substring(7).split("").join("."),REPLACE:"@@redux/REPLACE"+Math.random().toString(36).substring(7).split("").join(".")},i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};function u(e){if("object"!==(void 0===e?"undefined":i(e))||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}function s(e,t,n){var a;if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(s)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var l=e,c=t,f=[],p=f,d=!1;function h(){p===f&&(p=f.slice())}function v(){if(d)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return c}function m(e){if("function"!=typeof e)throw new Error("Expected the listener to be a function.");if(d)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");var t=!0;return h(),p.push(e),function(){if(t){if(d)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api-reference/store#subscribe(listener) for more details.");t=!1,h();var n=p.indexOf(e);p.splice(n,1)}}}function y(e){if(!u(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(d)throw new Error("Reducers may not dispatch actions.");try{d=!0,c=l(c,e)}finally{d=!1}for(var t=f=p,n=0;n<t.length;n++){(0,t[n])()}return e}return y({type:o.INIT}),(a={dispatch:y,subscribe:m,getState:v,replaceReducer:function(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");l=e,y({type:o.REPLACE})}})[r.a]=function(){var e,t=m;return(e={subscribe:function(e){if("object"!==(void 0===e?"undefined":i(e))||null===e)throw new TypeError("Expected the observer to be an object.");function n(){e.next&&e.next(v())}return n(),{unsubscribe:t(n)}}})[r.a]=function(){return this},e},a}function l(e,t){var n=t&&t.type;return"Given "+(n&&'action "'+String(n)+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function c(e){for(var t=Object.keys(e),n={},r=0;r<t.length;r++){var i=t[r];0,"function"==typeof e[i]&&(n[i]=e[i])}var a=Object.keys(n);var u=void 0;try{!function(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:o.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:"@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".")}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+o.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}(n)}catch(e){u=e}return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];if(u)throw u;for(var r=!1,o={},i=0;i<a.length;i++){var s=a[i],c=n[s],f=e[s],p=c(f,t);if(void 0===p){var d=l(s,t);throw new Error(d)}o[s]=p,r=r||p!==f}return r?o:e}}function f(e,t){return function(){return t(e.apply(this,arguments))}}function p(e,t){if("function"==typeof e)return f(e,t);if("object"!==(void 0===e?"undefined":i(e))||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":void 0===e?"undefined":i(e))+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),r={},o=0;o<n.length;o++){var a=n[o],u=e[a];"function"==typeof u&&(r[a]=f(u,t))}return r}function d(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}function h(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(){for(var n=arguments.length,r=Array(n),o=0;o<n;o++)r[o]=arguments[o];var i=e.apply(void 0,r),u=function(){throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")},s={getState:i.getState,dispatch:function(){return u.apply(void 0,arguments)}},l=t.map(function(e){return e(s)});return u=d.apply(void 0,l)(i.dispatch),a({},i,{dispatch:u})}}}},function(e,t,n){var r=n(20),o=n(254),i=n(253),a="[object Null]",u="[object Undefined]",s=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?u:a:s&&s in Object(e)?o(e):i(e)}},function(e,t,n){var r=n(54),o=n(87);e.exports=function(e){return null!=e&&o(e.length)&&!r(e)}},function(e,t,n){var r=n(9).Symbol;e.exports=r},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){var r=n(18),o=n(13),i="[object Symbol]";e.exports=function(e){return"symbol"==typeof e||o(e)&&r(e)==i}},function(e,t,n){var r=n(83),o=n(191),i=n(19);e.exports=function(e){return i(e)?r(e):o(e)}},function(e,t,n){var r="undefined"!=typeof window,o=r?window.Masonry||n(198):null,i=r?n(193):null,a=n(192),u=n(189),s=n(178),l=n(175),c=n(0),f=n(1),p=n(137),d={enableResizableChildren:c.bool,disableImagesLoaded:c.bool,onImagesLoaded:c.func,updateOnEachImageLoad:c.bool,options:c.object,imagesLoadedOptions:c.object,elementType:c.string,onLayoutComplete:c.func,onRemoveComplete:c.func},h=p({masonry:!1,erd:void 0,latestKnownDomChildren:[],displayName:"MasonryComponent",imagesLoadedCancelRef:void 0,propTypes:d,getDefaultProps:function(){return{enableResizableChildren:!1,disableImagesLoaded:!1,updateOnEachImageLoad:!1,options:{},imagesLoadedOptions:{},className:"",elementType:"div",onLayoutComplete:function(){},onRemoveComplete:function(){}}},initializeMasonry:function(e){this.masonry&&!e||(this.masonry=new o(this.masonryContainer,this.props.options),this.props.onLayoutComplete&&this.masonry.on("layoutComplete",this.props.onLayoutComplete),this.props.onRemoveComplete&&this.masonry.on("removeComplete",this.props.onRemoveComplete),this.latestKnownDomChildren=this.getCurrentDomChildren())},getCurrentDomChildren:function(){var e=this.masonryContainer,t=this.props.options.itemSelector?e.querySelectorAll(this.props.options.itemSelector):e.children;return Array.prototype.slice.call(t)},diffDomChildren:function(){var e=!1,t=this.latestKnownDomChildren.filter(function(e){return!!e.parentNode});t.length!==this.latestKnownDomChildren.length&&(e=!0);var n=this.getCurrentDomChildren(),r=t.filter(function(e){return!~n.indexOf(e)}),o=n.filter(function(e){return!~t.indexOf(e)}),i=0,a=o.filter(function(e){var t=i===n.indexOf(e);return t&&i++,t}),u=o.filter(function(e){return-1===a.indexOf(e)}),s=[];return 0===r.length&&(s=t.filter(function(e,t){return t!==n.indexOf(e)})),this.latestKnownDomChildren=n,{old:t,new:n,removed:r,appended:u,prepended:a,moved:s,forceItemReload:e}},performLayout:function(){var e=this.diffDomChildren(),t=e.forceItemReload||e.moved.length>0;e.removed.length>0&&(this.props.enableResizableChildren&&e.removed.forEach(this.erd.removeAllListeners,this.erd),this.masonry.remove(e.removed),t=!0),e.appended.length>0&&(this.masonry.appended(e.appended),0===e.prepended.length&&(t=!0),this.props.enableResizableChildren&&e.appended.forEach(this.listenToElementResize,this)),e.prepended.length>0&&(this.masonry.prepended(e.prepended),this.props.enableResizableChildren&&e.prepended.forEach(this.listenToElementResize,this)),t&&this.masonry.reloadItems(),this.masonry.layout()},derefImagesLoaded:function(){this.imagesLoadedCancelRef(),this.imagesLoadedCancelRef=void 0},imagesLoaded:function(){if(!this.props.disableImagesLoaded){this.imagesLoadedCancelRef&&this.derefImagesLoaded();var e=this.props.updateOnEachImageLoad?"progress":"always",t=s(function(e){this.props.onImagesLoaded&&this.props.onImagesLoaded(e),this.masonry.layout()}.bind(this),100),n=i(this.masonryContainer,this.props.imagesLoadedOptions).on(e,t);this.imagesLoadedCancelRef=function(){n.off(e,t),t.cancel()}}},initializeResizableChildren:function(){this.props.enableResizableChildren&&(this.erd=u({strategy:"scroll"}),this.latestKnownDomChildren.forEach(this.listenToElementResize,this))},listenToElementResize:function(e){this.erd.listenTo(e,function(){this.masonry.layout()}.bind(this))},destroyErd:function(){this.erd&&this.latestKnownDomChildren.forEach(this.erd.uninstall,this.erd)},componentDidMount:function(){this.initializeMasonry(),this.initializeResizableChildren(),this.imagesLoaded()},componentDidUpdate:function(){this.performLayout(),this.imagesLoaded()},componentWillUnmount:function(){this.destroyErd(),this.props.onLayoutComplete&&this.masonry.off("layoutComplete",this.props.onLayoutComplete),this.props.onRemoveComplete&&this.masonry.off("removeComplete",this.props.onRemoveComplete),this.imagesLoadedCancelRef&&this.derefImagesLoaded(),this.masonry.destroy()},setRef:function(e){this.masonryContainer=e},render:function(){var e=l(this.props,Object.keys(d));return f.createElement(this.props.elementType,a({},e,{ref:this.setRef}),this.props.children)}});e.exports=h,e.exports.default=h},function(e,t,n){var r=n(83),o=n(226),i=n(19);e.exports=function(e){return i(e)?r(e,!0):o(e)}},function(e,t){var n=Object.prototype;e.exports=function(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||n)}},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){var r=n(241);e.exports=function(e,t){var n=e.__data__;return r(t)?n["string"==typeof t?"string":"hash"]:n.map}},function(e,t,n){var r=n(15)(Object,"create");e.exports=r},function(e,t){e.exports=function(e,t){return e===t||e!=e&&t!=t}},function(e,t,n){var r=n(30);e.exports=function(e,t){for(var n=e.length;n--;)if(r(e[n][0],t))return n;return-1}},function(e,t,n){var r=n(265),o=n(264),i=n(263),a=n(262),u=n(261);function s(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}s.prototype.clear=r,s.prototype.delete=o,s.prototype.get=i,s.prototype.has=a,s.prototype.set=u,e.exports=s},function(e,t,n){"use strict";var r=function(e){};e.exports=function(e,t,n,o,i,a,u,s){if(r(t),!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,o,i,a,u,s],f=0;(l=new Error(t.replace(/%s/g,function(){return c[f++]}))).name="Invariant Violation"}throw l.framesToPop=1,l}}},function(e,t,n){e.exports=function(){"use strict";var e={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},t={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},n=Object.defineProperty,r=Object.getOwnPropertyNames,o=Object.getOwnPropertySymbols,i=Object.getOwnPropertyDescriptor,a=Object.getPrototypeOf,u=a&&a(Object);return function s(l,c,f){if("string"!=typeof c){if(u){var p=a(c);p&&p!==u&&s(l,p,f)}var d=r(c);o&&(d=d.concat(o(c)));for(var h=0;h<d.length;++h){var v=d[h];if(!(e[v]||t[v]||f&&f[v])){var m=i(c,v);try{n(l,v,m)}catch(e){}}}return l}return l}}()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n(1)),i=(n(4),u(n(24)),u(n(64))),a=u(n(127));u(n(43));function u(e){return e&&e.__esModule?e:{default:e}}var s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={component:"boardSpecialContainer"},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){this.forceUpdate()}},{key:"handleclick",value:function(e){var t=this;return function(n){"peg"===e?t.setState({component:"pegsSpecialContainer"}):t.setState({component:"boardSpecialContainer"})}}},{key:"render",value:function(){var e={pegsSpecialContainer:o.default.createElement(i.default,null),boardSpecialContainer:o.default.createElement(a.default,null)},t=this.state.component;return o.default.createElement("div",null,o.default.createElement("div",{class:"changes"},e[t]),o.default.createElement("ul",{className:"boards"},o.default.createElement("h3",{className:"profileheader"},this.props.user.firstname+" "+this.props.user.lastname),o.default.createElement("ul",{className:"profilelist"},o.default.createElement("li",null,o.default.createElement("button",{className:"boardbutton",onClick:this.handleclick("board")},"Boards")),o.default.createElement("li",null,o.default.createElement("button",{className:"pegbutton",onClick:this.handleclick("peg")},"Pegs")))))}}]),t}();t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(8),a=n(4),u=n(129),s=(r=u)&&r.__esModule?r:{default:r},l=n(5);t.default=(0,a.withRouter)((0,o.connect)(function(e,t){var n=e.entities.pegs[t.match.params.id];return{peg:n,currentUser:e.entities.users[e.session.id],peg_author:n.auther_username}},function(e){return{requestOnePeg:function(t){return e((0,i.requestOnePeg)(t))},openModal:function(t){return e((0,l.openModal)(t))}}})(s.default))},function(e,t,n){var r=n(12),o=n(152),i=n(151),a=n(148);e.exports=function(e,t){return r(e)?e:o(e,t)?[e]:i(a(e))}},function(e,t,n){var r=n(166),o=n(55),i=n(165),a=n(164),u=n(163),s=n(18),l=n(96),c=l(r),f=l(o),p=l(i),d=l(a),h=l(u),v=s;(r&&"[object DataView]"!=v(new r(new ArrayBuffer(1)))||o&&"[object Map]"!=v(new o)||i&&"[object Promise]"!=v(i.resolve())||a&&"[object Set]"!=v(new a)||u&&"[object WeakMap]"!=v(new u))&&(v=function(e){var t=s(e),n="[object Object]"==t?e.constructor:void 0,r=n?l(n):"";if(r)switch(r){case c:return"[object DataView]";case f:return"[object Map]";case p:return"[object Promise]";case d:return"[object Set]";case h:return"[object WeakMap]"}return t}),e.exports=v},function(e,t){e.exports=function(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}},function(e,t,n){var r=n(169),o=n(71),i=Object.prototype.propertyIsEnumerable,a=Object.getOwnPropertySymbols,u=a?function(e){return null==e?[]:(e=Object(e),r(a(e),function(t){return i.call(e,t)}))}:o;e.exports=u},function(e,t,n){var r,o;
/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */window,void 0===(o="function"==typeof(r=function(){"use strict";function e(e){var t=parseFloat(e),n=-1==e.indexOf("%")&&!isNaN(t);return n&&t}var t="undefined"==typeof console?function(){}:function(e){console.error(e)},n=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],r=n.length;function o(e){var n=getComputedStyle(e);return n||t("Style returned "+n+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),n}var i,a=!1;function u(t){if(function(){if(!a){a=!0;var t=document.createElement("div");t.style.width="200px",t.style.padding="1px 2px 3px 4px",t.style.borderStyle="solid",t.style.borderWidth="1px 2px 3px 4px",t.style.boxSizing="border-box";var n=document.body||document.documentElement;n.appendChild(t);var r=o(t);i=200==Math.round(e(r.width)),u.isBoxSizeOuter=i,n.removeChild(t)}}(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var s=o(t);if("none"==s.display)return function(){for(var e={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},t=0;t<r;t++){var o=n[t];e[o]=0}return e}();var l={};l.width=t.offsetWidth,l.height=t.offsetHeight;for(var c=l.isBorderBox="border-box"==s.boxSizing,f=0;f<r;f++){var p=n[f],d=s[p],h=parseFloat(d);l[p]=isNaN(h)?0:h}var v=l.paddingLeft+l.paddingRight,m=l.paddingTop+l.paddingBottom,y=l.marginLeft+l.marginRight,g=l.marginTop+l.marginBottom,b=l.borderLeftWidth+l.borderRightWidth,_=l.borderTopWidth+l.borderBottomWidth,w=c&&i,E=e(s.width);!1!==E&&(l.width=E+(w?0:v+b));var x=e(s.height);return!1!==x&&(l.height=x+(w?0:m+_)),l.innerWidth=l.width-(v+b),l.innerHeight=l.height-(m+_),l.outerWidth=l.width+y,l.outerHeight=l.height+g,l}}return u})?r.call(t,n,t,e):r)||(e.exports=o)},function(e,t,n){var r,o;"undefined"!=typeof window&&window,void 0===(o="function"==typeof(r=function(){"use strict";function e(){}var t=e.prototype;return t.on=function(e,t){if(e&&t){var n=this._events=this._events||{},r=n[e]=n[e]||[];return-1==r.indexOf(t)&&r.push(t),this}},t.once=function(e,t){if(e&&t){this.on(e,t);var n=this._onceEvents=this._onceEvents||{};return(n[e]=n[e]||{})[t]=!0,this}},t.off=function(e,t){var n=this._events&&this._events[e];if(n&&n.length){var r=n.indexOf(t);return-1!=r&&n.splice(r,1),this}},t.emitEvent=function(e,t){var n=this._events&&this._events[e];if(n&&n.length){n=n.slice(0),t=t||[];for(var r=this._onceEvents&&this._onceEvents[e],o=0;o<n.length;o++){var i=n[o];r&&r[i]&&(this.off(e,i),delete r[i]),i.apply(this,t)}return this}},t.allOff=function(){delete this._events,delete this._onceEvents},e})?r.call(t,n,t,e):r)||(e.exports=o)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(199),a=(r=i)&&r.__esModule?r:{default:r},u=n(8),s=n(5),l=(n(7),n(5));t.default=(0,o.connect)(function(e,t){return{pegs:Object.values(e.entities.pegs)||[],currentUser:e.entities.users[e.session.id]}},function(e){return{requestAllPegs:function(){return e((0,u.requestAllPegs)())},clearPegErrors:function(){return e((0,u.clearPegErrors)())},openModal:function(t){return e((0,s.openModal)(t))},closeModal:function(){return e((0,l.closeModal)())}}})(a.default)},function(e,t,n){"use strict";t.__esModule=!0;var r,o=n(2),i=(r=o)&&r.__esModule?r:{default:r};t.default=function(){var e=null,t=[];return{setPrompt:function(t){return(0,i.default)(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},confirmTransitionTo:function(t,n,r,o){if(null!=e){var a="function"==typeof e?e(t,n):e;"string"==typeof a?"function"==typeof r?r(a,o):((0,i.default)(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),o(!0)):o(!1!==a)}else o(!0)},appendListener:function(e){var n=!0,r=function(){n&&e.apply(void 0,arguments)};return t.push(r),function(){n=!1,t=t.filter(function(e){return e!==r})}},notifyListeners:function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];t.forEach(function(e){return e.apply(void 0,n)})}}}},function(e,t,n){"use strict";t.__esModule=!0,t.locationsAreEqual=t.createLocation=void 0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=u(n(60)),i=u(n(59)),a=n(11);function u(e){return e&&e.__esModule?e:{default:e}}t.createLocation=function(e,t,n,i){var u=void 0;"string"==typeof e?(u=(0,a.parsePath)(e)).state=t:(void 0===(u=r({},e)).pathname&&(u.pathname=""),u.search?"?"!==u.search.charAt(0)&&(u.search="?"+u.search):u.search="",u.hash?"#"!==u.hash.charAt(0)&&(u.hash="#"+u.hash):u.hash="",void 0!==t&&void 0===u.state&&(u.state=t));try{u.pathname=decodeURI(u.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+u.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(u.key=n),i?u.pathname?"/"!==u.pathname.charAt(0)&&(u.pathname=(0,o.default)(u.pathname,i.pathname)):u.pathname=i.pathname:u.pathname||(u.pathname="/"),u},t.locationsAreEqual=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&(0,i.default)(e.state,t.state)}},function(e,t,n){var r=n(53),o=n(30),i=Object.prototype.hasOwnProperty;e.exports=function(e,t,n){var a=e[t];i.call(e,t)&&o(a,n)&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){(function(e){var r=n(97),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o&&r.process,u=function(){try{var e=i&&i.require&&i.require("util").types;return e||a&&a.binding&&a.binding("util")}catch(e){}}();e.exports=u}).call(this,n(27)(e))},function(e,t){e.exports=function(e){return function(t){return e(t)}}},function(e,t,n){(function(e){var r=n(9),o=n(230),i="object"==typeof t&&t&&!t.nodeType&&t,a=i&&"object"==typeof e&&e&&!e.nodeType&&e,u=a&&a.exports===i?r.Buffer:void 0,s=(u?u.isBuffer:void 0)||o;e.exports=s}).call(this,n(27)(e))},function(e,t,n){var r=n(232),o=n(13),i=Object.prototype,a=i.hasOwnProperty,u=i.propertyIsEnumerable,s=r(function(){return arguments}())?r:function(e){return o(e)&&a.call(e,"callee")&&!u.call(e,"callee")};e.exports=s},function(e,t,n){var r=n(88)(Object.getPrototypeOf,Object);e.exports=r},function(e,t,n){var r=n(234);e.exports=function(e){var t=new e.constructor(e.byteLength);return new r(t).set(new r(e)),t}},function(e,t,n){var r=n(93);e.exports=function(e,t,n){"__proto__"==t&&r?r(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}},function(e,t,n){var r=n(18),o=n(10),i="[object AsyncFunction]",a="[object Function]",u="[object GeneratorFunction]",s="[object Proxy]";e.exports=function(e){if(!o(e))return!1;var t=r(e);return t==a||t==u||t==i||t==s}},function(e,t,n){var r=n(15)(n(9),"Map");e.exports=r},function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},function(e,t,n){"use strict";e.exports={}},function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,a,u=function(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),s=1;s<arguments.length;s++){for(var l in n=Object(arguments[s]))o.call(n,l)&&(u[l]=n[l]);if(r){a=r(n);for(var c=0;c<a.length;c++)i.call(n,a[c])&&(u[a[c]]=n[a[c]])}}return u}},function(e,t,n){"use strict";n.r(t);var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=function e(t,n){if(t===n)return!0;if(null==t||null==n)return!1;if(Array.isArray(t))return Array.isArray(n)&&t.length===n.length&&t.every(function(t,r){return e(t,n[r])});var o=void 0===t?"undefined":r(t);if(o!==(void 0===n?"undefined":r(n)))return!1;if("object"===o){var i=t.valueOf(),a=n.valueOf();if(i!==t||a!==n)return e(i,a);var u=Object.keys(t),s=Object.keys(n);return u.length===s.length&&u.every(function(r){return e(t[r],n[r])})}return!1}},function(e,t,n){"use strict";function r(e){return"/"===e.charAt(0)}function o(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}n.r(t),t.default=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],i=t&&t.split("/")||[],a=e&&r(e),u=t&&r(t),s=a||u;if(e&&r(e)?i=n:n.length&&(i.pop(),i=i.concat(n)),!i.length)return"/";var l=void 0;if(i.length){var c=i[i.length-1];l="."===c||".."===c||""===c}else l=!1;for(var f=0,p=i.length;p>=0;p--){var d=i[p];"."===d?o(i,p):".."===d?(o(i,p),f++):f&&(o(i,p),f--)}if(!s)for(;f--;f)i.unshift("..");!s||""===i[0]||i[0]&&r(i[0])||i.unshift("");var h=i.join("/");return l&&"/"!==h.substr(-1)&&(h+="/"),h}},function(e,t,n){"use strict";(function(e,r){var o,i=n(106);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var a=Object(i.a)(o);t.a=a}).call(this,n(21),n(275)(e))},function(e,t,n){"use strict";e.exports=function(e){return null!==e&&"object"==typeof e}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n(1)),i=u(n(24)),a=(u(n(35)),n(4));function u(e){return e&&e.__esModule?e:{default:e}}var s=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){this.props.requestAllPegs()}},{key:"render",value:function(){var e=this,t=void 0;if(""!==this.props.currentBoard.title){var n=o.default.createElement("img",{src:"https://res.cloudinary.com/archhere/image/upload/v1528847964/simple-grey-small-pencil-icon.jpg",className:"editbutton"});t="boardpeg34"}else n="",t="boardpeg3456";return this.props.currentBoard?o.default.createElement("div",null,o.default.createElement("div",{className:t},o.default.createElement("div",{className:"val12",onClick:function(){return e.props.openModal({modal:"EditBoard",board:e.props.currentBoard})}},n),o.default.createElement("h3",null,this.props.currentBoard.title)),o.default.createElement("div",{class:"create-peg-container"},o.default.createElement(i.default,{className:"pegs-index",elementType:"ul",options:{transitionDuration:1,gutter:20},disableImagesLoaded:!1,updateOnEachImageLoad:!1},o.default.createElement("div",{className:"outeraddpeg",onClick:function(){return e.props.openModal({modal:"CreatePeg"})}},o.default.createElement("i",{id:"addpeg",class:"fa fa-plus","aria-hidden":"true"})),this.props.pegs.map(function(t){return o.default.createElement("div",{className:"divpegshow",onClick:function(){return e.props.history.push("/peg/"+t.id)}},o.default.createElement("div",{className:"index-image"},o.default.createElement("div",{className:"divshowmodal"},o.default.createElement("div",{onClick:function(n){n.preventDefault(),n.stopPropagation(),e.props.openModal({modal:"SavePeg",peg:t})},className:"peg-save"},"Save")),o.default.createElement("div",{className:"masonry"},o.default.createElement("div",{class:"container"},o.default.createElement("img",{src:t.image_url})),o.default.createElement("span",null,t.title))))})))):o.default.createElement("div",null,"Loading")}}]),t}();t.default=(0,a.withRouter)(s)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(5),a=n(63),u=(r=a)&&r.__esModule?r:{default:r},s=n(8),l=(n(7),n(5)),c=n(4);t.default=(0,c.withRouter)((0,o.connect)(function(e,t){var n=e.entities.users[e.session.id],r=Object.values(e.entities.pegs).filter(function(e){return e.author_id===n.id}),o=void 0,i=void 0;return"/user/:id/boards/:id/pegs"===t.match.path?(o=r.filter(function(e){return e.board_id==t.match.params.id}),i=e.entities.boards[t.match.params.id]):(o=r,i={id:"",title:""}),{currentUser:e.entities.users[e.session.id],errors:e.errors.pegs,pegs:o,currentBoard:i}},function(e){return{updatePeg:function(t){return e((0,s.updatePeg)(t))},receivePegErrors:function(t){return e((0,s.receivePegErrors)(t))},deletePeg:function(t){return e((0,s.deletePeg)(t))},closeModal:function(){return e((0,i.closeModal)())},openModal:function(t){return e((0,l.openModal)(t))},requestAllPegs:function(){return e((0,s.requestAllPegs)())}}})(u.default))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ProtectedRoute=t.AuthRoute=void 0;var r,o=n(1),i=(r=o)&&r.__esModule?r:{default:r},a=n(6),u=n(4);var s=function(e){return{loggedIn:Boolean(e.session.id)}};t.AuthRoute=(0,u.withRouter)((0,a.connect)(s)(function(e){var t=e.component,n=e.path,r=e.loggedIn,o=e.exact;return i.default.createElement(u.Route,{path:n,exact:o,render:function(e){return r?i.default.createElement(u.Redirect,{to:"/"}):i.default.createElement(t,e)}})})),t.ProtectedRoute=(0,u.withRouter)((0,a.connect)(s)(function(e){var t=e.component,n=e.path,r=e.loggedIn,o=e.exact;return i.default.createElement(u.Route,{path:n,exact:o,render:function(e){return r?i.default.createElement(t,e):i.default.createElement(u.Redirect,{to:"/login"})}})}))},function(e,t,n){"use strict";n.r(t);var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=void 0,n=void 0,o=void 0,i=void 0,a=void 0,u=void 0,s=void 0,l=void 0,c=void 0,f=void 0,p=void 0,d=void 0,h=void 0,v=0===e.packed.indexOf("data-")?e.packed:"data-"+e.packed,m=e.sizes.slice().reverse(),y=!1!==e.position,g=e.container.nodeType?e.container:document.querySelector(e.container),b={all:function(){return O(g.children)},new:function(){return O(g.children).filter(function(e){return!e.hasAttribute(""+v)})}},_=[function(){o=C()},function(){i=-1===o?m[m.length-1]:m[o]},function(){var e;e=i.columns,u=Array.apply(null,Array(e)).map(function(){return 0})}],w=[function(){p=b[t?"new":"all"]()},function(){0!==p.length&&(d=p.map(function(e){return e.clientWidth}),h=p.map(function(e){return e.clientHeight}))},function(){p.forEach(function(e,t){a=u.indexOf(Math.min.apply(Math,u)),e.style.position="absolute",s=u[a]+"px",l=a*d[t]+a*i.gutter+"px",y?(e.style.top=s,e.style.left=l):e.style.transform="translate3d("+l+", "+s+", 0)",e.setAttribute(v,""),c=d[t],f=h[t],c&&f&&(u[a]+=f+i.gutter)})},function(){g.style.position="relative",g.style.width=i.columns*c+(i.columns-1)*i.gutter+"px",g.style.height=Math.max.apply(Math,u)-i.gutter+"px"}],E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.create(null);function n(e,n){return t[e]=t[e]||[],t[e].push(n),this}function o(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return n?t[e].splice(t[e].indexOf(n),1):delete t[e],this}return r({},e,{on:n,once:function(e,t){return t._once=!0,n(e,t),this},off:o,emit:function(e){for(var n=this,r=arguments.length,i=Array(r>1?r-1:0),a=1;a<r;a++)i[a-1]=arguments[a];var u=t[e]&&t[e].slice();return u&&u.forEach(function(t){t._once&&o(e,t),t.apply(n,i)}),this}})}({pack:P,update:function(){return t=!0,x(w),E.emit("update")},resize:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return window[e?"addEventListener":"removeEventListener"]("resize",S),E}});return E;function x(e){e.forEach(function(e){return e()})}function O(e){return arguments.length>1&&void 0!==arguments[1]?arguments[1]:document,Array.prototype.slice.call(e)}function C(){return m.map(function(e){return e.mq&&window.matchMedia("(min-width: "+e.mq+")").matches}).indexOf(!0)}function S(){n||(window.requestAnimationFrame(k),n=!0)}function k(){o!==C()&&(P(),E.emit("resize",i)),n=!1}function P(){return t=!1,x(_.concat(w)),E.emit("pack")}}},function(e,t,n){var r=n(22),o=1/0;e.exports=function(e){if("string"==typeof e||r(e))return e;var t=e+"";return"0"==t&&1/e==-o?"-0":t}},function(e,t,n){var r=n(69),o=n(70),i=n(25);e.exports=function(e){return r(e,i,o)}},function(e,t,n){var r=n(39),o=n(12);e.exports=function(e,t,n){var i=t(e);return o(e)?i:r(i,n(e))}},function(e,t,n){var r=n(39),o=n(51),i=n(40),a=n(71),u=Object.getOwnPropertySymbols?function(e){for(var t=[];e;)r(t,i(e)),e=o(e);return t}:a;e.exports=u},function(e,t){e.exports=function(){return[]}},function(e,t){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}},function(e,t,n){"use strict";var r=e.exports={};r.isIE=function(e){return(-1!==(t=navigator.userAgent.toLowerCase()).indexOf("msie")||-1!==t.indexOf("trident")||-1!==t.indexOf(" edge/"))&&(!e||e===function(){var e=3,t=document.createElement("div"),n=t.getElementsByTagName("i");do{t.innerHTML="\x3c!--[if gt IE "+ ++e+"]><i></i><![endif]--\x3e"}while(n[0]);return e>4?e:void 0}());var t},r.isLegacyOpera=function(){return!!window.opera}},function(e,t,n){"use strict";(e.exports={}).forEach=function(e,t){for(var n=0;n<e.length;n++){var r=t(e[n]);if(r)return r}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),a=(r=i)&&r.__esModule?r:{default:r},u=n(4),s=n(16);var l=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={email:"",password:""},n.handleSubmit=n.handleSubmit.bind(n),n.demoLogin=n.demoLogin.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"update",value:function(e){var t=this;return function(n){return t.setState((r={},o=e,i=n.target.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r));var r,o,i}}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=Object.assign({},this.state);this.props.processForm(n).then(function(){return t.props.history.push("/")})}},{key:"demoLogin",value:function(e){var t=this;e.preventDefault();var n="password";!function e(){setTimeout(function(){n.length>0?(t.setState({email:"frodo@shire.com",password:t.state.password.concat(n[0])}),n=n.slice(1),e()):dispatch((0,s.login)(t.state)).then(function(){return t.props.history.push("/")})},100)}()}},{key:"renderErrors",value:function(){return a.default.createElement("ul",null,this.props.errors.map(function(e,t){return a.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=this,t=void 0;return t="signup"===this.props.formType?"Create a password":"Password",a.default.createElement("div",{className:"outersessionpage"},a.default.createElement("div",{className:"login-form-container"},a.default.createElement("form",{onSubmit:this.handleSubmit,className:"login-form-box"},a.default.createElement("img",{src:window.logo,className:"logo"}),a.default.createElement("p",null," Welcome to Peginterest ",a.default.createElement("br",null),a.default.createElement("span",null,"Explore new ideas")),a.default.createElement("div",{className:"login-form"},a.default.createElement("input",{type:"text",value:this.state.email,onChange:this.update("email"),className:"login-input",placeholder:"Email"}),a.default.createElement("br",null),a.default.createElement("input",{type:"password",value:this.state.password,onChange:this.update("password"),className:"login-input",placeholder:t}),a.default.createElement("br",null),a.default.createElement("input",{className:"session-submit",type:"submit",value:"Continue"}),a.default.createElement("br",null)),a.default.createElement("input",{className:"demo-submit",onClick:function(t){return e.demoLogin(t)},type:"submit",value:"Demo"}),a.default.createElement("br",null),a.default.createElement("div",{className:"fromtype-button"},this.props.navLink)),a.default.createElement("div",{className:"errors"},this.renderErrors())))}}]),t}();t.default=(0,u.withRouter)(l)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(6),o=s(n(1)),i=n(4),a=n(16),u=s(n(75));function s(e){return e&&e.__esModule?e:{default:e}}t.default=(0,r.connect)(function(e){return{errors:e.errors.session,formType:"login",user:{email:"",password:""},navLink:o.default.createElement(i.Link,{to:"/signup",className:"somelink"},"Sign up")}},function(e){return{processForm:function(t){return e((0,a.login)(t))},clearErrors:function(){return e((0,a.clearErrors)())}}})(u.default)},function(e,t,n){"use strict";t.__esModule=!0;t.canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement),t.addEventListener=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},t.removeEventListener=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},t.getConfirmation=function(e,t){return t(window.confirm(e))},t.supportsHistory=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},t.supportsPopStateOnHashChange=function(){return-1===window.navigator.userAgent.indexOf("Trident")},t.supportsGoWithoutReloadUsingHash=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},t.isExtraneousPopstateEvent=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){var r=n(222),o=n(220)(r);e.exports=o},function(e,t,n){var r=n(223),o=Math.max;e.exports=function(e,t,n){return t=o(void 0===t?e.length-1:t,0),function(){for(var i=arguments,a=-1,u=o(i.length-t,0),s=Array(u);++a<u;)s[a]=i[t+a];a=-1;for(var l=Array(t+1);++a<t;)l[a]=i[a];return l[t]=n(s),r(e,this,l)}}},function(e,t){e.exports=function(e){return e}},function(e,t,n){var r=n(224),o=n(219);e.exports=function(e){return r(function(t,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,u=i>2?n[2]:void 0;for(a=e.length>3&&"function"==typeof a?(i--,a):void 0,u&&o(n[0],n[1],u)&&(a=i<3?void 0:a,i=1),t=Object(t);++r<i;){var s=n[r];s&&e(t,s,r,a)}return t})}},function(e,t){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;e.exports=function(e,t){var o=typeof e;return!!(t=null==t?n:t)&&("number"==o||"symbol"!=o&&r.test(e))&&e>-1&&e%1==0&&e<t}},function(e,t,n){var r=n(227),o=n(50),i=n(12),a=n(49),u=n(82),s=n(85),l=Object.prototype.hasOwnProperty;e.exports=function(e,t){var n=i(e),c=!n&&o(e),f=!n&&!c&&a(e),p=!n&&!c&&!f&&s(e),d=n||c||f||p,h=d?r(e.length,String):[],v=h.length;for(var m in e)!t&&!l.call(e,m)||d&&("length"==m||f&&("offset"==m||"parent"==m)||p&&("buffer"==m||"byteLength"==m||"byteOffset"==m)||u(m,v))||h.push(m);return h}},function(e,t){e.exports=function(e,t){return"__proto__"==t?void 0:e[t]}},function(e,t,n){var r=n(229),o=n(48),i=n(47),a=i&&i.isTypedArray,u=a?o(a):r;e.exports=u},function(e,t,n){var r=n(18),o=n(51),i=n(13),a="[object Object]",u=Function.prototype,s=Object.prototype,l=u.toString,c=s.hasOwnProperty,f=l.call(Object);e.exports=function(e){if(!i(e)||r(e)!=a)return!1;var t=o(e);if(null===t)return!0;var n=c.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&l.call(n)==f}},function(e,t){var n=9007199254740991;e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}},function(e,t){e.exports=function(e,t){return function(n){return e(t(n))}}},function(e,t,n){var r=n(233),o=n(51),i=n(26);e.exports=function(e){return"function"!=typeof e.constructor||i(e)?{}:r(o(e))}},function(e,t){e.exports=function(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}},function(e,t,n){var r=n(52);e.exports=function(e,t){var n=t?r(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}},function(e,t,n){(function(e){var r=n(9),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o?r.Buffer:void 0,u=a?a.allocUnsafe:void 0;e.exports=function(e,t){if(t)return e.slice();var n=e.length,r=u?u(n):new e.constructor(n);return e.copy(r),r}}).call(this,n(27)(e))},function(e,t,n){var r=n(15),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,n){var r=n(53),o=n(30);e.exports=function(e,t,n){(void 0===n||o(e[t],n))&&(void 0!==n||t in e)||r(e,t,n)}},function(e,t,n){var r=n(249),o=n(242),i=n(240),a=n(239),u=n(238);function s(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}s.prototype.clear=r,s.prototype.delete=o,s.prototype.get=i,s.prototype.has=a,s.prototype.set=u,e.exports=s},function(e,t){var n=Function.prototype.toString;e.exports=function(e){if(null!=e){try{return n.call(e)}catch(e){}try{return e+""}catch(e){}}return""}},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(this,n(21))},function(e,t,n){var r=n(32),o=n(260),i=n(259),a=n(258),u=n(257),s=n(256);function l(e){var t=this.__data__=new r(e);this.size=t.size}l.prototype.clear=o,l.prototype.delete=i,l.prototype.get=a,l.prototype.has=u,l.prototype.set=s,e.exports=l},function(e,t,n){var r=n(266),o=n(81)(function(e,t,n){r(e,t,n)});e.exports=o},function(e,t){e.exports=function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=13)}([function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){var n=e.exports={version:"2.5.0"};"number"==typeof __e&&(__e=n)},function(e,t,n){e.exports=!n(4)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},function(e,t,n){var r=n(32)("wks"),o=n(9),i=n(0).Symbol,a="function"==typeof i;(e.exports=function(e){return r[e]||(r[e]=a&&i[e]||(a?i:o)("Symbol."+e))}).store=r},function(e,t,n){var r=n(0),o=n(2),i=n(8),a=n(22),u=n(10),s=function(e,t,n){var l,c,f,p,d=e&s.F,h=e&s.G,v=e&s.S,m=e&s.P,y=e&s.B,g=h?r:v?r[t]||(r[t]={}):(r[t]||{}).prototype,b=h?o:o[t]||(o[t]={}),_=b.prototype||(b.prototype={});for(l in h&&(n=t),n)f=((c=!d&&g&&void 0!==g[l])?g:n)[l],p=y&&c?u(f,r):m&&"function"==typeof f?u(Function.call,f):f,g&&a(g,l,f,e&s.U),b[l]!=f&&i(b,l,p),m&&_[l]!=f&&(_[l]=f)};r.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,e.exports=s},function(e,t,n){var r=n(16),o=n(21);e.exports=n(3)?function(e,t,n){return r.f(e,t,o(1,n))}:function(e,t,n){return e[t]=n,e}},function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},function(e,t,n){var r=n(24);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t,n){var r=n(28),o=Math.min;e.exports=function(e){return e>0?o(r(e),9007199254740991):0}},function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(e&&t){var n=Array.isArray(t)?t:t.split(","),r=e.name||"",o=e.type||"",i=o.replace(/\/.*$/,"");return n.some(function(e){var t=e.trim();return"."===t.charAt(0)?r.toLowerCase().endsWith(t.toLowerCase()):/\/\*$/.test(t)?i===t.replace(/\/.*$/,""):o===t})}return!0},n(14),n(34)},function(e,t,n){n(15),e.exports=n(2).Array.some},function(e,t,n){"use strict";var r=n(7),o=n(25)(3);r(r.P+r.F*!n(33)([].some,!0),"Array",{some:function(e){return o(this,e,arguments[1])}})},function(e,t,n){var r=n(17),o=n(18),i=n(20),a=Object.defineProperty;t.f=n(3)?Object.defineProperty:function(e,t,n){if(r(e),t=i(t,!0),r(n),o)try{return a(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},function(e,t,n){var r=n(1);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},function(e,t,n){e.exports=!n(3)&&!n(4)(function(){return 7!=Object.defineProperty(n(19)("div"),"a",{get:function(){return 7}}).a})},function(e,t,n){var r=n(1),o=n(0).document,i=r(o)&&r(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},function(e,t,n){var r=n(1);e.exports=function(e,t){if(!r(e))return e;var n,o;if(t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;if("function"==typeof(n=e.valueOf)&&!r(o=n.call(e)))return o;if(!t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t,n){var r=n(0),o=n(8),i=n(23),a=n(9)("src"),u=Function.toString,s=(""+u).split("toString");n(2).inspectSource=function(e){return u.call(e)},(e.exports=function(e,t,n,u){var l="function"==typeof n;l&&(i(n,"name")||o(n,"name",t)),e[t]!==n&&(l&&(i(n,a)||o(n,a,e[t]?""+e[t]:s.join(String(t)))),e===r?e[t]=n:u?e[t]?e[t]=n:o(e,t,n):(delete e[t],o(e,t,n)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[a]||u.call(this)})},function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,n){var r=n(10),o=n(26),i=n(27),a=n(12),u=n(29);e.exports=function(e,t){var n=1==e,s=2==e,l=3==e,c=4==e,f=6==e,p=5==e||f,d=t||u;return function(t,u,h){for(var v,m,y=i(t),g=o(y),b=r(u,h,3),_=a(g.length),w=0,E=n?d(t,_):s?d(t,0):void 0;_>w;w++)if((p||w in g)&&(m=b(v=g[w],w,y),e))if(n)E[w]=m;else if(m)switch(e){case 3:return!0;case 5:return v;case 6:return w;case 2:E.push(v)}else if(c)return!1;return f?-1:l||c?c:E}}},function(e,t,n){var r=n(5);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},function(e,t,n){var r=n(11);e.exports=function(e){return Object(r(e))}},function(e,t){var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},function(e,t,n){var r=n(30);e.exports=function(e,t){return new(r(e))(t)}},function(e,t,n){var r=n(1),o=n(31),i=n(6)("species");e.exports=function(e){var t;return o(e)&&("function"!=typeof(t=e.constructor)||t!==Array&&!o(t.prototype)||(t=void 0),r(t)&&null===(t=t[i])&&(t=void 0)),void 0===t?Array:t}},function(e,t,n){var r=n(5);e.exports=Array.isArray||function(e){return"Array"==r(e)}},function(e,t,n){var r=n(0),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});e.exports=function(e){return o[e]||(o[e]={})}},function(e,t,n){"use strict";var r=n(4);e.exports=function(e,t){return!!e&&r(function(){t?e.call(null,function(){},1):e.call(null)})}},function(e,t,n){n(35),e.exports=n(2).String.endsWith},function(e,t,n){"use strict";var r=n(7),o=n(12),i=n(36),a="".endsWith;r(r.P+r.F*n(38)("endsWith"),"String",{endsWith:function(e){var t=i(this,e,"endsWith"),n=arguments.length>1?arguments[1]:void 0,r=o(t.length),u=void 0===n?r:Math.min(o(n),r),s=String(e);return a?a.call(t,s,u):t.slice(u-s.length,u)===s}})},function(e,t,n){var r=n(37),o=n(11);e.exports=function(e,t,n){if(r(t))throw TypeError("String#"+n+" doesn't accept regex!");return String(o(e))}},function(e,t,n){var r=n(1),o=n(5),i=n(6)("match");e.exports=function(e){var t;return r(e)&&(void 0!==(t=e[i])?!!t:"RegExp"==o(e))}},function(e,t,n){var r=n(6)("match");e.exports=function(e){var t=/./;try{"/./"[e](t)}catch(n){try{return t[r]=!1,!"/./"[e](t)}catch(e){}}return!0}}])},function(e,t,n){var r=n(203);e.exports=d,e.exports.parse=i,e.exports.compile=function(e,t){return u(i(e,t))},e.exports.tokensToFunction=u,e.exports.tokensToRegExp=p;var o=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function i(e,t){for(var n,r=[],i=0,a=0,u="",c=t&&t.delimiter||"/";null!=(n=o.exec(e));){var f=n[0],p=n[1],d=n.index;if(u+=e.slice(a,d),a=d+f.length,p)u+=p[1];else{var h=e[a],v=n[2],m=n[3],y=n[4],g=n[5],b=n[6],_=n[7];u&&(r.push(u),u="");var w=null!=v&&null!=h&&h!==v,E="+"===b||"*"===b,x="?"===b||"*"===b,O=n[2]||c,C=y||g;r.push({name:m||i++,prefix:v||"",delimiter:O,optional:x,repeat:E,partial:w,asterisk:!!_,pattern:C?l(C):_?".*":"[^"+s(O)+"]+?"})}}return a<e.length&&(u+=e.substr(a)),u&&r.push(u),r}function a(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,o){for(var i="",u=n||{},s=(o||{}).pretty?a:encodeURIComponent,l=0;l<e.length;l++){var c=e[l];if("string"!=typeof c){var f,p=u[c.name];if(null==p){if(c.optional){c.partial&&(i+=c.prefix);continue}throw new TypeError('Expected "'+c.name+'" to be defined')}if(r(p)){if(!c.repeat)throw new TypeError('Expected "'+c.name+'" to not repeat, but received `'+JSON.stringify(p)+"`");if(0===p.length){if(c.optional)continue;throw new TypeError('Expected "'+c.name+'" to not be empty')}for(var d=0;d<p.length;d++){if(f=s(p[d]),!t[l].test(f))throw new TypeError('Expected all "'+c.name+'" to match "'+c.pattern+'", but received `'+JSON.stringify(f)+"`");i+=(0===d?c.prefix:c.delimiter)+f}}else{if(f=c.asterisk?encodeURI(p).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):s(p),!t[l].test(f))throw new TypeError('Expected "'+c.name+'" to match "'+c.pattern+'", but received "'+f+'"');i+=c.prefix+f}}else i+=c}return i}}function s(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function l(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function c(e,t){return e.keys=t,e}function f(e){return e.sensitive?"":"i"}function p(e,t,n){r(t)||(n=t||n,t=[]);for(var o=(n=n||{}).strict,i=!1!==n.end,a="",u=0;u<e.length;u++){var l=e[u];if("string"==typeof l)a+=s(l);else{var p=s(l.prefix),d="(?:"+l.pattern+")";t.push(l),l.repeat&&(d+="(?:"+p+d+")*"),a+=d=l.optional?l.partial?p+"("+d+")?":"(?:"+p+"("+d+"))?":p+"("+d+")"}}var h=s(n.delimiter||"/"),v=a.slice(-h.length)===h;return o||(a=(v?a.slice(0,-h.length):a)+"(?:"+h+"(?=$))?"),a+=i?"$":o&&v?"":"(?="+h+"|$)",c(new RegExp("^"+a,f(n)),t)}function d(e,t,n){return r(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return c(e,t)}(e,t):r(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(d(e[o],t,n).source);return c(new RegExp("(?:"+r.join("|")+")",f(n)),t)}(e,t,n):function(e,t,n){return p(i(e,n),t,n)}(e,t,n)}},function(e,t,n){"use strict";t.__esModule=!0;var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=l(n(2)),a=n(11),u=n(45),s=l(n(44));function l(e){return e&&e.__esModule?e:{default:e}}var c=function(e,t,n){return Math.min(Math.max(e,t),n)};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.getUserConfirmation,n=e.initialEntries,l=void 0===n?["/"]:n,f=e.initialIndex,p=void 0===f?0:f,d=e.keyLength,h=void 0===d?6:d,v=(0,s.default)(),m=function(e){o(E,e),E.length=E.entries.length,v.notifyListeners(E.location,E.action)},y=function(){return Math.random().toString(36).substr(2,h)},g=c(p,0,l.length-1),b=l.map(function(e){return"string"==typeof e?(0,u.createLocation)(e,void 0,y()):(0,u.createLocation)(e,void 0,e.key||y())}),_=a.createPath,w=function(e){var n=c(E.index+e,0,E.entries.length-1),r=E.entries[n];v.confirmTransitionTo(r,"POP",t,function(e){e?m({action:"POP",location:r,index:n}):m()})},E={length:b.length,action:"POP",location:b[g],index:g,entries:b,createHref:_,push:function(e,n){(0,i.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var o=(0,u.createLocation)(e,n,y(),E.location);v.confirmTransitionTo(o,"PUSH",t,function(e){if(e){var t=E.index+1,n=E.entries.slice(0);n.length>t?n.splice(t,n.length-t,o):n.push(o),m({action:"PUSH",location:o,index:t,entries:n})}})},replace:function(e,n){(0,i.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var o=(0,u.createLocation)(e,n,y(),E.location);v.confirmTransitionTo(o,"REPLACE",t,function(e){e&&(E.entries[E.index]=o,m({action:"REPLACE",location:o}))})},go:w,goBack:function(){return w(-1)},goForward:function(){return w(1)},canGo:function(e){var t=E.index+e;return t>=0&&t<E.entries.length},block:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return v.setPrompt(e)},listen:function(e){return v.appendListener(e)}};return E}},function(e,t,n){"use strict";t.__esModule=!0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=c(n(2)),i=c(n(3)),a=n(45),u=n(11),s=c(n(44)),l=n(77);function c(e){return e&&e.__esModule?e:{default:e}}var f={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+(0,u.stripLeadingSlash)(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:u.stripLeadingSlash,decodePath:u.addLeadingSlash},slash:{encodePath:u.addLeadingSlash,decodePath:u.addLeadingSlash}},p=function(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)},d=function(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,i.default)(l.canUseDOM,"Hash history needs a DOM");var t=window.history,n=(0,l.supportsGoWithoutReloadUsingHash)(),c=e.getUserConfirmation,h=void 0===c?l.getConfirmation:c,v=e.hashType,m=void 0===v?"slash":v,y=e.basename?(0,u.stripTrailingSlash)((0,u.addLeadingSlash)(e.basename)):"",g=f[m],b=g.encodePath,_=g.decodePath,w=function(){var e=_(p());return(0,o.default)(!y||(0,u.hasBasename)(e,y),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+e+'" to begin with "'+y+'".'),y&&(e=(0,u.stripBasename)(e,y)),(0,a.createLocation)(e)},E=(0,s.default)(),x=function(e){r(L,e),L.length=t.length,E.notifyListeners(L.location,L.action)},O=!1,C=null,S=function(){var e=p(),t=b(e);if(e!==t)d(t);else{var n=w(),r=L.location;if(!O&&(0,a.locationsAreEqual)(r,n))return;if(C===(0,u.createPath)(n))return;C=null,k(n)}},k=function(e){O?(O=!1,x()):E.confirmTransitionTo(e,"POP",h,function(t){t?x({action:"POP",location:e}):P(e)})},P=function(e){var t=L.location,n=N.lastIndexOf((0,u.createPath)(t));-1===n&&(n=0);var r=N.lastIndexOf((0,u.createPath)(e));-1===r&&(r=0);var o=n-r;o&&(O=!0,M(o))},j=p(),T=b(j);j!==T&&d(T);var R=w(),N=[(0,u.createPath)(R)],M=function(e){(0,o.default)(n,"Hash history go(n) causes a full page reload in this browser"),t.go(e)},A=0,D=function(e){1===(A+=e)?(0,l.addEventListener)(window,"hashchange",S):0===A&&(0,l.removeEventListener)(window,"hashchange",S)},I=!1,L={length:t.length,action:"POP",location:R,createHref:function(e){return"#"+b(y+(0,u.createPath)(e))},push:function(e,t){(0,o.default)(void 0===t,"Hash history cannot push state; it is ignored");var n=(0,a.createLocation)(e,void 0,void 0,L.location);E.confirmTransitionTo(n,"PUSH",h,function(e){if(e){var t=(0,u.createPath)(n),r=b(y+t);if(p()!==r){C=t,function(e){window.location.hash=e}(r);var i=N.lastIndexOf((0,u.createPath)(L.location)),a=N.slice(0,-1===i?0:i+1);a.push(t),N=a,x({action:"PUSH",location:n})}else(0,o.default)(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),x()}})},replace:function(e,t){(0,o.default)(void 0===t,"Hash history cannot replace state; it is ignored");var n=(0,a.createLocation)(e,void 0,void 0,L.location);E.confirmTransitionTo(n,"REPLACE",h,function(e){if(e){var t=(0,u.createPath)(n),r=b(y+t);p()!==r&&(C=t,d(r));var o=N.indexOf((0,u.createPath)(L.location));-1!==o&&(N[o]=t),x({action:"REPLACE",location:n})}})},go:M,goBack:function(){return M(-1)},goForward:function(){return M(1)},block:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=E.setPrompt(e);return I||(D(1),I=!0),function(){return I&&(I=!1,D(-1)),t()}},listen:function(e){var t=E.appendListener(e);return D(1),function(){D(-1),t()}}};return L}},function(e,t,n){"use strict";t.__esModule=!0;var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=f(n(2)),a=f(n(3)),u=n(45),s=n(11),l=f(n(44)),c=n(77);function f(e){return e&&e.__esModule?e:{default:e}}var p=function(){try{return window.history.state||{}}catch(e){return{}}};t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,a.default)(c.canUseDOM,"Browser history needs a DOM");var t=window.history,n=(0,c.supportsHistory)(),f=!(0,c.supportsPopStateOnHashChange)(),d=e.forceRefresh,h=void 0!==d&&d,v=e.getUserConfirmation,m=void 0===v?c.getConfirmation:v,y=e.keyLength,g=void 0===y?6:y,b=e.basename?(0,s.stripTrailingSlash)((0,s.addLeadingSlash)(e.basename)):"",_=function(e){var t=e||{},n=t.key,r=t.state,o=window.location,a=o.pathname+o.search+o.hash;return(0,i.default)(!b||(0,s.hasBasename)(a,b),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+a+'" to begin with "'+b+'".'),b&&(a=(0,s.stripBasename)(a,b)),(0,u.createLocation)(a,r,n)},w=function(){return Math.random().toString(36).substr(2,g)},E=(0,l.default)(),x=function(e){o(I,e),I.length=t.length,E.notifyListeners(I.location,I.action)},O=function(e){(0,c.isExtraneousPopstateEvent)(e)||k(_(e.state))},C=function(){k(_(p()))},S=!1,k=function(e){S?(S=!1,x()):E.confirmTransitionTo(e,"POP",m,function(t){t?x({action:"POP",location:e}):P(e)})},P=function(e){var t=I.location,n=T.indexOf(t.key);-1===n&&(n=0);var r=T.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(S=!0,N(o))},j=_(p()),T=[j.key],R=function(e){return b+(0,s.createPath)(e)},N=function(e){t.go(e)},M=0,A=function(e){1===(M+=e)?((0,c.addEventListener)(window,"popstate",O),f&&(0,c.addEventListener)(window,"hashchange",C)):0===M&&((0,c.removeEventListener)(window,"popstate",O),f&&(0,c.removeEventListener)(window,"hashchange",C))},D=!1,I={length:t.length,action:"POP",location:j,createHref:R,push:function(e,o){(0,i.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==o),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var a=(0,u.createLocation)(e,o,w(),I.location);E.confirmTransitionTo(a,"PUSH",m,function(e){if(e){var r=R(a),o=a.key,u=a.state;if(n)if(t.pushState({key:o,state:u},null,r),h)window.location.href=r;else{var s=T.indexOf(I.location.key),l=T.slice(0,-1===s?0:s+1);l.push(a.key),T=l,x({action:"PUSH",location:a})}else(0,i.default)(void 0===u,"Browser history cannot push state in browsers that do not support HTML5 history"),window.location.href=r}})},replace:function(e,o){(0,i.default)(!("object"===(void 0===e?"undefined":r(e))&&void 0!==e.state&&void 0!==o),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var a=(0,u.createLocation)(e,o,w(),I.location);E.confirmTransitionTo(a,"REPLACE",m,function(e){if(e){var r=R(a),o=a.key,u=a.state;if(n)if(t.replaceState({key:o,state:u},null,r),h)window.location.replace(r);else{var s=T.indexOf(I.location.key);-1!==s&&(T[s]=a.key),x({action:"REPLACE",location:a})}else(0,i.default)(void 0===u,"Browser history cannot replace state in browsers that do not support HTML5 history"),window.location.replace(r)}})},go:N,goBack:function(){return N(-1)},goForward:function(){return N(1)},block:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=E.setPrompt(e);return D||(A(1),D=!0),function(){return D&&(D=!1,A(-1)),t()}},listen:function(e){var t=E.appendListener(e);return A(1),function(){A(-1),t()}}};return I}},function(e,t,n){"use strict";(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.a=n}).call(this,n(21))},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}n.d(t,"a",function(){return r})},function(e,t,n){"use strict";n.r(t);var r=n(1),o=n.n(r),i=n(0),a=n.n(i),u=n(100),s=n.n(u),l="undefined"==typeof document||!document||!document.createElement||"multiple"in document.createElement("input");function c(e){var t=[];if(e.dataTransfer){var n=e.dataTransfer;n.files&&n.files.length?t=n.files:n.items&&n.items.length&&(t=n.items)}else e.target&&e.target.files&&(t=e.target.files);return Array.prototype.slice.call(t)}function f(e,t){return"application/x-moz-file"===e.type||s()(e,t)}function p(e){e.preventDefault()}var d={borderStyle:"solid",borderColor:"#c66",backgroundColor:"#eee"},h={opacity:.5},v={borderStyle:"solid",borderColor:"#6c6",backgroundColor:"#eee"},m={width:200,height:200,borderWidth:2,borderColor:"#666",borderStyle:"dashed",borderRadius:5},y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},g=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();function b(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var _=function(e){function t(e,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return r.renderChildren=function(e,t,n,o){return"function"==typeof e?e(y({},r.state,{isDragActive:t,isDragAccept:n,isDragReject:o})):e},r.composeHandlers=r.composeHandlers.bind(r),r.onClick=r.onClick.bind(r),r.onDocumentDrop=r.onDocumentDrop.bind(r),r.onDragEnter=r.onDragEnter.bind(r),r.onDragLeave=r.onDragLeave.bind(r),r.onDragOver=r.onDragOver.bind(r),r.onDragStart=r.onDragStart.bind(r),r.onDrop=r.onDrop.bind(r),r.onFileDialogCancel=r.onFileDialogCancel.bind(r),r.onInputElementClick=r.onInputElementClick.bind(r),r.setRef=r.setRef.bind(r),r.setRefs=r.setRefs.bind(r),r.isFileDialogActive=!1,r.state={draggedFiles:[],acceptedFiles:[],rejectedFiles:[]},r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.a.Component),g(t,[{key:"componentDidMount",value:function(){var e=this.props.preventDropOnDocument;this.dragTargets=[],e&&(document.addEventListener("dragover",p,!1),document.addEventListener("drop",this.onDocumentDrop,!1)),this.fileInputEl.addEventListener("click",this.onInputElementClick,!1),window.addEventListener("focus",this.onFileDialogCancel,!1)}},{key:"componentWillUnmount",value:function(){this.props.preventDropOnDocument&&(document.removeEventListener("dragover",p),document.removeEventListener("drop",this.onDocumentDrop)),null!=this.fileInputEl&&this.fileInputEl.removeEventListener("click",this.onInputElementClick,!1),window.removeEventListener("focus",this.onFileDialogCancel,!1)}},{key:"composeHandlers",value:function(e){return this.props.disabled?null:e}},{key:"onDocumentDrop",value:function(e){this.node&&this.node.contains(e.target)||(e.preventDefault(),this.dragTargets=[])}},{key:"onDragStart",value:function(e){this.props.onDragStart&&this.props.onDragStart.call(this,e)}},{key:"onDragEnter",value:function(e){e.preventDefault(),-1===this.dragTargets.indexOf(e.target)&&this.dragTargets.push(e.target),this.setState({isDragActive:!0,draggedFiles:c(e)}),this.props.onDragEnter&&this.props.onDragEnter.call(this,e)}},{key:"onDragOver",value:function(e){e.preventDefault(),e.stopPropagation();try{e.dataTransfer.dropEffect=this.isFileDialogActive?"none":"copy"}catch(e){}return this.props.onDragOver&&this.props.onDragOver.call(this,e),!1}},{key:"onDragLeave",value:function(e){var t=this;e.preventDefault(),this.dragTargets=this.dragTargets.filter(function(n){return n!==e.target&&t.node.contains(n)}),this.dragTargets.length>0||(this.setState({isDragActive:!1,draggedFiles:[]}),this.props.onDragLeave&&this.props.onDragLeave.call(this,e))}},{key:"onDrop",value:function(e){var t=this,n=this.props,r=n.onDrop,o=n.onDropAccepted,i=n.onDropRejected,a=n.multiple,u=n.disablePreview,s=n.accept,l=c(e),p=[],d=[];e.preventDefault(),this.dragTargets=[],this.isFileDialogActive=!1,l.forEach(function(e){if(!u)try{e.preview=window.URL.createObjectURL(e)}catch(e){0}f(e,s)&&function(e,t,n){return e.size<=t&&e.size>=n}(e,t.props.maxSize,t.props.minSize)?p.push(e):d.push(e)}),a||d.push.apply(d,function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(p.splice(1))),r&&r.call(this,p,d,e),d.length>0&&i&&i.call(this,d,e),p.length>0&&o&&o.call(this,p,e),this.draggedFiles=null,this.setState({isDragActive:!1,draggedFiles:[],acceptedFiles:p,rejectedFiles:d})}},{key:"onClick",value:function(e){var t=this.props,n=t.onClick;t.disableClick||(e.stopPropagation(),n&&n.call(this,e),!function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.navigator.userAgent;return function(e){return-1!==e.indexOf("MSIE")||-1!==e.indexOf("Trident/")}(e)||function(e){return-1!==e.indexOf("Edge/")}(e)}()?this.open():setTimeout(this.open.bind(this),0))}},{key:"onInputElementClick",value:function(e){e.stopPropagation(),this.props.inputProps&&this.props.inputProps.onClick&&this.props.inputProps.onClick()}},{key:"onFileDialogCancel",value:function(){var e=this,t=this.props.onFileDialogCancel;this.isFileDialogActive&&setTimeout(function(){null!=e.fileInputEl&&(e.fileInputEl.files.length||(e.isFileDialogActive=!1));"function"==typeof t&&t()},300)}},{key:"setRef",value:function(e){this.node=e}},{key:"setRefs",value:function(e){this.fileInputEl=e}},{key:"open",value:function(){this.isFileDialogActive=!0,this.fileInputEl.value=null,this.fileInputEl.click()}},{key:"render",value:function(){var e=this.props,t=e.accept,n=e.acceptClassName,r=e.activeClassName,i=e.children,a=e.disabled,u=e.disabledClassName,s=e.inputProps,c=e.multiple,p=e.name,g=e.rejectClassName,_=b(e,["accept","acceptClassName","activeClassName","children","disabled","disabledClassName","inputProps","multiple","name","rejectClassName"]),w=_.acceptStyle,E=_.activeStyle,x=_.className,O=void 0===x?"":x,C=_.disabledStyle,S=_.rejectStyle,k=_.style,P=b(_,["acceptStyle","activeStyle","className","disabledStyle","rejectStyle","style"]),j=this.state,T=j.isDragActive,R=j.draggedFiles,N=R.length,M=c||N<=1,A=N>0&&function(e,t){return e.every(function(e){return f(e,t)})}(R,this.props.accept),D=N>0&&(!A||!M),I=!(O||k||E||w||S||C);T&&r&&(O+=" "+r),A&&n&&(O+=" "+n),D&&g&&(O+=" "+g),a&&u&&(O+=" "+u),I&&(E=v,w=(k=m).active,S=d,C=h);var L=y({},k);E&&T&&(L=y({},k,E)),w&&A&&(L=y({},L,w)),S&&D&&(L=y({},L,S)),C&&a&&(L=y({},k,C));var z={accept:t,disabled:a,type:"file",style:{display:"none"},multiple:l&&c,ref:this.setRefs,onChange:this.onDrop,autoComplete:"off"};p&&p.length&&(z.name=p);P.acceptedFiles,P.preventDropOnDocument,P.disablePreview,P.disableClick,P.onDropAccepted,P.onDropRejected,P.onFileDialogCancel,P.maxSize,P.minSize;var U=b(P,["acceptedFiles","preventDropOnDocument","disablePreview","disableClick","onDropAccepted","onDropRejected","onFileDialogCancel","maxSize","minSize"]);return o.a.createElement("div",y({className:O,style:L},U,{onClick:this.composeHandlers(this.onClick),onDragStart:this.composeHandlers(this.onDragStart),onDragEnter:this.composeHandlers(this.onDragEnter),onDragOver:this.composeHandlers(this.onDragOver),onDragLeave:this.composeHandlers(this.onDragLeave),onDrop:this.composeHandlers(this.onDrop),ref:this.setRef,"aria-disabled":a}),this.renderChildren(i,T,A,D),o.a.createElement("input",y({},s,z)))}}]),t}();t.default=_;_.propTypes={accept:a.a.oneOfType([a.a.string,a.a.arrayOf(a.a.string)]),children:a.a.oneOfType([a.a.node,a.a.func]),disableClick:a.a.bool,disabled:a.a.bool,disablePreview:a.a.bool,preventDropOnDocument:a.a.bool,inputProps:a.a.object,multiple:a.a.bool,name:a.a.string,maxSize:a.a.number,minSize:a.a.number,className:a.a.string,activeClassName:a.a.string,acceptClassName:a.a.string,rejectClassName:a.a.string,disabledClassName:a.a.string,style:a.a.object,activeStyle:a.a.object,acceptStyle:a.a.object,rejectStyle:a.a.object,disabledStyle:a.a.object,onClick:a.a.func,onDrop:a.a.func,onDropAccepted:a.a.func,onDropRejected:a.a.func,onDragStart:a.a.func,onDragEnter:a.a.func,onDragOver:a.a.func,onDragLeave:a.a.func,onFileDialogCancel:a.a.func},_.defaultProps={preventDropOnDocument:!0,disabled:!1,disablePreview:!1,disableClick:!1,multiple:!0,maxSize:1/0,minSize:0}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),a=(r=i)&&r.__esModule?r:{default:r};n(4);var u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={title:n.props.board.title,id:n.props.board.id,author_id:n.props.board.author_id},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"renderErrors",value:function(){return a.default.createElement("ul",null,this.props.errors.map(function(e,t){return a.default.createElement("li",{key:"error-"+t},e)}))}},{key:"update",value:function(e){this.setState({title:e.target.value})}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.updateBoard(this.state).then(this.props.closeModal())}},{key:"render",value:function(){var e=this;return a.default.createElement("div",null,a.default.createElement("form",{id:"EditBoardForm",onSubmit:this.handleSubmit.bind(this),className:"create-peg-form"},a.default.createElement("div",{className:"create-peg-header-outer"},a.default.createElement("h3",{className:"create-peg-header123"},"Edit Board")),a.default.createElement("br",null),a.default.createElement("p",null,this.renderErrors()),a.default.createElement("span",{class:"close-modal",onClick:function(){return e.props.closeModal()}},"X"),a.default.createElement("label",{className:"boardtitle1"},a.default.createElement("span",null,"Name"),a.default.createElement("input",{type:"text",required:!0,value:this.state.title,onChange:this.update.bind(this)})),a.default.createElement("br",null)," ",a.default.createElement("br",null),a.default.createElement("div",{className:"submitouterdiv"},a.default.createElement("input",{className:"submit-create-button12",type:"submit",value:"Update"})),a.default.createElement("button",{className:"submit-cancel-button1",onClick:function(){return e.props.closeModal()}},"Cancel")))}}]),t}();t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(5),a=n(108),u=(r=a)&&r.__esModule?r:{default:r},s=n(7),l=n(5),c=n(4);t.default=(0,c.withRouter)((0,o.connect)(function(e,t){return{currentUser:e.entities.users[e.session.id],errors:e.errors.boards,board:e.entities.boards[t.location.pathname[15]]}},function(e){return{receiveBoardErrors:function(t){return e((0,s.receiveBoardErrors)(t))},updateBoard:function(t){return e((0,s.updateBoard)(t))},deleteBoard:function(t){return e((0,s.deleteBoard)(t))},closeModal:function(){return e((0,i.closeModal)())},openModal:function(t){return e((0,l.openModal)(t))}}})(u.default))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),a=(r=i)&&r.__esModule?r:{default:r};n(4);var u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={title:""},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"renderErrors",value:function(){return a.default.createElement("ul",null,this.props.errors.map(function(e,t){return a.default.createElement("li",{key:"error-"+t},e)}))}},{key:"update",value:function(e){this.setState({title:e.target.value})}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.createBoard(this.state).then(this.props.closeModal())}},{key:"render",value:function(){var e=this;return a.default.createElement("div",null,a.default.createElement("form",{id:"CreateBoardForm",onSubmit:this.handleSubmit.bind(this),className:"create-peg-form"},a.default.createElement("div",{className:"create-peg-header-outer"},a.default.createElement("h3",{className:"create-peg-header123"},"Create Board")),a.default.createElement("br",null),a.default.createElement("p",null,this.renderErrors()),a.default.createElement("span",{class:"close-modal",onClick:function(){return e.props.closeModal()}},"X"),a.default.createElement("label",{className:"boardtitle1"},a.default.createElement("span",null,"Name"),a.default.createElement("input",{type:"text",required:!0,value:this.state.title,placeholder:"Like places to go or recipes to make",onChange:this.update.bind(this)})),a.default.createElement("br",null)," ",a.default.createElement("br",null),a.default.createElement("div",{className:"submitouterdiv"},a.default.createElement("input",{className:"submit-create-button12",type:"submit",value:"Create"})),a.default.createElement("button",{className:"submit-cancel-button1",onClick:function(){return e.props.closeModal()}},"Cancel")))}}]),t}();t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(5),a=n(110),u=(r=a)&&r.__esModule?r:{default:r},s=n(7),l=n(5);t.default=(0,o.connect)(function(e){return{currentUser:e.entities.users[e.session.id],errors:e.errors.boards}},function(e){return{receiveBoardErrors:function(t){return e((0,s.receiveBoardErrors)(t))},createBoard:function(t){return e((0,s.createBoard)(t))},closeModal:function(){return e((0,i.closeModal)())},openModal:function(t){return e((0,l.openModal)(t))}}})(u.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),a=(r=i)&&r.__esModule?r:{default:r},u=n(4);var s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={title:n.props.peg.title,url:n.props.peg.url,description:n.props.peg.description,image_url:n.props.peg.image_url,board_id:""},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"handleclick",value:function(e){var t=this;return function(n){t.setState({board_id:e})}}},{key:"componentDidUpdate",value:function(){var e=this,t=this.state;this.props.createPeg(t).then(function(){return e.props.closeModal()})}},{key:"render",value:function(){var e=this,t=Object.values(this.props.currentUser.boards||{});return console.log(t),a.default.createElement("div",{className:"saveform1236"},a.default.createElement("div",{className:"superheader"},a.default.createElement("span",{class:"close-modal",onClick:function(){return e.props.closeModal()}},"X"),a.default.createElement("h3",null,"Choose Board")),a.default.createElement("div",{className:"superimg55"},a.default.createElement("img",{src:this.props.peg.image_url})),a.default.createElement("ul",{className:"superboard"},t.map(function(t){return a.default.createElement("li",null,a.default.createElement("input",{type:"submit",value:t.title,onClick:e.handleclick(t.id)}))})),a.default.createElement("div",{className:"boardinfo1234",onClick:function(){return e.props.openModal({modal:"CreateBoard"})}},a.default.createElement("div",{className:"boards22"},"Create Board"),a.default.createElement("i",{id:"addboard11",class:"fa fa-plus","aria-hidden":"true"})))}}]),t}();t.default=(0,u.withRouter)(s)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(8),a=n(7),u=n(5),s=n(112),l=(r=s)&&r.__esModule?r:{default:r},c=n(5);t.default=(0,o.connect)(function(e){return{currentUser:e.entities.users[e.session.id]}},function(e){return{createPeg:function(t){return e((0,i.createPeg)(t))},createBoard:function(t){return e((0,a.createBoard)(t))},requestSingleBoard:function(t){return e((0,a.requestOneBoard)(t))},closeModal:function(){return e((0,u.closeModal)())},openModal:function(t){return e((0,c.openModal)(t))}}})(l.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),a=(r=i)&&r.__esModule?r:{default:r};var u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={id:n.props.peg.id,title:n.props.peg.title,url:n.props.peg.url,description:n.props.peg.description,image_url:n.props.peg.image_url,board_id:n.props.peg.board_id},n.handleclick=n.handleclick.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"renderErrors",value:function(){return a.default.createElement("ul",null,this.props.errors.map(function(e,t){return a.default.createElement("li",{key:"error-"+t},e)}))}},{key:"update",value:function(e){var t=this;return function(n){return t.setState((r={},o=e,i=n.target.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r));var r,o,i}}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.updatePeg(this.state).then(this.props.closeModal())}},{key:"handleclick",value:function(e){this.props.deletePeg(this.state.id).then(this.props.closeModal()).then(this.props.history.push("/user/"+this.props.currentUser.id))}},{key:"render",value:function(){var e=this;return a.default.createElement("div",{className:"edit-peg-form"},a.default.createElement("form",{onSubmit:this.handleSubmit},a.default.createElement("div",{className:"edit-peg-header-outer"},a.default.createElement("h3",{className:"edit-peg-header"},"Edit this Peg")),a.default.createElement("br",null),a.default.createElement("p",null,this.renderErrors()),a.default.createElement("span",{class:"close-modal",onClick:function(){return e.props.closeModal()}},"X"),a.default.createElement("div",{className:"editform12"},a.default.createElement("label",{className:"website78"},a.default.createElement("span",null,"Website")," ",a.default.createElement("br",null),a.default.createElement("input",{type:"text",required:!0,value:this.state.url,onChange:this.update("url")})),a.default.createElement("br",null)," ",a.default.createElement("br",null),a.default.createElement("label",{className:"titleform78"},a.default.createElement("span",null,"Title")," ",a.default.createElement("br",null),a.default.createElement("input",{type:"text",required:!0,value:this.state.title,onChange:this.update("title")})),a.default.createElement("br",null)," ",a.default.createElement("br",null),a.default.createElement("div",{className:"thumbnailouter98"},a.default.createElement("div",{className:"thumbnail12"},a.default.createElement("img",{src:this.state.image_url,width:"150",height:"200","border-radius":"15"})))),a.default.createElement("div",{className:"submitouterdiv"},a.default.createElement("ul",{className:"submits123"},a.default.createElement("li",null,a.default.createElement("button",{className:"submit-cancel-button126",onClick:function(){return e.props.closeModal()}},"Cancel")),a.default.createElement("li",null,a.default.createElement("input",{className:"submit-edit-button12",type:"submit",value:"Save"})))),a.default.createElement("div",{className:"submitouterdiv"},a.default.createElement("button",{onClick:this.handleclick,className:"submit-create-button123"},"Delete"))))}}]),t}();t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(5),a=n(114),u=(r=a)&&r.__esModule?r:{default:r},s=n(8),l=(n(7),n(4));t.default=(0,l.withRouter)((0,o.connect)(function(e,t){return{currentUser:e.entities.users[e.session.id],errors:e.errors.pegs,peg:t.peg}},function(e){return{updatePeg:function(t){return e((0,s.updatePeg)(t))},receivePegErrors:function(t){return e((0,s.receivePegErrors)(t))},deletePeg:function(t){return e((0,s.deletePeg)(t))},closeModal:function(){return e((0,i.closeModal)())}}})(u.default))},function(e,t){function n(){this._defaults=[]}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(function(e){n.prototype[e]=function(){return this._defaults.push({fn:e,arguments:arguments}),this}}),n.prototype._setDefaults=function(e){this._defaults.forEach(function(t){e[t.fn].apply(e,t.arguments)})},e.exports=n},function(e,t,n){"use strict";t.type=function(e){return e.split(/ *; */).shift()},t.params=function(e){return e.split(/ *; */).reduce(function(e,t){var n=t.split(/ *= */),r=n.shift(),o=n.shift();return r&&o&&(e[r]=o),e},{})},t.parseLinks=function(e){return e.split(/ *, */).reduce(function(e,t){var n=t.split(/ *; */),r=n[0].slice(1,-1);return e[n[1].split(/ *= */)[1].slice(1,-1)]=r,e},{})},t.cleanHeader=function(e,t){return delete e["content-type"],delete e["content-length"],delete e["transfer-encoding"],delete e.host,t&&(delete e.authorization,delete e.cookie),e}},function(e,t,n){"use strict";var r=n(117);function o(e){if(e)return function(e){for(var t in o.prototype)e[t]=o.prototype[t];return e}(e)}e.exports=o,o.prototype.get=function(e){return this.header[e.toLowerCase()]},o.prototype._setHeaderProperties=function(e){var t=e["content-type"]||"";this.type=r.type(t);var n=r.params(t);for(var o in n)this[o]=n[o];this.links={};try{e.link&&(this.links=r.parseLinks(e.link))}catch(e){}},o.prototype._setStatusProperties=function(e){var t=e/100|0;this.status=this.statusCode=e,this.statusType=t,this.info=1==t,this.ok=2==t,this.redirect=3==t,this.clientError=4==t,this.serverError=5==t,this.error=(4==t||5==t)&&this.toError(),this.created=201==e,this.accepted=202==e,this.noContent=204==e,this.badRequest=400==e,this.unauthorized=401==e,this.notAcceptable=406==e,this.forbidden=403==e,this.notFound=404==e,this.unprocessableEntity=422==e}},function(e,t,n){"use strict";var r=n(62);function o(e){if(e)return function(e){for(var t in o.prototype)e[t]=o.prototype[t];return e}(e)}e.exports=o,o.prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},o.prototype.parse=function(e){return this._parser=e,this},o.prototype.responseType=function(e){return this._responseType=e,this},o.prototype.serialize=function(e){return this._serializer=e,this},o.prototype.timeout=function(e){if(!e||"object"!=typeof e)return this._timeout=e,this._responseTimeout=0,this;for(var t in e)switch(t){case"deadline":this._timeout=e.deadline;break;case"response":this._responseTimeout=e.response;break;default:console.warn("Unknown timeout option",t)}return this},o.prototype.retry=function(e,t){return 0!==arguments.length&&!0!==e||(e=1),e<=0&&(e=0),this._maxRetries=e,this._retries=0,this._retryCallback=t,this};var i=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];o.prototype._shouldRetry=function(e,t){if(!this._maxRetries||this._retries++>=this._maxRetries)return!1;if(this._retryCallback)try{var n=this._retryCallback(e,t);if(!0===n)return!0;if(!1===n)return!1}catch(e){console.error(e)}if(t&&t.status&&t.status>=500&&501!=t.status)return!0;if(e){if(e.code&&~i.indexOf(e.code))return!0;if(e.timeout&&"ECONNABORTED"==e.code)return!0;if(e.crossDomain)return!0}return!1},o.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},o.prototype.then=function(e,t){if(!this._fullfilledPromise){var n=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise(function(e,t){n.end(function(n,r){n?t(n):e(r)})})}return this._fullfilledPromise.then(e,t)},o.prototype.catch=function(e){return this.then(void 0,e)},o.prototype.use=function(e){return e(this),this},o.prototype.ok=function(e){if("function"!=typeof e)throw Error("Callback required");return this._okCallback=e,this},o.prototype._isResponseOK=function(e){return!!e&&(this._okCallback?this._okCallback(e):e.status>=200&&e.status<300)},o.prototype.get=function(e){return this._header[e.toLowerCase()]},o.prototype.getHeader=o.prototype.get,o.prototype.set=function(e,t){if(r(e)){for(var n in e)this.set(n,e[n]);return this}return this._header[e.toLowerCase()]=t,this.header[e]=t,this},o.prototype.unset=function(e){return delete this._header[e.toLowerCase()],delete this.header[e],this},o.prototype.field=function(e,t){if(null===e||void 0===e)throw new Error(".field(name, val) name can not be empty");if(this._data&&console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"),r(e)){for(var n in e)this.field(n,e[n]);return this}if(Array.isArray(t)){for(var o in t)this.field(e,t[o]);return this}if(null===t||void 0===t)throw new Error(".field(name, val) val can not be empty");return"boolean"==typeof t&&(t=""+t),this._getFormData().append(e,t),this},o.prototype.abort=function(){return this._aborted?this:(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort"),this)},o.prototype._auth=function(e,t,n,r){switch(n.type){case"basic":this.set("Authorization","Basic "+r(e+":"+t));break;case"auto":this.username=e,this.password=t;break;case"bearer":this.set("Authorization","Bearer "+e)}return this},o.prototype.withCredentials=function(e){return void 0==e&&(e=!0),this._withCredentials=e,this},o.prototype.redirects=function(e){return this._maxRedirects=e,this},o.prototype.maxResponseSize=function(e){if("number"!=typeof e)throw TypeError("Invalid argument");return this._maxResponseSize=e,this},o.prototype.toJSON=function(){return{method:this.method,url:this.url,data:this._data,headers:this._header}},o.prototype.send=function(e){var t=r(e),n=this._header["content-type"];if(this._formData&&console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"),t&&!this._data)Array.isArray(e)?this._data=[]:this._isHost(e)||(this._data={});else if(e&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(t&&r(this._data))for(var o in e)this._data[o]=e[o];else"string"==typeof e?(n||this.type("form"),n=this._header["content-type"],this._data="application/x-www-form-urlencoded"==n?this._data?this._data+"&"+e:e:(this._data||"")+e):this._data=e;return!t||this._isHost(e)?this:(n||this.type("json"),this)},o.prototype.sortQuery=function(e){return this._sort=void 0===e||e,this},o.prototype._finalizeQueryString=function(){var e=this._query.join("&");if(e&&(this.url+=(this.url.indexOf("?")>=0?"&":"?")+e),this._query.length=0,this._sort){var t=this.url.indexOf("?");if(t>=0){var n=this.url.substring(t+1).split("&");"function"==typeof this._sort?n.sort(this._sort):n.sort(),this.url=this.url.substring(0,t)+"?"+n.join("&")}}},o.prototype._appendQueryString=function(){console.trace("Unsupported")},o.prototype._timeoutError=function(e,t,n){if(!this._aborted){var r=new Error(e+t+"ms exceeded");r.timeout=t,r.code="ECONNABORTED",r.errno=n,this.timedout=!0,this.abort(),this.callback(r)}},o.prototype._setTimeouts=function(){var e=this;this._timeout&&!this._timer&&(this._timer=setTimeout(function(){e._timeoutError("Timeout of ",e._timeout,"ETIME")},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(function(){e._timeoutError("Response timeout of ",e._responseTimeout,"ETIMEDOUT")},this._responseTimeout))}},function(e,t,n){function r(e){if(e)return function(e){for(var t in r.prototype)e[t]=r.prototype[t];return e}(e)}e.exports=r,r.prototype.on=r.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this},r.prototype.once=function(e,t){function n(){this.off(e,n),t.apply(this,arguments)}return n.fn=t,this.on(e,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n,r=this._callbacks["$"+e];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+e],this;for(var o=0;o<r.length;o++)if((n=r[o])===t||n.fn===t){r.splice(o,1);break}return this},r.prototype.emit=function(e){this._callbacks=this._callbacks||{};var t=[].slice.call(arguments,1),n=this._callbacks["$"+e];if(n)for(var r=0,o=(n=n.slice(0)).length;r<o;++r)n[r].apply(this,t);return this},r.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]},r.prototype.hasListeners=function(e){return!!this.listeners(e).length}},function(e,t,n){var r;"undefined"!=typeof window?r=window:"undefined"!=typeof self?r=self:(console.warn("Using browser-only version of superagent in non-browser environment"),r=this);var o=n(120),i=n(119),a=n(62),u=n(118),s=n(116);function l(){}var c=t=e.exports=function(e,n){return"function"==typeof n?new t.Request("GET",e).end(n):1==arguments.length?new t.Request("GET",e):new t.Request(e,n)};t.Request=y,c.getXHR=function(){if(!(!r.XMLHttpRequest||r.location&&"file:"==r.location.protocol&&r.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}throw Error("Browser-only version of superagent could not find XHR")};var f="".trim?function(e){return e.trim()}:function(e){return e.replace(/(^\s*|\s*$)/g,"")};function p(e){if(!a(e))return e;var t=[];for(var n in e)d(t,n,e[n]);return t.join("&")}function d(e,t,n){if(null!=n)if(Array.isArray(n))n.forEach(function(n){d(e,t,n)});else if(a(n))for(var r in n)d(e,t+"["+r+"]",n[r]);else e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));else null===n&&e.push(encodeURIComponent(t))}function h(e){for(var t,n,r={},o=e.split("&"),i=0,a=o.length;i<a;++i)-1==(n=(t=o[i]).indexOf("="))?r[decodeURIComponent(t)]="":r[decodeURIComponent(t.slice(0,n))]=decodeURIComponent(t.slice(n+1));return r}function v(e){return/[\/+]json($|[^-\w])/.test(e)}function m(e){this.req=e,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||void 0===this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;var t=this.xhr.status;1223===t&&(t=204),this._setStatusProperties(t),this.header=this.headers=function(e){for(var t,n,r,o,i=e.split(/\r?\n/),a={},u=0,s=i.length;u<s;++u)-1!==(t=(n=i[u]).indexOf(":"))&&(r=n.slice(0,t).toLowerCase(),o=f(n.slice(t+1)),a[r]=o);return a}(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&e._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null}function y(e,t){var n=this;this._query=this._query||[],this.method=e,this.url=t,this.header={},this._header={},this.on("end",function(){var e,t=null,r=null;try{r=new m(n)}catch(e){return(t=new Error("Parser is unable to parse the response")).parse=!0,t.original=e,n.xhr?(t.rawResponse=void 0===n.xhr.responseType?n.xhr.responseText:n.xhr.response,t.status=n.xhr.status?n.xhr.status:null,t.statusCode=t.status):(t.rawResponse=null,t.status=null),n.callback(t)}n.emit("response",r);try{n._isResponseOK(r)||(e=new Error(r.statusText||"Unsuccessful HTTP response"))}catch(t){e=t}e?(e.original=t,e.response=r,e.status=r.status,n.callback(e,r)):n.callback(null,r)})}function g(e,t,n){var r=c("DELETE",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r}c.serializeObject=p,c.parseString=h,c.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},c.serialize={"application/x-www-form-urlencoded":p,"application/json":JSON.stringify},c.parse={"application/x-www-form-urlencoded":h,"application/json":JSON.parse},u(m.prototype),m.prototype._parseBody=function(e){var t=c.parse[this.type];return this.req._parser?this.req._parser(this,e):(!t&&v(this.type)&&(t=c.parse["application/json"]),t&&e&&(e.length||e instanceof Object)?t(e):null)},m.prototype.toError=function(){var e=this.req,t=e.method,n=e.url,r="cannot "+t+" "+n+" ("+this.status+")",o=new Error(r);return o.status=this.status,o.method=t,o.url=n,o},c.Response=m,o(y.prototype),i(y.prototype),y.prototype.type=function(e){return this.set("Content-Type",c.types[e]||e),this},y.prototype.accept=function(e){return this.set("Accept",c.types[e]||e),this},y.prototype.auth=function(e,t,n){1===arguments.length&&(t=""),"object"==typeof t&&null!==t&&(n=t,t=""),n||(n={type:"function"==typeof btoa?"basic":"auto"});return this._auth(e,t,n,function(e){if("function"==typeof btoa)return btoa(e);throw new Error("Cannot use basic auth, btoa is not a function")})},y.prototype.query=function(e){return"string"!=typeof e&&(e=p(e)),e&&this._query.push(e),this},y.prototype.attach=function(e,t,n){if(t){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(e,t,n||t.name)}return this},y.prototype._getFormData=function(){return this._formData||(this._formData=new r.FormData),this._formData},y.prototype.callback=function(e,t){if(this._shouldRetry(e,t))return this._retry();var n=this._callback;this.clearTimeout(),e&&(this._maxRetries&&(e.retries=this._retries-1),this.emit("error",e)),n(e,t)},y.prototype.crossDomainError=function(){var e=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");e.crossDomain=!0,e.status=this.status,e.method=this.method,e.url=this.url,this.callback(e)},y.prototype.buffer=y.prototype.ca=y.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},y.prototype.pipe=y.prototype.write=function(){throw Error("Streaming is not supported in browser version of superagent")},y.prototype._isHost=function(e){return e&&"object"==typeof e&&!Array.isArray(e)&&"[object Object]"!==Object.prototype.toString.call(e)},y.prototype.end=function(e){return this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=e||l,this._finalizeQueryString(),this._end()},y.prototype._end=function(){var e=this,t=this.xhr=c.getXHR(),n=this._formData||this._data;this._setTimeouts(),t.onreadystatechange=function(){var n=t.readyState;if(n>=2&&e._responseTimeoutTimer&&clearTimeout(e._responseTimeoutTimer),4==n){var r;try{r=t.status}catch(e){r=0}if(!r){if(e.timedout||e._aborted)return;return e.crossDomainError()}e.emit("end")}};var r=function(t,n){n.total>0&&(n.percent=n.loaded/n.total*100),n.direction=t,e.emit("progress",n)};if(this.hasListeners("progress"))try{t.onprogress=r.bind(null,"download"),t.upload&&(t.upload.onprogress=r.bind(null,"upload"))}catch(e){}try{this.username&&this.password?t.open(this.method,this.url,!0,this.username,this.password):t.open(this.method,this.url,!0)}catch(e){return this.callback(e)}if(this._withCredentials&&(t.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof n&&!this._isHost(n)){var o=this._header["content-type"],i=this._serializer||c.serialize[o?o.split(";")[0]:""];!i&&v(o)&&(i=c.serialize["application/json"]),i&&(n=i(n))}for(var a in this.header)null!=this.header[a]&&this.header.hasOwnProperty(a)&&t.setRequestHeader(a,this.header[a]);return this._responseType&&(t.responseType=this._responseType),this.emit("request",this),t.send(void 0!==n?n:null),this},c.agent=function(){return new s},["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(function(e){s.prototype[e.toLowerCase()]=function(t,n){var r=new c.Request(e,t);return this._setDefaults(r),n&&r.end(n),r}}),s.prototype.del=s.prototype.delete,c.get=function(e,t,n){var r=c("GET",e);return"function"==typeof t&&(n=t,t=null),t&&r.query(t),n&&r.end(n),r},c.head=function(e,t,n){var r=c("HEAD",e);return"function"==typeof t&&(n=t,t=null),t&&r.query(t),n&&r.end(n),r},c.options=function(e,t,n){var r=c("OPTIONS",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r},c.del=g,c.delete=g,c.patch=function(e,t,n){var r=c("PATCH",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r},c.post=function(e,t,n){var r=c("POST",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r},c.put=function(e,t,n){var r=c("PUT",e);return"function"==typeof t&&(n=t,t=null),t&&r.send(t),n&&r.end(n),r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n(1)),i=u(n(107)),a=u(n(121));function u(e){return e&&e.__esModule?e:{default:e}}var s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={title:"",url:"",description:"",image_url:"",board_id:""},n.handleSubmit=n.handleSubmit.bind(n),n.handleImageUpload=n.handleImageUpload.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"handleImageUpload",value:function(e){var t=this;a.default.post("https://api.cloudinary.com/v1_1/archhere/image/upload").field("upload_preset","zselilmq").field("file",e).end(function(e,n){e&&t.props.receivePegErrors(e),""!==n.body.secure_url&&t.setState({image_url:n.body.secure_url})})}},{key:"picturethumbnail",value:function(){return""===this.state.image_url?o.default.createElement("div",{className:"dropzone-text-container"},o.default.createElement("i",{class:"fa fa-camera","aria-hidden":"true"}),o.default.createElement("p",null,"Drop an image or click to select a file to upload.")):o.default.createElement("div",{className:"picturethumbnail"},o.default.createElement("p",null,"Image upload successful.Click done"),o.default.createElement("img",{width:"150",height:"150",className:"imgthumbnail",src:this.state.image_url}))}},{key:"renderErrors",value:function(){return o.default.createElement("ul",null,this.props.errors.map(function(e,t){return o.default.createElement("li",{key:"error-"+t},e)}))}},{key:"update",value:function(e){var t=this;return function(n){return t.setState((r={},o=e,i=n.currentTarget.value,o in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i,r));var r,o,i}}},{key:"handleSubmit",value:function(e){e.stopPropagation(),e.preventDefault(),this.props.openModal({modal:"SavePeg",peg:this.state})}},{key:"render",value:function(){var e=this,t=void 0;return t=""===this.state.image_url?"submit-create-button":"submit-create-buttonawesome",o.default.createElement("div",null,o.default.createElement("form",{id:"CreatePegForm",onSubmit:this.handleSubmit,className:"create-peg-form"},o.default.createElement("div",{className:"create-peg-header-outer"},o.default.createElement("h3",{className:"create-peg-header"},"Create Peg")),o.default.createElement("br",null),o.default.createElement("p",null,this.renderErrors()),o.default.createElement("span",{class:"close-modal",onClick:function(){return e.props.closeModal()}},"X"),o.default.createElement("label",{className:"website"},o.default.createElement("span",null,"Website")," ",o.default.createElement("br",null),o.default.createElement("input",{type:"text",required:!0,value:this.state.url,placeholder:"Add the URL this peg links to",onChange:this.update("url")})),o.default.createElement("br",null)," ",o.default.createElement("br",null),o.default.createElement("label",{className:"titleform"},o.default.createElement("span",null,"Title")," ",o.default.createElement("br",null),o.default.createElement("input",{type:"text",required:!0,value:this.state.title,placeholder:"Give a title",onChange:this.update("title")})),o.default.createElement("br",null)," ",o.default.createElement("br",null),o.default.createElement("label",{className:"formdescp"},o.default.createElement("span",null,"Description")," ",o.default.createElement("br",null),o.default.createElement("textarea",{placeholder:"Add a description(optional)",onChange:this.update("description")},this.state.description)),o.default.createElement("br",null),o.default.createElement(i.default,{multiple:!1,accept:"image/*",onDrop:this.handleImageUpload,className:"dropzone",minSize:1},this.picturethumbnail()),o.default.createElement("div",{className:"submitouterdiv"},o.default.createElement("input",{className:t,type:"submit",value:"Done"}))))}}]),t}();t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(5),a=n(122),u=(r=a)&&r.__esModule?r:{default:r},s=n(8),l=n(7),c=n(5);t.default=(0,o.connect)(function(e){return{currentUser:e.entities.users[e.session.id],errors:e.errors.pegs}},function(e){return{createPeg:function(t){return e((0,s.createPeg)(t))},receivePegErrors:function(t){return e((0,s.receivePegErrors)(t))},createBoard:function(t){return e((0,l.createBoard)(t))},closeModal:function(){return e((0,i.closeModal)())},openModal:function(t){return e((0,c.openModal)(t))}}})(u.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=p(n(1)),o=n(5),i=n(6),a=p(n(123)),u=p(n(115)),s=p(n(113)),l=p(n(36)),c=p(n(111)),f=p(n(109));function p(e){return e&&e.__esModule?e:{default:e}}t.default=(0,i.connect)(function(e){return{modal:e.ui.modal}},function(e){return{closeModal:function(){return e((0,o.closeModal)())}}})(function(e){if(!e.modal)return null;var t=void 0;switch(e.modal.modal){case"ShowPeg":t=r.default.createElement(l.default,null);break;case"CreatePeg":t=r.default.createElement(a.default,null);break;case"EditPeg":t=r.default.createElement(u.default,{peg:e.modal.peg});break;case"SavePeg":t=r.default.createElement(s.default,{peg:e.modal.peg});break;case"CreateBoard":t=r.default.createElement(c.default,null);break;case"EditBoard":t=r.default.createElement(f.default,{board:e.modal.board});break;default:return null}var n=void 0;return n="CreatePeg"===e.modal||"CreateBoard"===e.modal?{background:"linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5) )"}:{background:"linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) )"},r.default.createElement("div",{className:"modal-background",style:n},r.default.createElement("div",{className:"modal-child",onClick:function(e){return e.stopPropagation()}},t))})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(4),a=n(35),u=(r=a)&&r.__esModule?r:{default:r},s=n(5),l=n(7);t.default=(0,i.withRouter)((0,o.connect)(function(e,t){var n=e.entities.users[t.match.params.id];return{user:n,boards:Object.values(n.boards||{}),pegs:Object.values(n.pegs||{})}},function(e){return{requestAllBoards:function(){return e((0,l.requestAllBoards)())},openModal:function(t){return e((0,s.openModal)(t))}}})(u.default))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=a(n(1)),i=(a(n(24)),a(n(35)),n(4));a(n(63));function a(e){return e&&e.__esModule?e:{default:e}}var u=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){this.props.requestAllBoards()}},{key:"render",value:function(){var e=this;return o.default.createElement("div",{className:"boardindexpage"},o.default.createElement("ul",{className:"boardinfor1"},o.default.createElement("li",null,o.default.createElement("div",{className:"boardinfo123",onClick:function(){return e.props.openModal({modal:"CreateBoard"})}},o.default.createElement("i",{id:"addboard",class:"fa fa-plus","aria-hidden":"true"}))),this.props.boards.map(function(t){return o.default.createElement(i.Link,{style:{textDecoration:"none"},to:e.props.currentUser.id+"/boards/"+t.id+"/pegs"},o.default.createElement("div",{className:"boardinfo123"},o.default.createElement("li",{className:"boardinfo12"},t.title)))})))}}]),t}();t.default=(0,i.withRouter)(u)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(5),a=n(7),u=n(126),s=(r=u)&&r.__esModule?r:{default:r},l=n(5),c=n(4);t.default=(0,c.withRouter)((0,o.connect)(function(e,t){e.entities.users[e.session.id];return{currentUser:e.entities.users[e.session.id],errors:e.errors.boards,boards:Object.values(e.entities.boards)}},function(e){return{updateBoard:function(t){return e((0,a.updateBoard)(t))},receiveBoardErrors:function(t){return e((0,a.receiveBoardErrors)(t))},deleteBoard:function(t){return e((0,a.deleteBoard)(t))},closeModal:function(){return e((0,i.closeModal)())},openModal:function(t){return e((0,l.openModal)(t))},requestAllBoards:function(){return e((0,a.requestAllBoards)())}}})(s.default))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(6),o=s(n(1)),i=n(4),a=n(16),u=s(n(75));function s(e){return e&&e.__esModule?e:{default:e}}t.default=(0,r.connect)(function(e){return{errors:e.errors.session,formType:"signup",user:{email:"",password:""},navLink:o.default.createElement(i.Link,{to:"/login",className:"somelink"},"Log in")}},function(e){return{processForm:function(t){return e((0,a.signup)(t))},clearErrors:function(){return e((0,a.clearErrors)())}}})(u.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),a=(r=i)&&r.__esModule?r:{default:r},u=n(4);var s=function(e){function t(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"componentDidMount",value:function(){this.props.requestOnePeg(this.props.match.params.id),window.scroll(0,0)}},{key:"componentWillReceiveProps",value:function(e){this.props.match.params.id!=e.match.params.id&&this.props.requestOnePeg(e.match.params.id)}},{key:"render",value:function(){var e=this,t=this.props.peg_author;if(t=t[0].toUpperCase()+t.slice(1),this.props.peg){if(this.props.peg.author_id===this.props.currentUser.id)var n=a.default.createElement("img",{src:"https://res.cloudinary.com/archhere/image/upload/v1528847964/simple-grey-small-pencil-icon.jpg",className:"editbutton"});else n="";return a.default.createElement("div",{className:"divshow",onClick:function(){return e.props.history.goBack()}},a.default.createElement("div",{className:"box101"},a.default.createElement("div",{className:"saveedit101"},a.default.createElement("div",{className:"editbutton1011",onClick:function(){return e.props.openModal({modal:"EditPeg",peg:e.props.peg})}},n),a.default.createElement("div",{className:"savebutton1011",onClick:function(){return e.props.openModal({modal:"SavePeg",peg:e.props.peg})}},a.default.createElement("img",{src:window.savebutton,className:"savebutton"}))),a.default.createElement("div",{className:"title102"},this.props.peg.title),a.default.createElement("div",null,a.default.createElement("img",{src:this.props.peg.image_url,className:"image101"})),a.default.createElement("div",{className:"userimg123"},a.default.createElement("img",{src:this.props.peg.auther_image})),a.default.createElement("div",{className:"author102"},a.default.createElement("strong",null,t),"  saved peg to board")))}return null}}]),t}();t.default=(0,u.withRouter)(s)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(1),i=u(o),a=u(n(0));function u(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t,n;return n=t=function(t){function n(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n);var t=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,Object.getPrototypeOf(n).call(this,e));return t.handleScroll=t.handleScroll.bind(t),t}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(n,o.Component),r(n,[{key:"componentDidMount",value:function(){if(!this.props.infiniteScrollDisabled){var e=this.props.infiniteScrollContainer;"window"===e?window.addEventListener("scroll",this.handleScroll):document.getElementById(e).addEventListener("mousewheel",this.handleScroll)}}},{key:"componentWillUnmount",value:function(){if(!this.props.infiniteScrollDisabled){var e=this.props.infiniteScrollContainer;"window"===e?window.removeEventListener("scroll",this.handleScroll):document.getElementById(e).removeEventListener("mousewheel",this.handleScroll)}}},{key:"handleScroll",value:function(){var e=this.props,t=e.infiniteScroll,n=e.infiniteScrollLoading,r=e.infiniteScrollEnd;this.edgeDistance<this.props.infiniteScrollDistance&&!n&&!r&&t()}},{key:"render",value:function(){var t=this;return i.default.createElement("div",null,i.default.createElement("div",{ref:function(e){t.containerElement=e}},i.default.createElement(e,this.props)),this.props.infiniteScrollLoading&&this.props.infiniteScrollSpinner,this.props.infiniteScrollEnd&&this.props.infiniteScrollEndIndicator)}},{key:"edgeDistance",get:function(){return"bottom"===this.props.infiniteScrollEdge?this.containerElement.getBoundingClientRect().bottom-window.innerHeight:-1*this.containerElement.getBoundingClientRect().top}}]),n}(),t.propTypes={id:a.default.string.isRequired,infiniteScroll:a.default.func,infiniteScrollContainer:a.default.string,infiniteScrollLoading:a.default.bool,infiniteScrollEnd:a.default.bool,infiniteScrollEdge:a.default.oneOf(["top","bottom"]),infiniteScrollDistance:a.default.number,infiniteScrollDisabled:a.default.bool,infiniteScrollSpinner:a.default.element,infiniteScrollEndIndicator:a.default.element},t.defaultProps={infiniteScroll:function(){},infiniteScrollContainer:"window",infiniteScrollLoading:!1,infiniteScrollEnd:!1,infiniteScrollEdge:"bottom",infiniteScrollDistance:200,infiniteScrollDisabled:!1,infiniteScrollSpinner:i.default.createElement("div",null,"this is a loader"),infiniteScrollEndIndicator:i.default.createElement("div",null,"no more data")},n}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o,i,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),s=f(u),l=f(n(0)),c=f(n(66));function f(e){return e&&e.__esModule?e:{default:e}}var p=(0,f(n(130)).default)((i=o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,Object.getPrototypeOf(t).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.Component),a(t,[{key:"componentDidMount",value:function(){var e=(0,c.default)({container:"#"+this.props.id,packed:this.props.packed,sizes:this.props.sizes});e.resize(!0),this.props.children.length>0&&e.pack(),this.bricksInstance=e}},{key:"componentDidUpdate",value:function(e){if(0!==e.children.length||0!==this.props.children.length)return 0===e.children.length&&this.props.children.length>0?this.bricksInstance.pack():e.children.length!==this.props.children.length?this.bricksInstance.update():void 0}},{key:"componentWillUnmount",value:function(){this.bricksInstance.resize(!1)}},{key:"render",value:function(){var e=this.props,t=e.id,n=e.className,r=e.style,o=e.children;return s.default.createElement("div",{id:t,className:n,style:r},o)}}]),t}(),o.propTypes={id:l.default.string.isRequired,packed:l.default.string,sizes:l.default.array,style:l.default.object,className:l.default.string,children:l.default.arrayOf(l.default.element).isRequired},o.defaultProps={style:{},className:"",packed:"data-packed",sizes:[{columns:2,gutter:20},{mq:"768px",columns:3,gutter:20},{mq:"1024px",columns:6,gutter:20}]},r=i))||r;t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(131),i=(r=o)&&r.__esModule?r:{default:r};t.default=i.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=n(1),i=u(o),a=u(n(0));function u(e){return e&&e.__esModule?e:{default:e}}var s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.scrollListener=n.scrollListener.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),r(t,[{key:"componentDidMount",value:function(){this.pageLoaded=this.props.pageStart,this.attachScrollListener()}},{key:"componentDidUpdate",value:function(){this.attachScrollListener()}},{key:"componentWillUnmount",value:function(){this.detachScrollListener(),this.detachMousewheelListener()}},{key:"setDefaultLoader",value:function(e){this.defaultLoader=e}},{key:"detachMousewheelListener",value:function(){var e=window;!1===this.props.useWindow&&(e=this.scrollComponent.parentNode),e.removeEventListener("mousewheel",this.mousewheelListener,this.props.useCapture)}},{key:"detachScrollListener",value:function(){var e=window;!1===this.props.useWindow&&(e=this.scrollComponent.parentNode),e.removeEventListener("scroll",this.scrollListener,this.props.useCapture),e.removeEventListener("resize",this.scrollListener,this.props.useCapture)}},{key:"attachScrollListener",value:function(){if(this.props.hasMore){var e=window;!1===this.props.useWindow&&(e=this.scrollComponent.parentNode),e.addEventListener("mousewheel",this.mousewheelListener,this.props.useCapture),e.addEventListener("scroll",this.scrollListener,this.props.useCapture),e.addEventListener("resize",this.scrollListener,this.props.useCapture),this.props.initialLoad&&this.scrollListener()}}},{key:"mousewheelListener",value:function(e){1===e.deltaY&&e.preventDefault()}},{key:"scrollListener",value:function(){var e=this.scrollComponent,t=window,n=void 0;if(this.props.useWindow){var r=document.documentElement||document.body.parentNode||document.body,o=void 0!==t.pageYOffset?t.pageYOffset:r.scrollTop;n=this.props.isReverse?o:this.calculateTopPosition(e)+(e.offsetHeight-o-window.innerHeight)}else n=this.props.isReverse?e.parentNode.scrollTop:e.scrollHeight-e.parentNode.scrollTop-e.parentNode.clientHeight;n<Number(this.props.threshold)&&(this.detachScrollListener(),"function"==typeof this.props.loadMore&&this.props.loadMore(this.pageLoaded+=1))}},{key:"calculateTopPosition",value:function(e){return e?e.offsetTop+this.calculateTopPosition(e.offsetParent):0}},{key:"render",value:function(){var e=this,t=this.props,n=t.children,r=t.element,o=t.hasMore,a=(t.initialLoad,t.isReverse),u=t.loader,s=(t.loadMore,t.pageStart,t.ref),l=(t.threshold,t.useCapture,t.useWindow,function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["children","element","hasMore","initialLoad","isReverse","loader","loadMore","pageStart","ref","threshold","useCapture","useWindow"]));l.ref=function(t){e.scrollComponent=t,s&&s(t)};var c=[n];return o&&(u?a?c.unshift(u):c.push(u):this.defaultLoader&&(a?c.unshift(this.defaultLoader):c.push(this.defaultLoader))),i.default.createElement(r,l,c)}}]),t}();s.propTypes={children:a.default.node.isRequired,element:a.default.string,hasMore:a.default.bool,initialLoad:a.default.bool,isReverse:a.default.bool,loader:a.default.node,loadMore:a.default.func.isRequired,pageStart:a.default.number,ref:a.default.func,threshold:a.default.number,useCapture:a.default.bool,useWindow:a.default.bool},s.defaultProps={element:"div",hasMore:!1,initialLoad:!0,pageStart:0,ref:null,threshold:250,useWindow:!0,isReverse:!1,useCapture:!1,loader:null},t.default=s,e.exports=t.default},function(e,t,n){e.exports=n(133)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o,i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(1),u=f(a),s=f(n(0)),l=f(n(66)),c=f(n(134));function f(e){return e&&e.__esModule?e:{default:e}}function p(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var d=(o=r=function(e){function t(){var e,n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return n=r=p(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(i))),r.setContainerRef=function(e){r.masonryContainer=e},r.forcePack=function(){r.masonryContainer&&r.state.instance.pack()},r.forceUpdate=function(){r.masonryContainer&&r.state.instance.update()},r.createNewInstance=function(){var e=r.props,t=e.packed,n=e.sizes,o=e.children,i=e.position,a=(0,l.default)({container:r.masonryContainer,packed:t,sizes:n,position:i});a.resize(!0),o.length>0&&a.pack(),r.setState(function(){return{instance:a}})},p(r,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.Component),i(t,[{key:"componentDidMount",value:function(){this.createNewInstance()}},{key:"componentDidUpdate",value:function(e){var t=this.props.children,n=this.state.instance;if(0!==e.children.length||0!==t.length)return 0===e.children.length&&t.length>0?n.pack():e.children.length!==t.length?this.props.pack?n.pack():n.update():void 0}},{key:"componentWillUnmount",value:function(){this.state&&this.state.instance.resize(!1)}},{key:"render",value:function(){var e=this.props,t=e.children,n=e.className,r=e.style,o=(e.pack,e.packed,e.position,e.sizes,function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(e,["children","className","style","pack","packed","position","sizes"]));return u.default.createElement(c.default,o,u.default.createElement("div",{ref:this.setContainerRef,className:n,style:r},t))}}]),t}(),r.propTypes={children:s.default.arrayOf(s.default.element).isRequired,className:s.default.string,initialLoad:s.default.bool,pack:s.default.bool,packed:s.default.string,position:s.default.bool,sizes:s.default.array,style:s.default.object},r.defaultProps={className:"",initialLoad:!0,pack:!1,packed:"data-packed",position:!0,sizes:[{columns:1,gutter:20},{mq:"768px",columns:2,gutter:20},{mq:"1024px",columns:3,gutter:20}],style:{}},o);t.default=d},function(e,t,n){"use strict";var r=n(58),o=n(57),i=n(33),a="mixins";e.exports=function(e,t,n){var u=[],s={mixins:"DEFINE_MANY",statics:"DEFINE_MANY",propTypes:"DEFINE_MANY",contextTypes:"DEFINE_MANY",childContextTypes:"DEFINE_MANY",getDefaultProps:"DEFINE_MANY_MERGED",getInitialState:"DEFINE_MANY_MERGED",getChildContext:"DEFINE_MANY_MERGED",render:"DEFINE_ONCE",componentWillMount:"DEFINE_MANY",componentDidMount:"DEFINE_MANY",componentWillReceiveProps:"DEFINE_MANY",shouldComponentUpdate:"DEFINE_ONCE",componentWillUpdate:"DEFINE_MANY",componentDidUpdate:"DEFINE_MANY",componentWillUnmount:"DEFINE_MANY",UNSAFE_componentWillMount:"DEFINE_MANY",UNSAFE_componentWillReceiveProps:"DEFINE_MANY",UNSAFE_componentWillUpdate:"DEFINE_MANY",updateComponent:"OVERRIDE_BASE"},l={getDerivedStateFromProps:"DEFINE_MANY_MERGED"},c={displayName:function(e,t){e.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)p(e,t[n])},childContextTypes:function(e,t){e.childContextTypes=r({},e.childContextTypes,t)},contextTypes:function(e,t){e.contextTypes=r({},e.contextTypes,t)},getDefaultProps:function(e,t){e.getDefaultProps?e.getDefaultProps=h(e.getDefaultProps,t):e.getDefaultProps=t},propTypes:function(e,t){e.propTypes=r({},e.propTypes,t)},statics:function(e,t){!function(e,t){if(t)for(var n in t){var r=t[n];if(t.hasOwnProperty(n)){var o=n in c;i(!o,'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.',n);var a=n in e;if(a){var u=l.hasOwnProperty(n)?l[n]:null;return i("DEFINE_MANY_MERGED"===u,"ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",n),void(e[n]=h(e[n],r))}e[n]=r}}}(e,t)},autobind:function(){}};function f(e,t){var n=s.hasOwnProperty(t)?s[t]:null;b.hasOwnProperty(t)&&i("OVERRIDE_BASE"===n,"ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.",t),e&&i("DEFINE_MANY"===n||"DEFINE_MANY_MERGED"===n,"ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",t)}function p(e,n){if(n){i("function"!=typeof n,"ReactClass: You're attempting to use a component class or function as a mixin. Instead, just use a regular object."),i(!t(n),"ReactClass: You're attempting to use a component as a mixin. Instead, just use a regular object.");var r=e.prototype,o=r.__reactAutoBindPairs;for(var u in n.hasOwnProperty(a)&&c.mixins(e,n.mixins),n)if(n.hasOwnProperty(u)&&u!==a){var l=n[u],p=r.hasOwnProperty(u);if(f(p,u),c.hasOwnProperty(u))c[u](e,l);else{var d=s.hasOwnProperty(u);if("function"!=typeof l||d||p||!1===n.autobind)if(p){var m=s[u];i(d&&("DEFINE_MANY_MERGED"===m||"DEFINE_MANY"===m),"ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.",m,u),"DEFINE_MANY_MERGED"===m?r[u]=h(r[u],l):"DEFINE_MANY"===m&&(r[u]=v(r[u],l))}else r[u]=l;else o.push(u,l),r[u]=l}}}}function d(e,t){for(var n in i(e&&t&&"object"==typeof e&&"object"==typeof t,"mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects."),t)t.hasOwnProperty(n)&&(i(void 0===e[n],"mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.",n),e[n]=t[n]);return e}function h(e,t){return function(){var n=e.apply(this,arguments),r=t.apply(this,arguments);if(null==n)return r;if(null==r)return n;var o={};return d(o,n),d(o,r),o}}function v(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function m(e,t){return t.bind(e)}var y={componentDidMount:function(){this.__isMounted=!0}},g={componentWillUnmount:function(){this.__isMounted=!1}},b={replaceState:function(e,t){this.updater.enqueueReplaceState(this,e,t)},isMounted:function(){return!!this.__isMounted}},_=function(){};return r(_.prototype,e.prototype,b),function(e){var t=function(e,r,a){this.__reactAutoBindPairs.length&&function(e){for(var t=e.__reactAutoBindPairs,n=0;n<t.length;n+=2){var r=t[n],o=t[n+1];e[r]=m(e,o)}}(this),this.props=e,this.context=r,this.refs=o,this.updater=a||n,this.state=null;var u=this.getInitialState?this.getInitialState():null;i("object"==typeof u&&!Array.isArray(u),"%s.getInitialState(): must return an object or null",t.displayName||"ReactCompositeComponent"),this.state=u};for(var r in t.prototype=new _,t.prototype.constructor=t,t.prototype.__reactAutoBindPairs=[],u.forEach(p.bind(null,t)),p(t,y),p(t,e),p(t,g),t.getDefaultProps&&(t.defaultProps=t.getDefaultProps()),i(t.prototype.render,"createClass(...): Class specification must implement a `render` method."),s)t.prototype[r]||(t.prototype[r]=null);return t}}},function(e,t,n){"use strict";var r=n(1),o=n(136);if(void 0===r)throw Error("create-react-class could not find the React object. If you are using script tags, make sure that React is being loaded before create-react-class.");var i=(new r.Component).updater;e.exports=o(r.Component,r.isValidElement,i)},function(e,t,n){var r=n(20),o=n(50),i=n(12),a=r?r.isConcatSpreadable:void 0;e.exports=function(e){return i(e)||o(e)||!!(a&&e&&e[a])}},function(e,t,n){var r=n(39),o=n(138);e.exports=function e(t,n,i,a,u){var s=-1,l=t.length;for(i||(i=o),u||(u=[]);++s<l;){var c=t[s];n>0&&i(c)?n>1?e(c,n-1,i,a,u):r(u,c):a||(u[u.length]=c)}return u}},function(e,t,n){var r=n(139);e.exports=function(e){return null!=e&&e.length?r(e,1):[]}},function(e,t,n){var r=n(140),o=n(79),i=n(78);e.exports=function(e){return i(o(e,void 0,r),e+"")}},function(e,t,n){var r=n(86);e.exports=function(e){return r(e)?void 0:e}},function(e,t){e.exports=function(e,t,n){var r=-1,o=e.length;t<0&&(t=-t>o?0:o+t),(n=n>o?o:n)<0&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0;for(var i=Array(o);++r<o;)i[r]=e[r+t];return i}},function(e,t,n){var r=n(37),o=n(67);e.exports=function(e,t){for(var n=0,i=(t=r(t,e)).length;null!=e&&n<i;)e=e[o(t[n++])];return n&&n==i?e:void 0}},function(e,t,n){var r=n(144),o=n(143);e.exports=function(e,t){return t.length<2?e:r(e,o(t,0,-1))}},function(e,t){e.exports=function(e){var t=null==e?0:e.length;return t?e[t-1]:void 0}},function(e,t,n){var r=n(20),o=n(72),i=n(12),a=n(22),u=1/0,s=r?r.prototype:void 0,l=s?s.toString:void 0;e.exports=function e(t){if("string"==typeof t)return t;if(i(t))return o(t,e)+"";if(a(t))return l?l.call(t):"";var n=t+"";return"0"==n&&1/t==-u?"-0":n}},function(e,t,n){var r=n(147);e.exports=function(e){return null==e?"":r(e)}},function(e,t,n){var r=n(95),o="Expected a function";function i(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError(o);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=e.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(i.Cache||r),n}i.Cache=r,e.exports=i},function(e,t,n){var r=n(149),o=500;e.exports=function(e){var t=r(e,function(e){return n.size===o&&n.clear(),e}),n=t.cache;return t}},function(e,t,n){var r=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,o=/\\(\\)?/g,i=n(150)(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(r,function(e,n,r,i){t.push(r?i.replace(o,"$1"):n||e)}),t});e.exports=i},function(e,t,n){var r=n(12),o=n(22),i=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/;e.exports=function(e,t){if(r(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!o(e))||a.test(e)||!i.test(e)||null!=t&&e in Object(t)}},function(e,t,n){var r=n(37),o=n(146),i=n(145),a=n(67);e.exports=function(e,t){return t=r(t,e),null==(e=i(e,t))||delete e[a(o(t))]}},function(e,t,n){var r=n(38),o=n(13),i="[object Set]";e.exports=function(e){return o(e)&&r(e)==i}},function(e,t,n){var r=n(154),o=n(48),i=n(47),a=i&&i.isSet,u=a?o(a):r;e.exports=u},function(e,t,n){var r=n(38),o=n(13),i="[object Map]";e.exports=function(e){return o(e)&&r(e)==i}},function(e,t,n){var r=n(156),o=n(48),i=n(47),a=i&&i.isMap,u=a?o(a):r;e.exports=u},function(e,t,n){var r=n(20),o=r?r.prototype:void 0,i=o?o.valueOf:void 0;e.exports=function(e){return i?Object(i.call(e)):{}}},function(e,t){var n=/\w*$/;e.exports=function(e){var t=new e.constructor(e.source,n.exec(e));return t.lastIndex=e.lastIndex,t}},function(e,t,n){var r=n(52);e.exports=function(e,t){var n=t?r(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}},function(e,t,n){var r=n(52),o=n(160),i=n(159),a=n(158),u=n(91),s="[object Boolean]",l="[object Date]",c="[object Map]",f="[object Number]",p="[object RegExp]",d="[object Set]",h="[object String]",v="[object Symbol]",m="[object ArrayBuffer]",y="[object DataView]",g="[object Float32Array]",b="[object Float64Array]",_="[object Int8Array]",w="[object Int16Array]",E="[object Int32Array]",x="[object Uint8Array]",O="[object Uint8ClampedArray]",C="[object Uint16Array]",S="[object Uint32Array]";e.exports=function(e,t,n){var k=e.constructor;switch(t){case m:return r(e);case s:case l:return new k(+e);case y:return o(e,n);case g:case b:case _:case w:case E:case x:case O:case C:case S:return u(e,n);case c:return new k;case f:case h:return new k(e);case p:return i(e);case d:return new k;case v:return a(e)}}},function(e,t){var n=Object.prototype.hasOwnProperty;e.exports=function(e){var t=e.length,r=new e.constructor(t);return t&&"string"==typeof e[0]&&n.call(e,"index")&&(r.index=e.index,r.input=e.input),r}},function(e,t,n){var r=n(15)(n(9),"WeakMap");e.exports=r},function(e,t,n){var r=n(15)(n(9),"Set");e.exports=r},function(e,t,n){var r=n(15)(n(9),"Promise");e.exports=r},function(e,t,n){var r=n(15)(n(9),"DataView");e.exports=r},function(e,t,n){var r=n(69),o=n(40),i=n(23);e.exports=function(e){return r(e,i,o)}},function(e,t,n){var r=n(14),o=n(70);e.exports=function(e,t){return r(e,o(e),t)}},function(e,t){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var a=e[n];t(a,n,e)&&(i[o++]=a)}return i}},function(e,t,n){var r=n(14),o=n(40);e.exports=function(e,t){return r(e,o(e),t)}},function(e,t,n){var r=n(14),o=n(25);e.exports=function(e,t){return e&&r(t,o(t),e)}},function(e,t,n){var r=n(14),o=n(23);e.exports=function(e,t){return e&&r(t,o(t),e)}},function(e,t){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}},function(e,t,n){var r=n(98),o=n(173),i=n(46),a=n(172),u=n(171),s=n(92),l=n(90),c=n(170),f=n(168),p=n(167),d=n(68),h=n(38),v=n(162),m=n(161),y=n(89),g=n(12),b=n(49),_=n(157),w=n(10),E=n(155),x=n(23),O=1,C=2,S=4,k="[object Arguments]",P="[object Function]",j="[object GeneratorFunction]",T="[object Object]",R={};R[k]=R["[object Array]"]=R["[object ArrayBuffer]"]=R["[object DataView]"]=R["[object Boolean]"]=R["[object Date]"]=R["[object Float32Array]"]=R["[object Float64Array]"]=R["[object Int8Array]"]=R["[object Int16Array]"]=R["[object Int32Array]"]=R["[object Map]"]=R["[object Number]"]=R[T]=R["[object RegExp]"]=R["[object Set]"]=R["[object String]"]=R["[object Symbol]"]=R["[object Uint8Array]"]=R["[object Uint8ClampedArray]"]=R["[object Uint16Array]"]=R["[object Uint32Array]"]=!0,R["[object Error]"]=R[P]=R["[object WeakMap]"]=!1,e.exports=function e(t,n,N,M,A,D){var I,L=n&O,z=n&C,U=n&S;if(N&&(I=A?N(t,M,A,D):N(t)),void 0!==I)return I;if(!w(t))return t;var F=g(t);if(F){if(I=v(t),!L)return l(t,I)}else{var B=h(t),W=B==P||B==j;if(b(t))return s(t,L);if(B==T||B==k||W&&!A){if(I=z||W?{}:y(t),!L)return z?f(t,u(I,t)):c(t,a(I,t))}else{if(!R[B])return A?t:{};I=m(t,B,L)}}D||(D=new r);var q=D.get(t);if(q)return q;if(D.set(t,I),E(t))return t.forEach(function(r){I.add(e(r,n,N,r,t,D))}),I;if(_(t))return t.forEach(function(r,o){I.set(o,e(r,n,N,o,t,D))}),I;var H=U?z?d:p:z?keysIn:x,$=F?void 0:H(t);return o($||t,function(r,o){$&&(r=t[o=r]),i(I,o,e(r,n,N,o,t,D))}),I}},function(e,t,n){var r=n(72),o=n(174),i=n(153),a=n(37),u=n(14),s=n(142),l=n(141),c=n(68),f=l(function(e,t){var n={};if(null==e)return n;var l=!1;t=r(t,function(t){return t=a(t,e),l||(l=t.length>1),t}),u(e,c(e),n),l&&(n=o(n,7,s));for(var f=t.length;f--;)i(n,t[f]);return n});e.exports=f},function(e,t,n){var r=n(10),o=n(22),i=NaN,a=/^\s+|\s+$/g,u=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,c=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(o(e))return i;if(r(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=r(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(a,"");var n=s.test(e);return n||l.test(e)?c(e.slice(2),n?2:8):u.test(e)?i:+e}},function(e,t,n){var r=n(9);e.exports=function(){return r.Date.now()}},function(e,t,n){var r=n(10),o=n(177),i=n(176),a="Expected a function",u=Math.max,s=Math.min;e.exports=function(e,t,n){var l,c,f,p,d,h,v=0,m=!1,y=!1,g=!0;if("function"!=typeof e)throw new TypeError(a);function b(t){var n=l,r=c;return l=c=void 0,v=t,p=e.apply(r,n)}function _(e){var n=e-h;return void 0===h||n>=t||n<0||y&&e-v>=f}function w(){var e=o();if(_(e))return E(e);d=setTimeout(w,function(e){var n=t-(e-h);return y?s(n,f-(e-v)):n}(e))}function E(e){return d=void 0,g&&l?b(e):(l=c=void 0,p)}function x(){var e=o(),n=_(e);if(l=arguments,c=this,h=e,n){if(void 0===d)return function(e){return v=e,d=setTimeout(w,t),m?b(e):p}(h);if(y)return d=setTimeout(w,t),b(h)}return void 0===d&&(d=setTimeout(w,t)),p}return t=i(t)||0,r(n)&&(m=!!n.leading,f=(y="maxWait"in n)?u(i(n.maxWait)||0,t):f,g="trailing"in n?!!n.trailing:g),x.cancel=function(){void 0!==d&&clearTimeout(d),v=0,l=h=c=d=void 0},x.flush=function(){return void 0===d?p:E(o())},x}},function(e,t,n){"use strict";var r=n(74).forEach;e.exports=function(e){var t=(e=e||{}).reporter,n=e.batchProcessor,o=e.stateHandler.getState,i=(e.stateHandler.hasState,e.idHandler);if(!n)throw new Error("Missing required dependency: batchProcessor");if(!t)throw new Error("Missing required dependency: reporter.");var a=function(){var e=document.createElement("div");e.style.cssText="position: absolute; width: 1000px; height: 1000px; visibility: hidden; margin: 0; padding: 0;";var t=document.createElement("div");t.style.cssText="position: absolute; width: 500px; height: 500px; overflow: scroll; visibility: none; top: -1500px; left: -1500px; visibility: hidden; margin: 0; padding: 0;",t.appendChild(e),document.body.insertBefore(t,document.body.firstChild);var n=500-t.clientWidth,r=500-t.clientHeight;return document.body.removeChild(t),{width:n,height:r}}(),u="erd_scroll_detection_container";function s(e,n,r){if(e.addEventListener)e.addEventListener(n,r);else{if(!e.attachEvent)return t.error("[scroll] Don't know how to add event listeners.");e.attachEvent("on"+n,r)}}function l(e,n,r){if(e.removeEventListener)e.removeEventListener(n,r);else{if(!e.detachEvent)return t.error("[scroll] Don't know how to remove event listeners.");e.detachEvent("on"+n,r)}}function c(e){return o(e).container.childNodes[0].childNodes[0].childNodes[0]}function f(e){return o(e).container.childNodes[0].childNodes[0].childNodes[1]}return function(e,t){if(!document.getElementById(e)){var n=t+"_animation",r=t+"_animation_active",o="/* Created by the element-resize-detector library. */\n";o+="."+t+" > div::-webkit-scrollbar { display: none; }\n\n",o+="."+r+" { -webkit-animation-duration: 0.1s; animation-duration: 0.1s; -webkit-animation-name: "+n+"; animation-name: "+n+"; }\n",o+="@-webkit-keyframes "+n+" { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n",function(t,n){n=n||function(e){document.head.appendChild(e)};var r=document.createElement("style");r.innerHTML=t,r.id=e,n(r)}(o+="@keyframes "+n+" { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }")}}("erd_scroll_detection_scrollbar_style",u),{makeDetectable:function(e,l,p){function d(){if(e.debug){var n=Array.prototype.slice.call(arguments);if(n.unshift(i.get(l),"Scroll: "),t.log.apply)t.log.apply(null,n);else for(var r=0;r<n.length;r++)t.log(n[r])}}function h(e){var t=o(e).container.childNodes[0],n=window.getComputedStyle(t);return!n.width||-1===n.width.indexOf("px")}function v(){var e=window.getComputedStyle(l),t={};return t.position=e.position,t.width=l.offsetWidth,t.height=l.offsetHeight,t.top=e.top,t.right=e.right,t.bottom=e.bottom,t.left=e.left,t.widthCSS=e.width,t.heightCSS=e.height,t}function m(){if(d("storeStyle invoked."),o(l)){var e=v();o(l).style=e}else d("Aborting because element has been uninstalled")}function y(e,t,n){o(e).lastWidth=t,o(e).lastHeight=n}function g(){return 2*a.width+1}function b(){return 2*a.height+1}function _(e){return e+10+g()}function w(e){return e+10+b()}function E(e,t,n){var r=c(e),o=f(e),i=_(t),a=w(n),u=function(e){return 2*e+g()}(t),s=function(e){return 2*e+b()}(n);r.scrollLeft=i,r.scrollTop=a,o.scrollLeft=u,o.scrollTop=s}function x(){var e=o(l).container;if(!e){(e=document.createElement("div")).className=u,e.style.cssText="visibility: hidden; display: inline; width: 0px; height: 0px; z-index: -1; overflow: hidden; margin: 0; padding: 0;",o(l).container=e,function(e){e.className+=" "+u+"_animation_active"}(e),l.appendChild(e);var t=function(){o(l).onRendered&&o(l).onRendered()};s(e,"animationstart",t),o(l).onAnimationStart=t}return e}function O(){if(d("Injecting elements"),o(l)){!function(){var e=o(l).style;if("static"===e.position){l.style.position="relative";var n=function(e,t,n,r){var o=n[r];"auto"!==o&&"0"!==function(e){return e.replace(/[^-\d\.]/g,"")}(o)&&(e.warn("An element that is positioned static has style."+r+"="+o+" which is ignored due to the static positioning. The element will need to be positioned relative, so the style."+r+" will be set to 0. Element: ",t),t.style[r]=0)};n(t,l,e,"top"),n(t,l,e,"right"),n(t,l,e,"bottom"),n(t,l,e,"left")}}();var e=o(l).container;e||(e=x());var n,r,i,c,f=a.width,p=a.height,h="position: absolute; flex: none; overflow: hidden; z-index: -1; visibility: hidden; "+(r=-(1+p),i=-p,c=-f,n=(n=-(1+f))?n+"px":"0",r=r?r+"px":"0",i=i?i+"px":"0","left: "+n+"; top: "+r+"; right: "+(c=c?c+"px":"0")+"; bottom: "+i+";"),v=document.createElement("div"),m=document.createElement("div"),y=document.createElement("div"),g=document.createElement("div"),b=document.createElement("div"),_=document.createElement("div");v.dir="ltr",v.style.cssText="position: absolute; flex: none; overflow: hidden; z-index: -1; visibility: hidden; width: 100%; height: 100%; left: 0px; top: 0px;",v.className=u,m.className=u,m.style.cssText=h,y.style.cssText="position: absolute; flex: none; overflow: scroll; z-index: -1; visibility: hidden; width: 100%; height: 100%;",g.style.cssText="position: absolute; left: 0; top: 0;",b.style.cssText="position: absolute; flex: none; overflow: scroll; z-index: -1; visibility: hidden; width: 100%; height: 100%;",_.style.cssText="position: absolute; width: 200%; height: 200%;",y.appendChild(g),b.appendChild(_),m.appendChild(y),m.appendChild(b),v.appendChild(m),e.appendChild(v),s(y,"scroll",w),s(b,"scroll",E),o(l).onExpandScroll=w,o(l).onShrinkScroll=E}else d("Aborting because element has been uninstalled");function w(){o(l).onExpand&&o(l).onExpand()}function E(){o(l).onShrink&&o(l).onShrink()}}function C(){function a(e,t,n){var r=function(e){return c(e).childNodes[0]}(e),o=_(t),i=w(n);r.style.width=o+"px",r.style.height=i+"px"}function u(r){var u=l.offsetWidth,c=l.offsetHeight;d("Storing current size",u,c),y(l,u,c),n.add(0,function(){if(o(l))if(s()){if(e.debug){var n=l.offsetWidth,r=l.offsetHeight;n===u&&r===c||t.warn(i.get(l),"Scroll: Size changed before updating detector elements.")}a(l,u,c)}else d("Aborting because element container has not been initialized");else d("Aborting because element has been uninstalled")}),n.add(1,function(){o(l)?s()?E(l,u,c):d("Aborting because element container has not been initialized"):d("Aborting because element has been uninstalled")}),r&&n.add(2,function(){o(l)?s()?r():d("Aborting because element container has not been initialized"):d("Aborting because element has been uninstalled")})}function s(){return!!o(l).container}function p(){d("notifyListenersIfNeeded invoked");var e=o(l);return void 0===o(l).lastNotifiedWidth&&e.lastWidth===e.startSize.width&&e.lastHeight===e.startSize.height?d("Not notifying: Size is the same as the start size, and there has been no notification yet."):e.lastWidth===e.lastNotifiedWidth&&e.lastHeight===e.lastNotifiedHeight?d("Not notifying: Size already notified"):(d("Current size not notified, notifying..."),e.lastNotifiedWidth=e.lastWidth,e.lastNotifiedHeight=e.lastHeight,void r(o(l).listeners,function(e){e(l)}))}function v(){if(d("Scroll detected."),h(l))d("Scroll event fired while unrendered. Ignoring...");else{var e=l.offsetWidth,t=l.offsetHeight;e!==o(l).lastWidth||t!==o(l).lastHeight?(d("Element size changed."),u(p)):d("Element size has not changed ("+e+"x"+t+").")}}if(d("registerListenersAndPositionElements invoked."),o(l)){o(l).onRendered=function(){if(d("startanimation triggered."),h(l))d("Ignoring since element is still unrendered...");else{d("Element rendered.");var e=c(l),t=f(l);0!==e.scrollLeft&&0!==e.scrollTop&&0!==t.scrollLeft&&0!==t.scrollTop||(d("Scrollbars out of sync. Updating detector elements..."),u(p))}},o(l).onExpand=v,o(l).onShrink=v;var m=o(l).style;a(l,m.width,m.height)}else d("Aborting because element has been uninstalled")}function S(){if(d("finalizeDomMutation invoked."),o(l)){var e=o(l).style;y(l,e.width,e.height),E(l,e.width,e.height)}else d("Aborting because element has been uninstalled")}function k(){p(l)}function P(){var e;d("Installing..."),o(l).listeners=[],e=v(),o(l).startSize={width:e.width,height:e.height},d("Element start size",o(l).startSize),n.add(0,m),n.add(1,O),n.add(2,C),n.add(3,S),n.add(4,k)}p||(p=l,l=e,e=null),e=e||{},d("Making detectable..."),function(e){return!function(e){return e===e.ownerDocument.body||e.ownerDocument.body.contains(e)}(e)||null===window.getComputedStyle(e)}(l)?(d("Element is detached"),x(),d("Waiting until element is attached..."),o(l).onRendered=function(){d("Element is now attached"),P()}):P()},addListener:function(e,t){if(!o(e).listeners.push)throw new Error("Cannot add listener to an element that is not detectable.");o(e).listeners.push(t)},uninstall:function(e){var t=o(e);t&&(t.onExpandScroll&&l(c(e),"scroll",t.onExpandScroll),t.onShrinkScroll&&l(f(e),"scroll",t.onShrinkScroll),t.onAnimationStart&&l(t.container,"animationstart",t.onAnimationStart),t.container&&e.removeChild(t.container))}}}},function(e,t,n){"use strict";var r=n(73);e.exports=function(e){var t=(e=e||{}).reporter,n=e.batchProcessor,o=e.stateHandler.getState;if(!t)throw new Error("Missing required dependency: reporter.");function i(e){return o(e).object}return{makeDetectable:function(e,i,a){a||(a=i,i=e,e=null),(e=e||{}).debug,r.isIE(8)?a(i):function(e,i){var a="display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; padding: 0; margin: 0; opacity: 0; z-index: -1000; pointer-events: none;",u=!1,s=window.getComputedStyle(e),l=e.offsetWidth,c=e.offsetHeight;function f(){function n(){if("static"===s.position){e.style.position="relative";var n=function(e,t,n,r){var o=n[r];"auto"!==o&&"0"!==function(e){return e.replace(/[^-\d\.]/g,"")}(o)&&(e.warn("An element that is positioned static has style."+r+"="+o+" which is ignored due to the static positioning. The element will need to be positioned relative, so the style."+r+" will be set to 0. Element: ",t),t.style[r]=0)};n(t,e,s,"top"),n(t,e,s,"right"),n(t,e,s,"bottom"),n(t,e,s,"left")}}""!==s.position&&(n(),u=!0);var l=document.createElement("object");l.style.cssText=a,l.tabIndex=-1,l.type="text/html",l.onload=function(){u||n(),function e(t,n){t.contentDocument?n(t.contentDocument):setTimeout(function(){e(t,n)},100)}(this,function(t){i(e)})},r.isIE()||(l.data="about:blank"),e.appendChild(l),o(e).object=l,r.isIE()&&(l.data="about:blank")}o(e).startSize={width:l,height:c},n?n.add(f):f()}(i,a)},addListener:function(e,t){if(!i(e))throw new Error("Element is not detectable by this strategy.");function n(){t(e)}r.isIE(8)?(o(e).object={proxy:n},e.attachEvent("onresize",n)):i(e).contentDocument.defaultView.addEventListener("resize",n)},uninstall:function(e){r.isIE(8)?e.detachEvent("onresize",o(e).object.proxy):e.removeChild(i(e)),delete o(e).object}}}},function(e,t,n){"use strict";var r="_erd";function o(e){return e[r]}e.exports={initState:function(e){return e[r]={},o(e)},getState:o,cleanState:function(e){delete e[r]}}},function(e,t,n){"use strict";(e.exports={}).getOption=function(e,t,n){var r=e[t];if((void 0===r||null===r)&&void 0!==n)return n;return r}},function(e,t,n){"use strict";var r=n(182);function o(){var e={},t=0,n=0,r=0;return{add:function(o,i){i||(i=o,o=0),o>n?n=o:o<r&&(r=o),e[o]||(e[o]=[]),e[o].push(i),t++},process:function(){for(var t=r;t<=n;t++)for(var o=e[t],i=0;i<o.length;i++)(0,o[i])()},size:function(){return t}}}e.exports=function(e){var t=(e=e||{}).reporter,n=r.getOption(e,"async",!0),i=r.getOption(e,"auto",!0);i&&!n&&(t&&t.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true."),n=!0);var a,u=o(),s=!1;function l(){for(s=!0;u.size();){var e=u;u=o(),e.process()}s=!1}function c(){var e;e=l,a=setTimeout(e,0)}return{add:function(e,t){!s&&i&&n&&0===u.size()&&c(),u.add(e,t)},force:function(e){s||(void 0===e&&(e=n),a&&(clearTimeout(a),a=null),e?c():l())}}}},function(e,t,n){"use strict";e.exports=function(e){function t(){}var n={log:t,warn:t,error:t};if(!e&&window.console){var r=function(e,t){e[t]=function(){var e=console[t];if(e.apply)e.apply(console,arguments);else for(var n=0;n<arguments.length;n++)e(arguments[n])}};r(n,"log"),r(n,"warn"),r(n,"error")}return n}},function(e,t,n){"use strict";e.exports=function(e){var t=e.idGenerator,n=e.stateHandler.getState;return{get:function(e){var t=n(e);return t&&void 0!==t.id?t.id:null},set:function(e){var r=n(e);if(!r)throw new Error("setId required the element to have a resize detection state.");var o=t.generate();return r.id=o,o}}}},function(e,t,n){"use strict";e.exports=function(){var e=1;return{generate:function(){return e++}}}},function(e,t,n){"use strict";e.exports=function(e){var t={};function n(n){var r=e.get(n);return void 0===r?[]:t[r]||[]}return{get:n,add:function(n,r){var o=e.get(n);t[o]||(t[o]=[]),t[o].push(r)},removeListener:function(e,t){for(var r=n(e),o=0,i=r.length;o<i;++o)if(r[o]===t){r.splice(o,1);break}},removeAllListeners:function(e){var t=n(e);t&&(t.length=0)}}}},function(e,t,n){"use strict";e.exports=function(e){var t=e.stateHandler.getState;return{isDetectable:function(e){var n=t(e);return n&&!!n.isDetectable},markAsDetectable:function(e){t(e).isDetectable=!0},isBusy:function(e){return!!t(e).busy},markBusy:function(e,n){t(e).busy=!!n}}}},function(e,t,n){"use strict";var r=n(74).forEach,o=n(188),i=n(187),a=n(186),u=n(185),s=n(184),l=n(73),c=n(183),f=n(181),p=n(180),d=n(179);function h(e){return Array.isArray(e)||void 0!==e.length}function v(e){if(Array.isArray(e))return e;var t=[];return r(e,function(e){t.push(e)}),t}function m(e){return e&&1===e.nodeType}function y(e,t,n){var r=e[t];return void 0!==r&&null!==r||void 0===n?r:n}e.exports=function(e){var t;if((e=e||{}).idHandler)t={get:function(t){return e.idHandler.get(t,!0)},set:e.idHandler.set};else{var n=a(),g=u({idGenerator:n,stateHandler:f});t=g}var b=e.reporter;b||(b=s(!1===b));var _=y(e,"batchProcessor",c({reporter:b})),w={};w.callOnAdd=!!y(e,"callOnAdd",!0),w.debug=!!y(e,"debug",!1);var E,x=i(t),O=o({stateHandler:f}),C=y(e,"strategy","object"),S={reporter:b,batchProcessor:_,stateHandler:f,idHandler:t};if("scroll"===C&&(l.isLegacyOpera()?(b.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy."),C="object"):l.isIE(9)&&(b.warn("Scroll strategy is not supported on IE9. Changing to object strategy."),C="object")),"scroll"===C)E=d(S);else{if("object"!==C)throw new Error("Invalid strategy name: "+C);E=p(S)}var k={};return{listenTo:function(e,n,o){function i(e){var t=x.get(e);r(t,function(t){t(e)})}function a(e,t,n){x.add(t,n),e&&n(t)}if(o||(o=n,n=e,e={}),!n)throw new Error("At least one element required.");if(!o)throw new Error("Listener required.");if(m(n))n=[n];else{if(!h(n))return b.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");n=v(n)}var u=0,s=y(e,"callOnAdd",w.callOnAdd),l=y(e,"onReady",function(){}),c=y(e,"debug",w.debug);r(n,function(e){f.getState(e)||(f.initState(e),t.set(e));var p=t.get(e);if(c&&b.log("Attaching listener to element",p,e),!O.isDetectable(e))return c&&b.log(p,"Not detectable."),O.isBusy(e)?(c&&b.log(p,"System busy making it detectable"),a(s,e,o),k[p]=k[p]||[],void k[p].push(function(){++u===n.length&&l()})):(c&&b.log(p,"Making detectable..."),O.markBusy(e,!0),E.makeDetectable({debug:c},e,function(e){if(c&&b.log(p,"onElementDetectable"),f.getState(e)){O.markAsDetectable(e),O.markBusy(e,!1),E.addListener(e,i),a(s,e,o);var t=f.getState(e);if(t&&t.startSize){var d=e.offsetWidth,h=e.offsetHeight;t.startSize.width===d&&t.startSize.height===h||i(e)}k[p]&&r(k[p],function(e){e()})}else c&&b.log(p,"Element uninstalled before being detectable.");delete k[p],++u===n.length&&l()}));c&&b.log(p,"Already detecable, adding listener."),a(s,e,o),u++}),u===n.length&&l()},removeListener:x.removeListener,removeAllListeners:x.removeAllListeners,uninstall:function(e){if(!e)return b.error("At least one element is required.");if(m(e))e=[e];else{if(!h(e))return b.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");e=v(e)}r(e,function(e){x.removeAllListeners(e),E.uninstall(e),f.cleanState(e)})}}}},function(e,t,n){var r=n(88)(Object.keys,Object);e.exports=r},function(e,t,n){var r=n(26),o=n(190),i=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return o(e);var t=[];for(var n in Object(e))i.call(e,n)&&"constructor"!=n&&t.push(n);return t}},function(e,t,n){var r=n(46),o=n(14),i=n(81),a=n(19),u=n(26),s=n(23),l=Object.prototype.hasOwnProperty,c=i(function(e,t){if(u(t)||a(t))o(t,s(t),e);else for(var n in t)l.call(t,n)&&r(e,n,t[n])});e.exports=c},function(e,t,n){var r,o;
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
!function(i,a){"use strict";r=[n(42)],void 0===(o=function(e){return function(e,t){var n=e.jQuery,r=e.console;function o(e,t){for(var n in t)e[n]=t[n];return e}var i=Array.prototype.slice;function a(e,t,u){if(!(this instanceof a))return new a(e,t,u);var s=e;"string"==typeof e&&(s=document.querySelectorAll(e)),s?(this.elements=function(e){if(Array.isArray(e))return e;if("object"==typeof e&&"number"==typeof e.length)return i.call(e);return[e]}(s),this.options=o({},this.options),"function"==typeof t?u=t:o(this.options,t),u&&this.on("always",u),this.getImages(),n&&(this.jqDeferred=new n.Deferred),setTimeout(this.check.bind(this))):r.error("Bad element for imagesLoaded "+(s||e))}a.prototype=Object.create(t.prototype),a.prototype.options={},a.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},a.prototype.addElementImages=function(e){"IMG"==e.nodeName&&this.addImage(e),!0===this.options.background&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&u[t]){for(var n=e.querySelectorAll("img"),r=0;r<n.length;r++){var o=n[r];this.addImage(o)}if("string"==typeof this.options.background){var i=e.querySelectorAll(this.options.background);for(r=0;r<i.length;r++){var a=i[r];this.addElementBackgroundImages(a)}}}};var u={1:!0,9:!0,11:!0};function s(e){this.img=e}function l(e,t){this.url=e,this.element=t,this.img=new Image}return a.prototype.addElementBackgroundImages=function(e){var t=getComputedStyle(e);if(t)for(var n=/url\((['"])?(.*?)\1\)/gi,r=n.exec(t.backgroundImage);null!==r;){var o=r&&r[2];o&&this.addBackground(o,e),r=n.exec(t.backgroundImage)}},a.prototype.addImage=function(e){var t=new s(e);this.images.push(t)},a.prototype.addBackground=function(e,t){var n=new l(e,t);this.images.push(n)},a.prototype.check=function(){var e=this;function t(t,n,r){setTimeout(function(){e.progress(t,n,r)})}this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?this.images.forEach(function(e){e.once("progress",t),e.check()}):this.complete()},a.prototype.progress=function(e,t,n){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.emitEvent("progress",[this,e,t]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,e),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&r&&r.log("progress: "+n,e,t)},a.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(e,[this]),this.emitEvent("always",[this]),this.jqDeferred){var t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},s.prototype=Object.create(t.prototype),s.prototype.check=function(){this.getIsImageComplete()?this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.proxyImage.src=this.img.src)},s.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},s.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.img,t])},s.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},s.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},s.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},s.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},l.prototype=Object.create(s.prototype),l.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},l.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},l.prototype.confirm=function(e,t){this.isLoaded=e,this.emitEvent("progress",[this,this.element,t])},a.makeJQueryPlugin=function(t){(t=t||e.jQuery)&&((n=t).fn.imagesLoaded=function(e,t){return new a(this,e,t).jqDeferred.promise(n(this))})},a.makeJQueryPlugin(),a}(i,e)}.apply(t,r))||(e.exports=o)}("undefined"!=typeof window?window:this)},function(e,t,n){var r,o,i;window,o=[n(42),n(41)],void 0===(i="function"==typeof(r=function(e,t){"use strict";var n=document.documentElement.style,r="string"==typeof n.transition?"transition":"WebkitTransition",o="string"==typeof n.transform?"transform":"WebkitTransform",i={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[r],a={transform:o,transition:r,transitionDuration:r+"Duration",transitionProperty:r+"Property",transitionDelay:r+"Delay"};function u(e,t){e&&(this.element=e,this.layout=t,this.position={x:0,y:0},this._create())}var s=u.prototype=Object.create(e.prototype);s.constructor=u,s._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},s.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},s.getSize=function(){this.size=t(this.element)},s.css=function(e){var t=this.element.style;for(var n in e){var r=a[n]||n;t[r]=e[n]}},s.getPosition=function(){var e=getComputedStyle(this.element),t=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),r=e[t?"left":"right"],o=e[n?"top":"bottom"],i=parseFloat(r),a=parseFloat(o),u=this.layout.size;-1!=r.indexOf("%")&&(i=i/100*u.width),-1!=o.indexOf("%")&&(a=a/100*u.height),i=isNaN(i)?0:i,a=isNaN(a)?0:a,i-=t?u.paddingLeft:u.paddingRight,a-=n?u.paddingTop:u.paddingBottom,this.position.x=i,this.position.y=a},s.layoutPosition=function(){var e=this.layout.size,t={},n=this.layout._getOption("originLeft"),r=this.layout._getOption("originTop"),o=n?"paddingLeft":"paddingRight",i=n?"left":"right",a=n?"right":"left",u=this.position.x+e[o];t[i]=this.getXValue(u),t[a]="";var s=r?"paddingTop":"paddingBottom",l=r?"top":"bottom",c=r?"bottom":"top",f=this.position.y+e[s];t[l]=this.getYValue(f),t[c]="",this.css(t),this.emitEvent("layout",[this])},s.getXValue=function(e){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!t?e/this.layout.size.width*100+"%":e+"px"},s.getYValue=function(e){var t=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&t?e/this.layout.size.height*100+"%":e+"px"},s._transitionTo=function(e,t){this.getPosition();var n=this.position.x,r=this.position.y,o=e==this.position.x&&t==this.position.y;if(this.setPosition(e,t),!o||this.isTransitioning){var i=e-n,a=t-r,u={};u.transform=this.getTranslate(i,a),this.transition({to:u,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})}else this.layoutPosition()},s.getTranslate=function(e,t){var n=this.layout._getOption("originLeft"),r=this.layout._getOption("originTop");return"translate3d("+(e=n?e:-e)+"px, "+(t=r?t:-t)+"px, 0)"},s.goTo=function(e,t){this.setPosition(e,t),this.layoutPosition()},s.moveTo=s._transitionTo,s.setPosition=function(e,t){this.position.x=parseFloat(e),this.position.y=parseFloat(t)},s._nonTransition=function(e){for(var t in this.css(e.to),e.isCleaning&&this._removeStyles(e.to),e.onTransitionEnd)e.onTransitionEnd[t].call(this)},s.transition=function(e){if(parseFloat(this.layout.options.transitionDuration)){var t=this._transn;for(var n in e.onTransitionEnd)t.onEnd[n]=e.onTransitionEnd[n];for(n in e.to)t.ingProperties[n]=!0,e.isCleaning&&(t.clean[n]=!0);e.from&&(this.css(e.from),this.element.offsetHeight),this.enableTransition(e.to),this.css(e.to),this.isTransitioning=!0}else this._nonTransition(e)};var l="opacity,"+o.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase()});s.enableTransition=function(){if(!this.isTransitioning){var e=this.layout.options.transitionDuration;e="number"==typeof e?e+"ms":e,this.css({transitionProperty:l,transitionDuration:e,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(i,this,!1)}},s.onwebkitTransitionEnd=function(e){this.ontransitionend(e)},s.onotransitionend=function(e){this.ontransitionend(e)};var c={"-webkit-transform":"transform"};s.ontransitionend=function(e){if(e.target===this.element){var t=this._transn,n=c[e.propertyName]||e.propertyName;if(delete t.ingProperties[n],function(e){for(var t in e)return!1;return!0}(t.ingProperties)&&this.disableTransition(),n in t.clean&&(this.element.style[e.propertyName]="",delete t.clean[n]),n in t.onEnd){var r=t.onEnd[n];r.call(this),delete t.onEnd[n]}this.emitEvent("transitionEnd",[this])}},s.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(i,this,!1),this.isTransitioning=!1},s._removeStyles=function(e){var t={};for(var n in e)t[n]="";this.css(t)};var f={transitionProperty:"",transitionDuration:"",transitionDelay:""};return s.removeTransitionStyles=function(){this.css(f)},s.stagger=function(e){e=isNaN(e)?0:e,this.staggerDelay=e+"ms"},s.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},s.remove=function(){r&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),this.hide()):this.removeElem()},s.reveal=function(){delete this.isHidden,this.css({display:""});var e=this.layout.options,t={};t[this.getHideRevealTransitionEndProperty("visibleStyle")]=this.onRevealTransitionEnd,this.transition({from:e.hiddenStyle,to:e.visibleStyle,isCleaning:!0,onTransitionEnd:t})},s.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},s.getHideRevealTransitionEndProperty=function(e){var t=this.layout.options[e];if(t.opacity)return"opacity";for(var n in t)return n},s.hide=function(){this.isHidden=!0,this.css({display:""});var e=this.layout.options,t={};t[this.getHideRevealTransitionEndProperty("hiddenStyle")]=this.onHideTransitionEnd,this.transition({from:e.visibleStyle,to:e.hiddenStyle,isCleaning:!0,onTransitionEnd:t})},s.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},s.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},u})?r.apply(t,o):r)||(e.exports=i)},function(e,t,n){var r,o;!function(i,a){"use strict";void 0===(o="function"==typeof(r=a)?r.call(t,n,t,e):r)||(e.exports=o)}(window,function(){"use strict";var e=function(){var e=window.Element.prototype;if(e.matches)return"matches";if(e.matchesSelector)return"matchesSelector";for(var t=["webkit","moz","ms","o"],n=0;n<t.length;n++){var r=t[n]+"MatchesSelector";if(e[r])return r}}();return function(t,n){return t[e](n)}})},function(e,t,n){var r,o;!function(i,a){r=[n(195)],void 0===(o=function(e){return function(e,t){"use strict";var n={extend:function(e,t){for(var n in t)e[n]=t[n];return e},modulo:function(e,t){return(e%t+t)%t}},r=Array.prototype.slice;n.makeArray=function(e){if(Array.isArray(e))return e;if(null===e||void 0===e)return[];var t="object"==typeof e&&"number"==typeof e.length;return t?r.call(e):[e]},n.removeFrom=function(e,t){var n=e.indexOf(t);-1!=n&&e.splice(n,1)},n.getParent=function(e,n){for(;e.parentNode&&e!=document.body;)if(e=e.parentNode,t(e,n))return e},n.getQueryElement=function(e){return"string"==typeof e?document.querySelector(e):e},n.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},n.filterFindElements=function(e,r){var o=[];return(e=n.makeArray(e)).forEach(function(e){if(e instanceof HTMLElement)if(r){t(e,r)&&o.push(e);for(var n=e.querySelectorAll(r),i=0;i<n.length;i++)o.push(n[i])}else o.push(e)}),o},n.debounceMethod=function(e,t,n){n=n||100;var r=e.prototype[t],o=t+"Timeout";e.prototype[t]=function(){var e=this[o];clearTimeout(e);var t=arguments,i=this;this[o]=setTimeout(function(){r.apply(i,t),delete i[o]},n)}},n.docReady=function(e){var t=document.readyState;"complete"==t||"interactive"==t?setTimeout(e):document.addEventListener("DOMContentLoaded",e)},n.toDashed=function(e){return e.replace(/(.)([A-Z])/g,function(e,t,n){return t+"-"+n}).toLowerCase()};var o=e.console;return n.htmlInit=function(t,r){n.docReady(function(){var i=n.toDashed(r),a="data-"+i,u=document.querySelectorAll("["+a+"]"),s=document.querySelectorAll(".js-"+i),l=n.makeArray(u).concat(n.makeArray(s)),c=a+"-options",f=e.jQuery;l.forEach(function(e){var n,i=e.getAttribute(a)||e.getAttribute(c);try{n=i&&JSON.parse(i)}catch(t){return void(o&&o.error("Error parsing "+a+" on "+e.className+": "+t))}var u=new t(e,n);f&&f.data(e,r,u)})})},n}(i,e)}.apply(t,r))||(e.exports=o)}(window)},function(e,t,n){var r,o;
/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */
/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */
!function(i,a){"use strict";r=[n(42),n(41),n(196),n(194)],void 0===(o=function(e,t,n,r){return function(e,t,n,r,o){var i=e.console,a=e.jQuery,u=function(){},s=0,l={};function c(e,t){var n=r.getQueryElement(e);if(n){this.element=n,a&&(this.$element=a(this.element)),this.options=r.extend({},this.constructor.defaults),this.option(t);var o=++s;this.element.outlayerGUID=o,l[o]=this,this._create();var u=this._getOption("initLayout");u&&this.layout()}else i&&i.error("Bad element for "+this.constructor.namespace+": "+(n||e))}c.namespace="outlayer",c.Item=o,c.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var f=c.prototype;function p(e){function t(){e.apply(this,arguments)}return t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t}r.extend(f,t.prototype),f.option=function(e){r.extend(this.options,e)},f._getOption=function(e){var t=this.constructor.compatOptions[e];return t&&void 0!==this.options[t]?this.options[t]:this.options[e]},c.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},f._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),r.extend(this.element.style,this.options.containerStyle);var e=this._getOption("resize");e&&this.bindResize()},f.reloadItems=function(){this.items=this._itemize(this.element.children)},f._itemize=function(e){for(var t=this._filterFindItemElements(e),n=this.constructor.Item,r=[],o=0;o<t.length;o++){var i=t[o],a=new n(i,this);r.push(a)}return r},f._filterFindItemElements=function(e){return r.filterFindElements(e,this.options.itemSelector)},f.getItemElements=function(){return this.items.map(function(e){return e.element})},f.layout=function(){this._resetLayout(),this._manageStamps();var e=this._getOption("layoutInstant"),t=void 0!==e?e:!this._isLayoutInited;this.layoutItems(this.items,t),this._isLayoutInited=!0},f._init=f.layout,f._resetLayout=function(){this.getSize()},f.getSize=function(){this.size=n(this.element)},f._getMeasurement=function(e,t){var r,o=this.options[e];o?("string"==typeof o?r=this.element.querySelector(o):o instanceof HTMLElement&&(r=o),this[e]=r?n(r)[t]:o):this[e]=0},f.layoutItems=function(e,t){e=this._getItemsForLayout(e),this._layoutItems(e,t),this._postLayout()},f._getItemsForLayout=function(e){return e.filter(function(e){return!e.isIgnored})},f._layoutItems=function(e,t){if(this._emitCompleteOnItems("layout",e),e&&e.length){var n=[];e.forEach(function(e){var r=this._getItemLayoutPosition(e);r.item=e,r.isInstant=t||e.isLayoutInstant,n.push(r)},this),this._processLayoutQueue(n)}},f._getItemLayoutPosition=function(){return{x:0,y:0}},f._processLayoutQueue=function(e){this.updateStagger(),e.forEach(function(e,t){this._positionItem(e.item,e.x,e.y,e.isInstant,t)},this)},f.updateStagger=function(){var e=this.options.stagger;if(null!==e&&void 0!==e)return this.stagger=function(e){if("number"==typeof e)return e;var t=e.match(/(^\d*\.?\d*)(\w*)/),n=t&&t[1],r=t&&t[2];if(!n.length)return 0;n=parseFloat(n);var o=d[r]||1;return n*o}(e),this.stagger;this.stagger=0},f._positionItem=function(e,t,n,r,o){r?e.goTo(t,n):(e.stagger(o*this.stagger),e.moveTo(t,n))},f._postLayout=function(){this.resizeContainer()},f.resizeContainer=function(){var e=this._getOption("resizeContainer");if(e){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},f._getContainerSize=u,f._setContainerMeasure=function(e,t){if(void 0!==e){var n=this.size;n.isBorderBox&&(e+=t?n.paddingLeft+n.paddingRight+n.borderLeftWidth+n.borderRightWidth:n.paddingBottom+n.paddingTop+n.borderTopWidth+n.borderBottomWidth),e=Math.max(e,0),this.element.style[t?"width":"height"]=e+"px"}},f._emitCompleteOnItems=function(e,t){var n=this;function r(){n.dispatchEvent(e+"Complete",null,[t])}var o=t.length;if(t&&o){var i=0;t.forEach(function(t){t.once(e,a)})}else r();function a(){++i==o&&r()}},f.dispatchEvent=function(e,t,n){var r=t?[t].concat(n):n;if(this.emitEvent(e,r),a)if(this.$element=this.$element||a(this.element),t){var o=a.Event(t);o.type=e,this.$element.trigger(o,n)}else this.$element.trigger(e,n)},f.ignore=function(e){var t=this.getItem(e);t&&(t.isIgnored=!0)},f.unignore=function(e){var t=this.getItem(e);t&&delete t.isIgnored},f.stamp=function(e){(e=this._find(e))&&(this.stamps=this.stamps.concat(e),e.forEach(this.ignore,this))},f.unstamp=function(e){(e=this._find(e))&&e.forEach(function(e){r.removeFrom(this.stamps,e),this.unignore(e)},this)},f._find=function(e){if(e)return"string"==typeof e&&(e=this.element.querySelectorAll(e)),e=r.makeArray(e)},f._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},f._getBoundingRect=function(){var e=this.element.getBoundingClientRect(),t=this.size;this._boundingRect={left:e.left+t.paddingLeft+t.borderLeftWidth,top:e.top+t.paddingTop+t.borderTopWidth,right:e.right-(t.paddingRight+t.borderRightWidth),bottom:e.bottom-(t.paddingBottom+t.borderBottomWidth)}},f._manageStamp=u,f._getElementOffset=function(e){var t=e.getBoundingClientRect(),r=this._boundingRect,o=n(e),i={left:t.left-r.left-o.marginLeft,top:t.top-r.top-o.marginTop,right:r.right-t.right-o.marginRight,bottom:r.bottom-t.bottom-o.marginBottom};return i},f.handleEvent=r.handleEvent,f.bindResize=function(){e.addEventListener("resize",this),this.isResizeBound=!0},f.unbindResize=function(){e.removeEventListener("resize",this),this.isResizeBound=!1},f.onresize=function(){this.resize()},r.debounceMethod(c,"onresize",100),f.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},f.needsResizeLayout=function(){var e=n(this.element),t=this.size&&e;return t&&e.innerWidth!==this.size.innerWidth},f.addItems=function(e){var t=this._itemize(e);return t.length&&(this.items=this.items.concat(t)),t},f.appended=function(e){var t=this.addItems(e);t.length&&(this.layoutItems(t,!0),this.reveal(t))},f.prepended=function(e){var t=this._itemize(e);if(t.length){var n=this.items.slice(0);this.items=t.concat(n),this._resetLayout(),this._manageStamps(),this.layoutItems(t,!0),this.reveal(t),this.layoutItems(n)}},f.reveal=function(e){if(this._emitCompleteOnItems("reveal",e),e&&e.length){var t=this.updateStagger();e.forEach(function(e,n){e.stagger(n*t),e.reveal()})}},f.hide=function(e){if(this._emitCompleteOnItems("hide",e),e&&e.length){var t=this.updateStagger();e.forEach(function(e,n){e.stagger(n*t),e.hide()})}},f.revealItemElements=function(e){var t=this.getItems(e);this.reveal(t)},f.hideItemElements=function(e){var t=this.getItems(e);this.hide(t)},f.getItem=function(e){for(var t=0;t<this.items.length;t++){var n=this.items[t];if(n.element==e)return n}},f.getItems=function(e){var t=[];return(e=r.makeArray(e)).forEach(function(e){var n=this.getItem(e);n&&t.push(n)},this),t},f.remove=function(e){var t=this.getItems(e);this._emitCompleteOnItems("remove",t),t&&t.length&&t.forEach(function(e){e.remove(),r.removeFrom(this.items,e)},this)},f.destroy=function(){var e=this.element.style;e.height="",e.position="",e.width="",this.items.forEach(function(e){e.destroy()}),this.unbindResize();var t=this.element.outlayerGUID;delete l[t],delete this.element.outlayerGUID,a&&a.removeData(this.element,this.constructor.namespace)},c.data=function(e){var t=(e=r.getQueryElement(e))&&e.outlayerGUID;return t&&l[t]},c.create=function(e,t){var n=p(c);return n.defaults=r.extend({},c.defaults),r.extend(n.defaults,t),n.compatOptions=r.extend({},c.compatOptions),n.namespace=e,n.data=c.data,n.Item=p(o),r.htmlInit(n,e),a&&a.bridget&&a.bridget(e,n),n};var d={ms:1,s:1e3};return c.Item=o,c}(i,e,t,n,r)}.apply(t,r))||(e.exports=o)}(window)},function(e,t,n){var r,o,i;
/*!
 * Masonry v4.2.1
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */window,o=[n(197),n(41)],void 0===(i="function"==typeof(r=function(e,t){"use strict";var n=e.create("masonry");n.compatOptions.fitWidth="isFitWidth";var r=n.prototype;return r._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var e=0;e<this.cols;e++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},r.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var e=this.items[0],n=e&&e.element;this.columnWidth=n&&t(n).outerWidth||this.containerWidth}var r=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,i=o/r,a=r-o%r;i=Math[a&&a<1?"round":"floor"](i),this.cols=Math.max(i,1)},r.getContainerWidth=function(){var e=this._getOption("fitWidth")?this.element.parentNode:this.element,n=t(e);this.containerWidth=n&&n.innerWidth},r._getItemLayoutPosition=function(e){e.getSize();var t=e.size.outerWidth%this.columnWidth,n=Math[t&&t<1?"round":"ceil"](e.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var r=this[this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition"](n,e),o={x:this.columnWidth*r.col,y:r.y},i=r.y+e.size.outerHeight,a=n+r.col,u=r.col;u<a;u++)this.colYs[u]=i;return o},r._getTopColPosition=function(e){var t=this._getTopColGroup(e),n=Math.min.apply(Math,t);return{col:t.indexOf(n),y:n}},r._getTopColGroup=function(e){if(e<2)return this.colYs;for(var t=[],n=this.cols+1-e,r=0;r<n;r++)t[r]=this._getColGroupY(r,e);return t},r._getColGroupY=function(e,t){if(t<2)return this.colYs[e];var n=this.colYs.slice(e,e+t);return Math.max.apply(Math,n)},r._getHorizontalColPosition=function(e,t){var n=this.horizontalColIndex%this.cols;n=e>1&&n+e>this.cols?0:n;var r=t.size.outerWidth&&t.size.outerHeight;return this.horizontalColIndex=r?n+e:this.horizontalColIndex,{col:n,y:this._getColGroupY(n,e)}},r._manageStamp=function(e){var n=t(e),r=this._getElementOffset(e),o=this._getOption("originLeft")?r.left:r.right,i=o+n.outerWidth,a=Math.floor(o/this.columnWidth);a=Math.max(0,a);var u=Math.floor(i/this.columnWidth);u-=i%this.columnWidth?0:1,u=Math.min(this.cols-1,u);for(var s=(this._getOption("originTop")?r.top:r.bottom)+n.outerHeight,l=a;l<=u;l++)this.colYs[l]=Math.max(s,this.colYs[l])},r._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var e={height:this.maxY};return this._getOption("fitWidth")&&(e.width=this._getContainerFitWidth()),e},r._getContainerFitWidth=function(){for(var e=0,t=this.cols;--t&&0===this.colYs[t];)e++;return(this.cols-e)*this.columnWidth-this.gutter},r.needsResizeLayout=function(){var e=this.containerWidth;return this.getContainerWidth(),e!=this.containerWidth},n})?r.apply(t,o):r)||(e.exports=i)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n(1)),i=n(4),a=u(n(24));u(n(135)),u(n(132)),u(n(36)),n(65);function u(e){return e&&e.__esModule?e:{default:e}}var s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={end:10},n.infiniteScroll=n.infiniteScroll.bind(n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){window.bottom=!1,window.addEventListener("scroll",this.infiniteScroll),this.props.requestAllPegs()}},{key:"infiniteScroll",value:function(){$(window).scroll(function(){$(window).scrollTop()<=$(document).height()-$(window).height()&&$(window).scrollTop()>=$(document).height()-$(window).height()-50&&(window.bottom=!0)}),window.bottom&&(this.state.end<this.props.pegs.length&&this.setState({end:this.state.end+10}),window.bottom=!1)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("scroll",this.infiniteScroll)}},{key:"render",value:function(){var e=this;return o.default.createElement("div",{class:"create-peg-container",onClick:function(){return e.props.closeModal()}},o.default.createElement(a.default,{className:"pegs-index",elementType:"ul",options:{transitionDuration:1,gutter:20},disableImagesLoaded:!1,updateOnEachImageLoad:!1},this.props.pegs.map(function(t){return o.default.createElement("div",{className:"divpegshow",onClick:function(){return e.props.history.push("/peg/"+t.id)}},o.default.createElement("div",{className:"index-image"},o.default.createElement("div",{className:"divshowmodal"},o.default.createElement("div",{onClick:function(n){n.preventDefault(),n.stopPropagation(),e.props.openModal({modal:"SavePeg",peg:t})},className:"peg-save"},"Save")),o.default.createElement("div",{className:"masonry"},o.default.createElement("div",{class:"container"},o.default.createElement("img",{src:t.image_url})),o.default.createElement("span",null,t.title))))})))}}]),t}();t.default=(0,i.withRouter)(s)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(n(1)),o=n(4),i=a(n(76));a(n(43));function a(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t=e.currentUser,n=e.logout;return t?r.default.createElement("div",{className:"final"},r.default.createElement("hgroup",{className:"header-group"},r.default.createElement("div",{className:"searchandlogo"},r.default.createElement("div",null,r.default.createElement(o.Link,{to:"/"},r.default.createElement("img",{src:window.logo,className:"superlogo12"}))),r.default.createElement("div",{className:"searchbarouter"},r.default.createElement("div",null,r.default.createElement("input",{type:"text",className:"searchbar",placeholder:"Search"})),r.default.createElement("div",{className:"search"},r.default.createElement("i",{className:"fas fa-search"})))),r.default.createElement("div",{className:"profilelogout"},r.default.createElement("div",{className:"profile-link-outer"},r.default.createElement(o.Link,{style:{textDecoration:"none"},to:"/user/"+t.id},r.default.createElement("div",{className:"profile-link"},null===t.image_url?r.default.createElement("div",{className:"userimg"},r.default.createElement("i",{className:"fas fa-user"})):r.default.createElement("div",{className:"userimg"},r.default.createElement("img",{src:t.image_url}))),r.default.createElement("div",{className:"nav_link"},t.username[0].toUpperCase()+t.username.slice(1)))),r.default.createElement("li",null,r.default.createElement("button",{className:"header-button",onClick:function(){return n()}},"Log Out"))))):r.default.createElement("div",{className:"loginbackground"},r.default.createElement(i.default,null))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(6),i=n(16),a=n(200),u=(r=a)&&r.__esModule?r:{default:r};n(5);t.default=(0,o.connect)(function(e){return{currentUser:e.entities.users[e.session.id]}},function(e){return{logout:function(){return e((0,i.logout)())}}})(u.default)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=h(n(1)),o=(n(6),n(4)),i=h(n(201)),a=h(n(128)),u=h(n(76)),s=n(65),l=h(n(43)),c=h(n(36)),f=h(n(64)),p=h(n(125)),d=h(n(124));function h(e){return e&&e.__esModule?e:{default:e}}t.default=function(){return r.default.createElement("div",null,r.default.createElement(d.default,null),r.default.createElement(s.ProtectedRoute,{path:"/",component:i.default}),r.default.createElement(s.AuthRoute,{exact:!0,path:"/login",component:u.default}),r.default.createElement(s.AuthRoute,{exact:!0,path:"/signup",component:a.default}),r.default.createElement(o.Switch,null,r.default.createElement(s.ProtectedRoute,{exact:!0,path:"/peg/:id",component:c.default}),r.default.createElement(s.ProtectedRoute,{exact:!0,path:"/user/:id",component:p.default}),r.default.createElement(s.ProtectedRoute,{exact:!0,path:"/user/:id/boards/:id/pegs",component:f.default}),r.default.createElement(s.ProtectedRoute,{exact:!0,path:"/",component:l.default})))}},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";var r=n(56),o=n(33),i=n(204);e.exports=function(){function e(e,t,n,r,a,u){u!==i&&o(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=r,n.PropTypes=n,n}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=u(n(1)),o=n(6),i=n(4),a=u(n(202));function u(e){return e&&e.__esModule?e:{default:e}}t.default=function(e){var t=e.store;return r.default.createElement(o.Provider,{store:t},r.default.createElement(i.HashRouter,null,r.default.createElement(a.default,null)))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_BOARD_ERRORS:return t.errors;case r.CLEAR_BOARD_ERRORS:return[];default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(8);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_PEG_ERRORS:return t.errors;case r.CLEAR_PEG_ERRORS:return[];default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(16);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_SESSION_ERRORS:return t.errors;case r.RECEIVE_CURRENT_USER:case r.CLEARERRORS:return[];default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(17),o=u(n(209)),i=u(n(208)),a=u(n(207));function u(e){return e&&e.__esModule?e:{default:e}}var s=(0,r.combineReducers)({session:o.default,pegs:i.default,boards:a.default});t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(16),o={id:null};Object.freeze(o);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_CURRENT_USER:return{id:t.currentUser.id};case r.LOGOUT_CURRENT_USER:return o;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5);t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];switch(Object.freeze(e),t.type){case r.OPEN_MODAL:return{modal:t.modal,peg:t.peg};case r.CLOSE_MODAL:return null;default:return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(17),i=n(212),a=(r=i)&&r.__esModule?r:{default:r};var u=(0,o.combineReducers)({modal:a.default});t.default=u},function(e,t,n){(function(e,r){var o;
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */(function(){var i,a=200,u="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",s="Expected a function",l="__lodash_hash_undefined__",c=500,f="__lodash_placeholder__",p=1,d=2,h=4,v=1,m=2,y=1,g=2,b=4,_=8,w=16,E=32,x=64,O=128,C=256,S=512,k=30,P="...",j=800,T=16,R=1,N=2,M=1/0,A=9007199254740991,D=1.7976931348623157e308,I=NaN,L=4294967295,z=L-1,U=L>>>1,F=[["ary",O],["bind",y],["bindKey",g],["curry",_],["curryRight",w],["flip",S],["partial",E],["partialRight",x],["rearg",C]],B="[object Arguments]",W="[object Array]",q="[object AsyncFunction]",H="[object Boolean]",$="[object Date]",V="[object DOMException]",Y="[object Error]",G="[object Function]",K="[object GeneratorFunction]",Q="[object Map]",X="[object Number]",J="[object Null]",Z="[object Object]",ee="[object Proxy]",te="[object RegExp]",ne="[object Set]",re="[object String]",oe="[object Symbol]",ie="[object Undefined]",ae="[object WeakMap]",ue="[object WeakSet]",se="[object ArrayBuffer]",le="[object DataView]",ce="[object Float32Array]",fe="[object Float64Array]",pe="[object Int8Array]",de="[object Int16Array]",he="[object Int32Array]",ve="[object Uint8Array]",me="[object Uint8ClampedArray]",ye="[object Uint16Array]",ge="[object Uint32Array]",be=/\b__p \+= '';/g,_e=/\b(__p \+=) '' \+/g,we=/(__e\(.*?\)|\b__t\)) \+\n'';/g,Ee=/&(?:amp|lt|gt|quot|#39);/g,xe=/[&<>"']/g,Oe=RegExp(Ee.source),Ce=RegExp(xe.source),Se=/<%-([\s\S]+?)%>/g,ke=/<%([\s\S]+?)%>/g,Pe=/<%=([\s\S]+?)%>/g,je=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Te=/^\w*$/,Re=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Ne=/[\\^$.*+?()[\]{}|]/g,Me=RegExp(Ne.source),Ae=/^\s+|\s+$/g,De=/^\s+/,Ie=/\s+$/,Le=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ze=/\{\n\/\* \[wrapped with (.+)\] \*/,Ue=/,? & /,Fe=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Be=/\\(\\)?/g,We=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,qe=/\w*$/,He=/^[-+]0x[0-9a-f]+$/i,$e=/^0b[01]+$/i,Ve=/^\[object .+?Constructor\]$/,Ye=/^0o[0-7]+$/i,Ge=/^(?:0|[1-9]\d*)$/,Ke=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Qe=/($^)/,Xe=/['\n\r\u2028\u2029\\]/g,Je="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",Ze="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",et="[\\ud800-\\udfff]",tt="["+Ze+"]",nt="["+Je+"]",rt="\\d+",ot="[\\u2700-\\u27bf]",it="[a-z\\xdf-\\xf6\\xf8-\\xff]",at="[^\\ud800-\\udfff"+Ze+rt+"\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",ut="\\ud83c[\\udffb-\\udfff]",st="[^\\ud800-\\udfff]",lt="(?:\\ud83c[\\udde6-\\uddff]){2}",ct="[\\ud800-\\udbff][\\udc00-\\udfff]",ft="[A-Z\\xc0-\\xd6\\xd8-\\xde]",pt="(?:"+it+"|"+at+")",dt="(?:"+ft+"|"+at+")",ht="(?:"+nt+"|"+ut+")"+"?",vt="[\\ufe0e\\ufe0f]?"+ht+("(?:\\u200d(?:"+[st,lt,ct].join("|")+")[\\ufe0e\\ufe0f]?"+ht+")*"),mt="(?:"+[ot,lt,ct].join("|")+")"+vt,yt="(?:"+[st+nt+"?",nt,lt,ct,et].join("|")+")",gt=RegExp("['’]","g"),bt=RegExp(nt,"g"),_t=RegExp(ut+"(?="+ut+")|"+yt+vt,"g"),wt=RegExp([ft+"?"+it+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[tt,ft,"$"].join("|")+")",dt+"+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[tt,ft+pt,"$"].join("|")+")",ft+"?"+pt+"+(?:['’](?:d|ll|m|re|s|t|ve))?",ft+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",rt,mt].join("|"),"g"),Et=RegExp("[\\u200d\\ud800-\\udfff"+Je+"\\ufe0e\\ufe0f]"),xt=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Ot=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Ct=-1,St={};St[ce]=St[fe]=St[pe]=St[de]=St[he]=St[ve]=St[me]=St[ye]=St[ge]=!0,St[B]=St[W]=St[se]=St[H]=St[le]=St[$]=St[Y]=St[G]=St[Q]=St[X]=St[Z]=St[te]=St[ne]=St[re]=St[ae]=!1;var kt={};kt[B]=kt[W]=kt[se]=kt[le]=kt[H]=kt[$]=kt[ce]=kt[fe]=kt[pe]=kt[de]=kt[he]=kt[Q]=kt[X]=kt[Z]=kt[te]=kt[ne]=kt[re]=kt[oe]=kt[ve]=kt[me]=kt[ye]=kt[ge]=!0,kt[Y]=kt[G]=kt[ae]=!1;var Pt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},jt=parseFloat,Tt=parseInt,Rt="object"==typeof e&&e&&e.Object===Object&&e,Nt="object"==typeof self&&self&&self.Object===Object&&self,Mt=Rt||Nt||Function("return this")(),At="object"==typeof t&&t&&!t.nodeType&&t,Dt=At&&"object"==typeof r&&r&&!r.nodeType&&r,It=Dt&&Dt.exports===At,Lt=It&&Rt.process,zt=function(){try{var e=Dt&&Dt.require&&Dt.require("util").types;return e||Lt&&Lt.binding&&Lt.binding("util")}catch(e){}}(),Ut=zt&&zt.isArrayBuffer,Ft=zt&&zt.isDate,Bt=zt&&zt.isMap,Wt=zt&&zt.isRegExp,qt=zt&&zt.isSet,Ht=zt&&zt.isTypedArray;function $t(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}function Vt(e,t,n,r){for(var o=-1,i=null==e?0:e.length;++o<i;){var a=e[o];t(r,a,n(a),e)}return r}function Yt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&!1!==t(e[n],n,e););return e}function Gt(e,t){for(var n=null==e?0:e.length;n--&&!1!==t(e[n],n,e););return e}function Kt(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(!t(e[n],n,e))return!1;return!0}function Qt(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var a=e[n];t(a,n,e)&&(i[o++]=a)}return i}function Xt(e,t){return!!(null==e?0:e.length)&&sn(e,t,0)>-1}function Jt(e,t,n){for(var r=-1,o=null==e?0:e.length;++r<o;)if(n(t,e[r]))return!0;return!1}function Zt(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}function en(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}function tn(e,t,n,r){var o=-1,i=null==e?0:e.length;for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e);return n}function nn(e,t,n,r){var o=null==e?0:e.length;for(r&&o&&(n=e[--o]);o--;)n=t(n,e[o],o,e);return n}function rn(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}var on=pn("length");function an(e,t,n){var r;return n(e,function(e,n,o){if(t(e,n,o))return r=n,!1}),r}function un(e,t,n,r){for(var o=e.length,i=n+(r?1:-1);r?i--:++i<o;)if(t(e[i],i,e))return i;return-1}function sn(e,t,n){return t==t?function(e,t,n){var r=n-1,o=e.length;for(;++r<o;)if(e[r]===t)return r;return-1}(e,t,n):un(e,cn,n)}function ln(e,t,n,r){for(var o=n-1,i=e.length;++o<i;)if(r(e[o],t))return o;return-1}function cn(e){return e!=e}function fn(e,t){var n=null==e?0:e.length;return n?vn(e,t)/n:I}function pn(e){return function(t){return null==t?i:t[e]}}function dn(e){return function(t){return null==e?i:e[t]}}function hn(e,t,n,r,o){return o(e,function(e,o,i){n=r?(r=!1,e):t(n,e,o,i)}),n}function vn(e,t){for(var n,r=-1,o=e.length;++r<o;){var a=t(e[r]);a!==i&&(n=n===i?a:n+a)}return n}function mn(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}function yn(e){return function(t){return e(t)}}function gn(e,t){return Zt(t,function(t){return e[t]})}function bn(e,t){return e.has(t)}function _n(e,t){for(var n=-1,r=e.length;++n<r&&sn(t,e[n],0)>-1;);return n}function wn(e,t){for(var n=e.length;n--&&sn(t,e[n],0)>-1;);return n}var En=dn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),xn=dn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function On(e){return"\\"+Pt[e]}function Cn(e){return Et.test(e)}function Sn(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function kn(e,t){return function(n){return e(t(n))}}function Pn(e,t){for(var n=-1,r=e.length,o=0,i=[];++n<r;){var a=e[n];a!==t&&a!==f||(e[n]=f,i[o++]=n)}return i}function jn(e,t){return"__proto__"==t?i:e[t]}function Tn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function Rn(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=[e,e]}),n}function Nn(e){return Cn(e)?function(e){var t=_t.lastIndex=0;for(;_t.test(e);)++t;return t}(e):on(e)}function Mn(e){return Cn(e)?function(e){return e.match(_t)||[]}(e):function(e){return e.split("")}(e)}var An=dn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var Dn=function e(t){var n,r=(t=null==t?Mt:Dn.defaults(Mt.Object(),t,Dn.pick(Mt,Ot))).Array,o=t.Date,Je=t.Error,Ze=t.Function,et=t.Math,tt=t.Object,nt=t.RegExp,rt=t.String,ot=t.TypeError,it=r.prototype,at=Ze.prototype,ut=tt.prototype,st=t["__core-js_shared__"],lt=at.toString,ct=ut.hasOwnProperty,ft=0,pt=(n=/[^.]+$/.exec(st&&st.keys&&st.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"",dt=ut.toString,ht=lt.call(tt),vt=Mt._,mt=nt("^"+lt.call(ct).replace(Ne,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),yt=It?t.Buffer:i,_t=t.Symbol,Et=t.Uint8Array,Pt=yt?yt.allocUnsafe:i,Rt=kn(tt.getPrototypeOf,tt),Nt=tt.create,At=ut.propertyIsEnumerable,Dt=it.splice,Lt=_t?_t.isConcatSpreadable:i,zt=_t?_t.iterator:i,on=_t?_t.toStringTag:i,dn=function(){try{var e=Fi(tt,"defineProperty");return e({},"",{}),e}catch(e){}}(),In=t.clearTimeout!==Mt.clearTimeout&&t.clearTimeout,Ln=o&&o.now!==Mt.Date.now&&o.now,zn=t.setTimeout!==Mt.setTimeout&&t.setTimeout,Un=et.ceil,Fn=et.floor,Bn=tt.getOwnPropertySymbols,Wn=yt?yt.isBuffer:i,qn=t.isFinite,Hn=it.join,$n=kn(tt.keys,tt),Vn=et.max,Yn=et.min,Gn=o.now,Kn=t.parseInt,Qn=et.random,Xn=it.reverse,Jn=Fi(t,"DataView"),Zn=Fi(t,"Map"),er=Fi(t,"Promise"),tr=Fi(t,"Set"),nr=Fi(t,"WeakMap"),rr=Fi(tt,"create"),or=nr&&new nr,ir={},ar=fa(Jn),ur=fa(Zn),sr=fa(er),lr=fa(tr),cr=fa(nr),fr=_t?_t.prototype:i,pr=fr?fr.valueOf:i,dr=fr?fr.toString:i;function hr(e){if(Pu(e)&&!yu(e)&&!(e instanceof gr)){if(e instanceof yr)return e;if(ct.call(e,"__wrapped__"))return pa(e)}return new yr(e)}var vr=function(){function e(){}return function(t){if(!ku(t))return{};if(Nt)return Nt(t);e.prototype=t;var n=new e;return e.prototype=i,n}}();function mr(){}function yr(e,t){this.__wrapped__=e,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=i}function gr(e){this.__wrapped__=e,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=L,this.__views__=[]}function br(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function _r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function wr(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Er(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new wr;++t<n;)this.add(e[t])}function xr(e){var t=this.__data__=new _r(e);this.size=t.size}function Or(e,t){var n=yu(e),r=!n&&mu(e),o=!n&&!r&&wu(e),i=!n&&!r&&!o&&Iu(e),a=n||r||o||i,u=a?mn(e.length,rt):[],s=u.length;for(var l in e)!t&&!ct.call(e,l)||a&&("length"==l||o&&("offset"==l||"parent"==l)||i&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||Yi(l,s))||u.push(l);return u}function Cr(e){var t=e.length;return t?e[xo(0,t-1)]:i}function Sr(e,t){return sa(oi(e),Dr(t,0,e.length))}function kr(e){return sa(oi(e))}function Pr(e,t,n){(n===i||du(e[t],n))&&(n!==i||t in e)||Mr(e,t,n)}function jr(e,t,n){var r=e[t];ct.call(e,t)&&du(r,n)&&(n!==i||t in e)||Mr(e,t,n)}function Tr(e,t){for(var n=e.length;n--;)if(du(e[n][0],t))return n;return-1}function Rr(e,t,n,r){return Fr(e,function(e,o,i){t(r,e,n(e),i)}),r}function Nr(e,t){return e&&ii(t,os(t),e)}function Mr(e,t,n){"__proto__"==t&&dn?dn(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}function Ar(e,t){for(var n=-1,o=t.length,a=r(o),u=null==e;++n<o;)a[n]=u?i:Zu(e,t[n]);return a}function Dr(e,t,n){return e==e&&(n!==i&&(e=e<=n?e:n),t!==i&&(e=e>=t?e:t)),e}function Ir(e,t,n,r,o,a){var u,s=t&p,l=t&d,c=t&h;if(n&&(u=o?n(e,r,o,a):n(e)),u!==i)return u;if(!ku(e))return e;var f=yu(e);if(f){if(u=function(e){var t=e.length,n=new e.constructor(t);return t&&"string"==typeof e[0]&&ct.call(e,"index")&&(n.index=e.index,n.input=e.input),n}(e),!s)return oi(e,u)}else{var v=qi(e),m=v==G||v==K;if(wu(e))return Jo(e,s);if(v==Z||v==B||m&&!o){if(u=l||m?{}:$i(e),!s)return l?function(e,t){return ii(e,Wi(e),t)}(e,function(e,t){return e&&ii(t,is(t),e)}(u,e)):function(e,t){return ii(e,Bi(e),t)}(e,Nr(u,e))}else{if(!kt[v])return o?e:{};u=function(e,t,n){var r,o,i,a=e.constructor;switch(t){case se:return Zo(e);case H:case $:return new a(+e);case le:return function(e,t){var n=t?Zo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}(e,n);case ce:case fe:case pe:case de:case he:case ve:case me:case ye:case ge:return ei(e,n);case Q:return new a;case X:case re:return new a(e);case te:return(i=new(o=e).constructor(o.source,qe.exec(o))).lastIndex=o.lastIndex,i;case ne:return new a;case oe:return r=e,pr?tt(pr.call(r)):{}}}(e,v,s)}}a||(a=new xr);var y=a.get(e);if(y)return y;if(a.set(e,u),Mu(e))return e.forEach(function(r){u.add(Ir(r,t,n,r,e,a))}),u;if(ju(e))return e.forEach(function(r,o){u.set(o,Ir(r,t,n,o,e,a))}),u;var g=f?i:(c?l?Mi:Ni:l?is:os)(e);return Yt(g||e,function(r,o){g&&(r=e[o=r]),jr(u,o,Ir(r,t,n,o,e,a))}),u}function Lr(e,t,n){var r=n.length;if(null==e)return!r;for(e=tt(e);r--;){var o=n[r],a=t[o],u=e[o];if(u===i&&!(o in e)||!a(u))return!1}return!0}function zr(e,t,n){if("function"!=typeof e)throw new ot(s);return oa(function(){e.apply(i,n)},t)}function Ur(e,t,n,r){var o=-1,i=Xt,u=!0,s=e.length,l=[],c=t.length;if(!s)return l;n&&(t=Zt(t,yn(n))),r?(i=Jt,u=!1):t.length>=a&&(i=bn,u=!1,t=new Er(t));e:for(;++o<s;){var f=e[o],p=null==n?f:n(f);if(f=r||0!==f?f:0,u&&p==p){for(var d=c;d--;)if(t[d]===p)continue e;l.push(f)}else i(t,p,r)||l.push(f)}return l}hr.templateSettings={escape:Se,evaluate:ke,interpolate:Pe,variable:"",imports:{_:hr}},hr.prototype=mr.prototype,hr.prototype.constructor=hr,yr.prototype=vr(mr.prototype),yr.prototype.constructor=yr,gr.prototype=vr(mr.prototype),gr.prototype.constructor=gr,br.prototype.clear=function(){this.__data__=rr?rr(null):{},this.size=0},br.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},br.prototype.get=function(e){var t=this.__data__;if(rr){var n=t[e];return n===l?i:n}return ct.call(t,e)?t[e]:i},br.prototype.has=function(e){var t=this.__data__;return rr?t[e]!==i:ct.call(t,e)},br.prototype.set=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=rr&&t===i?l:t,this},_r.prototype.clear=function(){this.__data__=[],this.size=0},_r.prototype.delete=function(e){var t=this.__data__,n=Tr(t,e);return!(n<0||(n==t.length-1?t.pop():Dt.call(t,n,1),--this.size,0))},_r.prototype.get=function(e){var t=this.__data__,n=Tr(t,e);return n<0?i:t[n][1]},_r.prototype.has=function(e){return Tr(this.__data__,e)>-1},_r.prototype.set=function(e,t){var n=this.__data__,r=Tr(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this},wr.prototype.clear=function(){this.size=0,this.__data__={hash:new br,map:new(Zn||_r),string:new br}},wr.prototype.delete=function(e){var t=zi(this,e).delete(e);return this.size-=t?1:0,t},wr.prototype.get=function(e){return zi(this,e).get(e)},wr.prototype.has=function(e){return zi(this,e).has(e)},wr.prototype.set=function(e,t){var n=zi(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this},Er.prototype.add=Er.prototype.push=function(e){return this.__data__.set(e,l),this},Er.prototype.has=function(e){return this.__data__.has(e)},xr.prototype.clear=function(){this.__data__=new _r,this.size=0},xr.prototype.delete=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n},xr.prototype.get=function(e){return this.__data__.get(e)},xr.prototype.has=function(e){return this.__data__.has(e)},xr.prototype.set=function(e,t){var n=this.__data__;if(n instanceof _r){var r=n.__data__;if(!Zn||r.length<a-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new wr(r)}return n.set(e,t),this.size=n.size,this};var Fr=si(Gr),Br=si(Kr,!0);function Wr(e,t){var n=!0;return Fr(e,function(e,r,o){return n=!!t(e,r,o)}),n}function qr(e,t,n){for(var r=-1,o=e.length;++r<o;){var a=e[r],u=t(a);if(null!=u&&(s===i?u==u&&!Du(u):n(u,s)))var s=u,l=a}return l}function Hr(e,t){var n=[];return Fr(e,function(e,r,o){t(e,r,o)&&n.push(e)}),n}function $r(e,t,n,r,o){var i=-1,a=e.length;for(n||(n=Vi),o||(o=[]);++i<a;){var u=e[i];t>0&&n(u)?t>1?$r(u,t-1,n,r,o):en(o,u):r||(o[o.length]=u)}return o}var Vr=li(),Yr=li(!0);function Gr(e,t){return e&&Vr(e,t,os)}function Kr(e,t){return e&&Yr(e,t,os)}function Qr(e,t){return Qt(t,function(t){return Ou(e[t])})}function Xr(e,t){for(var n=0,r=(t=Go(t,e)).length;null!=e&&n<r;)e=e[ca(t[n++])];return n&&n==r?e:i}function Jr(e,t,n){var r=t(e);return yu(e)?r:en(r,n(e))}function Zr(e){return null==e?e===i?ie:J:on&&on in tt(e)?function(e){var t=ct.call(e,on),n=e[on];try{e[on]=i;var r=!0}catch(e){}var o=dt.call(e);return r&&(t?e[on]=n:delete e[on]),o}(e):function(e){return dt.call(e)}(e)}function eo(e,t){return e>t}function to(e,t){return null!=e&&ct.call(e,t)}function no(e,t){return null!=e&&t in tt(e)}function ro(e,t,n){for(var o=n?Jt:Xt,a=e[0].length,u=e.length,s=u,l=r(u),c=1/0,f=[];s--;){var p=e[s];s&&t&&(p=Zt(p,yn(t))),c=Yn(p.length,c),l[s]=!n&&(t||a>=120&&p.length>=120)?new Er(s&&p):i}p=e[0];var d=-1,h=l[0];e:for(;++d<a&&f.length<c;){var v=p[d],m=t?t(v):v;if(v=n||0!==v?v:0,!(h?bn(h,m):o(f,m,n))){for(s=u;--s;){var y=l[s];if(!(y?bn(y,m):o(e[s],m,n)))continue e}h&&h.push(m),f.push(v)}}return f}function oo(e,t,n){var r=null==(e=na(e,t=Go(t,e)))?e:e[ca(xa(t))];return null==r?i:$t(r,e,n)}function io(e){return Pu(e)&&Zr(e)==B}function ao(e,t,n,r,o){return e===t||(null==e||null==t||!Pu(e)&&!Pu(t)?e!=e&&t!=t:function(e,t,n,r,o,a){var u=yu(e),s=yu(t),l=u?W:qi(e),c=s?W:qi(t),f=(l=l==B?Z:l)==Z,p=(c=c==B?Z:c)==Z,d=l==c;if(d&&wu(e)){if(!wu(t))return!1;u=!0,f=!1}if(d&&!f)return a||(a=new xr),u||Iu(e)?Ti(e,t,n,r,o,a):function(e,t,n,r,o,i,a){switch(n){case le:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case se:return!(e.byteLength!=t.byteLength||!i(new Et(e),new Et(t)));case H:case $:case X:return du(+e,+t);case Y:return e.name==t.name&&e.message==t.message;case te:case re:return e==t+"";case Q:var u=Sn;case ne:var s=r&v;if(u||(u=Tn),e.size!=t.size&&!s)return!1;var l=a.get(e);if(l)return l==t;r|=m,a.set(e,t);var c=Ti(u(e),u(t),r,o,i,a);return a.delete(e),c;case oe:if(pr)return pr.call(e)==pr.call(t)}return!1}(e,t,l,n,r,o,a);if(!(n&v)){var h=f&&ct.call(e,"__wrapped__"),y=p&&ct.call(t,"__wrapped__");if(h||y){var g=h?e.value():e,b=y?t.value():t;return a||(a=new xr),o(g,b,n,r,a)}}return!!d&&(a||(a=new xr),function(e,t,n,r,o,a){var u=n&v,s=Ni(e),l=s.length,c=Ni(t).length;if(l!=c&&!u)return!1;for(var f=l;f--;){var p=s[f];if(!(u?p in t:ct.call(t,p)))return!1}var d=a.get(e);if(d&&a.get(t))return d==t;var h=!0;a.set(e,t),a.set(t,e);for(var m=u;++f<l;){p=s[f];var y=e[p],g=t[p];if(r)var b=u?r(g,y,p,t,e,a):r(y,g,p,e,t,a);if(!(b===i?y===g||o(y,g,n,r,a):b)){h=!1;break}m||(m="constructor"==p)}if(h&&!m){var _=e.constructor,w=t.constructor;_!=w&&"constructor"in e&&"constructor"in t&&!("function"==typeof _&&_ instanceof _&&"function"==typeof w&&w instanceof w)&&(h=!1)}return a.delete(e),a.delete(t),h}(e,t,n,r,o,a))}(e,t,n,r,ao,o))}function uo(e,t,n,r){var o=n.length,a=o,u=!r;if(null==e)return!a;for(e=tt(e);o--;){var s=n[o];if(u&&s[2]?s[1]!==e[s[0]]:!(s[0]in e))return!1}for(;++o<a;){var l=(s=n[o])[0],c=e[l],f=s[1];if(u&&s[2]){if(c===i&&!(l in e))return!1}else{var p=new xr;if(r)var d=r(c,f,l,e,t,p);if(!(d===i?ao(f,c,v|m,r,p):d))return!1}}return!0}function so(e){return!(!ku(e)||pt&&pt in e)&&(Ou(e)?mt:Ve).test(fa(e))}function lo(e){return"function"==typeof e?e:null==e?Ts:"object"==typeof e?yu(e)?mo(e[0],e[1]):vo(e):Us(e)}function co(e){if(!Ji(e))return $n(e);var t=[];for(var n in tt(e))ct.call(e,n)&&"constructor"!=n&&t.push(n);return t}function fo(e){if(!ku(e))return function(e){var t=[];if(null!=e)for(var n in tt(e))t.push(n);return t}(e);var t=Ji(e),n=[];for(var r in e)("constructor"!=r||!t&&ct.call(e,r))&&n.push(r);return n}function po(e,t){return e<t}function ho(e,t){var n=-1,o=bu(e)?r(e.length):[];return Fr(e,function(e,r,i){o[++n]=t(e,r,i)}),o}function vo(e){var t=Ui(e);return 1==t.length&&t[0][2]?ea(t[0][0],t[0][1]):function(n){return n===e||uo(n,e,t)}}function mo(e,t){return Ki(e)&&Zi(t)?ea(ca(e),t):function(n){var r=Zu(n,e);return r===i&&r===t?es(n,e):ao(t,r,v|m)}}function yo(e,t,n,r,o){e!==t&&Vr(t,function(a,u){if(ku(a))o||(o=new xr),function(e,t,n,r,o,a,u){var s=jn(e,n),l=jn(t,n),c=u.get(l);if(c)Pr(e,n,c);else{var f=a?a(s,l,n+"",e,t,u):i,p=f===i;if(p){var d=yu(l),h=!d&&wu(l),v=!d&&!h&&Iu(l);f=l,d||h||v?yu(s)?f=s:_u(s)?f=oi(s):h?(p=!1,f=Jo(l,!0)):v?(p=!1,f=ei(l,!0)):f=[]:Ru(l)||mu(l)?(f=s,mu(s)?f=Hu(s):(!ku(s)||r&&Ou(s))&&(f=$i(l))):p=!1}p&&(u.set(l,f),o(f,l,r,a,u),u.delete(l)),Pr(e,n,f)}}(e,t,u,n,yo,r,o);else{var s=r?r(jn(e,u),a,u+"",e,t,o):i;s===i&&(s=a),Pr(e,u,s)}},is)}function go(e,t){var n=e.length;if(n)return Yi(t+=t<0?n:0,n)?e[t]:i}function bo(e,t,n){var r=-1;return t=Zt(t.length?t:[Ts],yn(Li())),function(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}(ho(e,function(e,n,o){return{criteria:Zt(t,function(t){return t(e)}),index:++r,value:e}}),function(e,t){return function(e,t,n){for(var r=-1,o=e.criteria,i=t.criteria,a=o.length,u=n.length;++r<a;){var s=ti(o[r],i[r]);if(s){if(r>=u)return s;var l=n[r];return s*("desc"==l?-1:1)}}return e.index-t.index}(e,t,n)})}function _o(e,t,n){for(var r=-1,o=t.length,i={};++r<o;){var a=t[r],u=Xr(e,a);n(u,a)&&Po(i,Go(a,e),u)}return i}function wo(e,t,n,r){var o=r?ln:sn,i=-1,a=t.length,u=e;for(e===t&&(t=oi(t)),n&&(u=Zt(e,yn(n)));++i<a;)for(var s=0,l=t[i],c=n?n(l):l;(s=o(u,c,s,r))>-1;)u!==e&&Dt.call(u,s,1),Dt.call(e,s,1);return e}function Eo(e,t){for(var n=e?t.length:0,r=n-1;n--;){var o=t[n];if(n==r||o!==i){var i=o;Yi(o)?Dt.call(e,o,1):Fo(e,o)}}return e}function xo(e,t){return e+Fn(Qn()*(t-e+1))}function Oo(e,t){var n="";if(!e||t<1||t>A)return n;do{t%2&&(n+=e),(t=Fn(t/2))&&(e+=e)}while(t);return n}function Co(e,t){return ia(ta(e,t,Ts),e+"")}function So(e){return Cr(ds(e))}function ko(e,t){var n=ds(e);return sa(n,Dr(t,0,n.length))}function Po(e,t,n,r){if(!ku(e))return e;for(var o=-1,a=(t=Go(t,e)).length,u=a-1,s=e;null!=s&&++o<a;){var l=ca(t[o]),c=n;if(o!=u){var f=s[l];(c=r?r(f,l,s):i)===i&&(c=ku(f)?f:Yi(t[o+1])?[]:{})}jr(s,l,c),s=s[l]}return e}var jo=or?function(e,t){return or.set(e,t),e}:Ts,To=dn?function(e,t){return dn(e,"toString",{configurable:!0,enumerable:!1,value:ks(t),writable:!0})}:Ts;function Ro(e){return sa(ds(e))}function No(e,t,n){var o=-1,i=e.length;t<0&&(t=-t>i?0:i+t),(n=n>i?i:n)<0&&(n+=i),i=t>n?0:n-t>>>0,t>>>=0;for(var a=r(i);++o<i;)a[o]=e[o+t];return a}function Mo(e,t){var n;return Fr(e,function(e,r,o){return!(n=t(e,r,o))}),!!n}function Ao(e,t,n){var r=0,o=null==e?r:e.length;if("number"==typeof t&&t==t&&o<=U){for(;r<o;){var i=r+o>>>1,a=e[i];null!==a&&!Du(a)&&(n?a<=t:a<t)?r=i+1:o=i}return o}return Do(e,t,Ts,n)}function Do(e,t,n,r){t=n(t);for(var o=0,a=null==e?0:e.length,u=t!=t,s=null===t,l=Du(t),c=t===i;o<a;){var f=Fn((o+a)/2),p=n(e[f]),d=p!==i,h=null===p,v=p==p,m=Du(p);if(u)var y=r||v;else y=c?v&&(r||d):s?v&&d&&(r||!h):l?v&&d&&!h&&(r||!m):!h&&!m&&(r?p<=t:p<t);y?o=f+1:a=f}return Yn(a,z)}function Io(e,t){for(var n=-1,r=e.length,o=0,i=[];++n<r;){var a=e[n],u=t?t(a):a;if(!n||!du(u,s)){var s=u;i[o++]=0===a?0:a}}return i}function Lo(e){return"number"==typeof e?e:Du(e)?I:+e}function zo(e){if("string"==typeof e)return e;if(yu(e))return Zt(e,zo)+"";if(Du(e))return dr?dr.call(e):"";var t=e+"";return"0"==t&&1/e==-M?"-0":t}function Uo(e,t,n){var r=-1,o=Xt,i=e.length,u=!0,s=[],l=s;if(n)u=!1,o=Jt;else if(i>=a){var c=t?null:Oi(e);if(c)return Tn(c);u=!1,o=bn,l=new Er}else l=t?[]:s;e:for(;++r<i;){var f=e[r],p=t?t(f):f;if(f=n||0!==f?f:0,u&&p==p){for(var d=l.length;d--;)if(l[d]===p)continue e;t&&l.push(p),s.push(f)}else o(l,p,n)||(l!==s&&l.push(p),s.push(f))}return s}function Fo(e,t){return null==(e=na(e,t=Go(t,e)))||delete e[ca(xa(t))]}function Bo(e,t,n,r){return Po(e,t,n(Xr(e,t)),r)}function Wo(e,t,n,r){for(var o=e.length,i=r?o:-1;(r?i--:++i<o)&&t(e[i],i,e););return n?No(e,r?0:i,r?i+1:o):No(e,r?i+1:0,r?o:i)}function qo(e,t){var n=e;return n instanceof gr&&(n=n.value()),tn(t,function(e,t){return t.func.apply(t.thisArg,en([e],t.args))},n)}function Ho(e,t,n){var o=e.length;if(o<2)return o?Uo(e[0]):[];for(var i=-1,a=r(o);++i<o;)for(var u=e[i],s=-1;++s<o;)s!=i&&(a[i]=Ur(a[i]||u,e[s],t,n));return Uo($r(a,1),t,n)}function $o(e,t,n){for(var r=-1,o=e.length,a=t.length,u={};++r<o;){var s=r<a?t[r]:i;n(u,e[r],s)}return u}function Vo(e){return _u(e)?e:[]}function Yo(e){return"function"==typeof e?e:Ts}function Go(e,t){return yu(e)?e:Ki(e,t)?[e]:la($u(e))}var Ko=Co;function Qo(e,t,n){var r=e.length;return n=n===i?r:n,!t&&n>=r?e:No(e,t,n)}var Xo=In||function(e){return Mt.clearTimeout(e)};function Jo(e,t){if(t)return e.slice();var n=e.length,r=Pt?Pt(n):new e.constructor(n);return e.copy(r),r}function Zo(e){var t=new e.constructor(e.byteLength);return new Et(t).set(new Et(e)),t}function ei(e,t){var n=t?Zo(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}function ti(e,t){if(e!==t){var n=e!==i,r=null===e,o=e==e,a=Du(e),u=t!==i,s=null===t,l=t==t,c=Du(t);if(!s&&!c&&!a&&e>t||a&&u&&l&&!s&&!c||r&&u&&l||!n&&l||!o)return 1;if(!r&&!a&&!c&&e<t||c&&n&&o&&!r&&!a||s&&n&&o||!u&&o||!l)return-1}return 0}function ni(e,t,n,o){for(var i=-1,a=e.length,u=n.length,s=-1,l=t.length,c=Vn(a-u,0),f=r(l+c),p=!o;++s<l;)f[s]=t[s];for(;++i<u;)(p||i<a)&&(f[n[i]]=e[i]);for(;c--;)f[s++]=e[i++];return f}function ri(e,t,n,o){for(var i=-1,a=e.length,u=-1,s=n.length,l=-1,c=t.length,f=Vn(a-s,0),p=r(f+c),d=!o;++i<f;)p[i]=e[i];for(var h=i;++l<c;)p[h+l]=t[l];for(;++u<s;)(d||i<a)&&(p[h+n[u]]=e[i++]);return p}function oi(e,t){var n=-1,o=e.length;for(t||(t=r(o));++n<o;)t[n]=e[n];return t}function ii(e,t,n,r){var o=!n;n||(n={});for(var a=-1,u=t.length;++a<u;){var s=t[a],l=r?r(n[s],e[s],s,n,e):i;l===i&&(l=e[s]),o?Mr(n,s,l):jr(n,s,l)}return n}function ai(e,t){return function(n,r){var o=yu(n)?Vt:Rr,i=t?t():{};return o(n,e,Li(r,2),i)}}function ui(e){return Co(function(t,n){var r=-1,o=n.length,a=o>1?n[o-1]:i,u=o>2?n[2]:i;for(a=e.length>3&&"function"==typeof a?(o--,a):i,u&&Gi(n[0],n[1],u)&&(a=o<3?i:a,o=1),t=tt(t);++r<o;){var s=n[r];s&&e(t,s,r,a)}return t})}function si(e,t){return function(n,r){if(null==n)return n;if(!bu(n))return e(n,r);for(var o=n.length,i=t?o:-1,a=tt(n);(t?i--:++i<o)&&!1!==r(a[i],i,a););return n}}function li(e){return function(t,n,r){for(var o=-1,i=tt(t),a=r(t),u=a.length;u--;){var s=a[e?u:++o];if(!1===n(i[s],s,i))break}return t}}function ci(e){return function(t){var n=Cn(t=$u(t))?Mn(t):i,r=n?n[0]:t.charAt(0),o=n?Qo(n,1).join(""):t.slice(1);return r[e]()+o}}function fi(e){return function(t){return tn(Os(ms(t).replace(gt,"")),e,"")}}function pi(e){return function(){var t=arguments;switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3]);case 5:return new e(t[0],t[1],t[2],t[3],t[4]);case 6:return new e(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new e(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var n=vr(e.prototype),r=e.apply(n,t);return ku(r)?r:n}}function di(e){return function(t,n,r){var o=tt(t);if(!bu(t)){var a=Li(n,3);t=os(t),n=function(e){return a(o[e],e,o)}}var u=e(t,n,r);return u>-1?o[a?t[u]:u]:i}}function hi(e){return Ri(function(t){var n=t.length,r=n,o=yr.prototype.thru;for(e&&t.reverse();r--;){var a=t[r];if("function"!=typeof a)throw new ot(s);if(o&&!u&&"wrapper"==Di(a))var u=new yr([],!0)}for(r=u?r:n;++r<n;){var l=Di(a=t[r]),c="wrapper"==l?Ai(a):i;u=c&&Qi(c[0])&&c[1]==(O|_|E|C)&&!c[4].length&&1==c[9]?u[Di(c[0])].apply(u,c[3]):1==a.length&&Qi(a)?u[l]():u.thru(a)}return function(){var e=arguments,r=e[0];if(u&&1==e.length&&yu(r))return u.plant(r).value();for(var o=0,i=n?t[o].apply(this,e):r;++o<n;)i=t[o].call(this,i);return i}})}function vi(e,t,n,o,a,u,s,l,c,f){var p=t&O,d=t&y,h=t&g,v=t&(_|w),m=t&S,b=h?i:pi(e);return function y(){for(var g=arguments.length,_=r(g),w=g;w--;)_[w]=arguments[w];if(v)var E=Ii(y),x=function(e,t){for(var n=e.length,r=0;n--;)e[n]===t&&++r;return r}(_,E);if(o&&(_=ni(_,o,a,v)),u&&(_=ri(_,u,s,v)),g-=x,v&&g<f){var O=Pn(_,E);return Ei(e,t,vi,y.placeholder,n,_,O,l,c,f-g)}var C=d?n:this,S=h?C[e]:e;return g=_.length,l?_=function(e,t){for(var n=e.length,r=Yn(t.length,n),o=oi(e);r--;){var a=t[r];e[r]=Yi(a,n)?o[a]:i}return e}(_,l):m&&g>1&&_.reverse(),p&&c<g&&(_.length=c),this&&this!==Mt&&this instanceof y&&(S=b||pi(S)),S.apply(C,_)}}function mi(e,t){return function(n,r){return function(e,t,n,r){return Gr(e,function(e,o,i){t(r,n(e),o,i)}),r}(n,e,t(r),{})}}function yi(e,t){return function(n,r){var o;if(n===i&&r===i)return t;if(n!==i&&(o=n),r!==i){if(o===i)return r;"string"==typeof n||"string"==typeof r?(n=zo(n),r=zo(r)):(n=Lo(n),r=Lo(r)),o=e(n,r)}return o}}function gi(e){return Ri(function(t){return t=Zt(t,yn(Li())),Co(function(n){var r=this;return e(t,function(e){return $t(e,r,n)})})})}function bi(e,t){var n=(t=t===i?" ":zo(t)).length;if(n<2)return n?Oo(t,e):t;var r=Oo(t,Un(e/Nn(t)));return Cn(t)?Qo(Mn(r),0,e).join(""):r.slice(0,e)}function _i(e){return function(t,n,o){return o&&"number"!=typeof o&&Gi(t,n,o)&&(n=o=i),t=Fu(t),n===i?(n=t,t=0):n=Fu(n),function(e,t,n,o){for(var i=-1,a=Vn(Un((t-e)/(n||1)),0),u=r(a);a--;)u[o?a:++i]=e,e+=n;return u}(t,n,o=o===i?t<n?1:-1:Fu(o),e)}}function wi(e){return function(t,n){return"string"==typeof t&&"string"==typeof n||(t=qu(t),n=qu(n)),e(t,n)}}function Ei(e,t,n,r,o,a,u,s,l,c){var f=t&_;t|=f?E:x,(t&=~(f?x:E))&b||(t&=~(y|g));var p=[e,t,o,f?a:i,f?u:i,f?i:a,f?i:u,s,l,c],d=n.apply(i,p);return Qi(e)&&ra(d,p),d.placeholder=r,aa(d,e,t)}function xi(e){var t=et[e];return function(e,n){if(e=qu(e),n=null==n?0:Yn(Bu(n),292)){var r=($u(e)+"e").split("e");return+((r=($u(t(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return t(e)}}var Oi=tr&&1/Tn(new tr([,-0]))[1]==M?function(e){return new tr(e)}:Ds;function Ci(e){return function(t){var n=qi(t);return n==Q?Sn(t):n==ne?Rn(t):function(e,t){return Zt(t,function(t){return[t,e[t]]})}(t,e(t))}}function Si(e,t,n,o,a,u,l,c){var p=t&g;if(!p&&"function"!=typeof e)throw new ot(s);var d=o?o.length:0;if(d||(t&=~(E|x),o=a=i),l=l===i?l:Vn(Bu(l),0),c=c===i?c:Bu(c),d-=a?a.length:0,t&x){var h=o,v=a;o=a=i}var m=p?i:Ai(e),S=[e,t,n,o,a,h,v,u,l,c];if(m&&function(e,t){var n=e[1],r=t[1],o=n|r,i=o<(y|g|O),a=r==O&&n==_||r==O&&n==C&&e[7].length<=t[8]||r==(O|C)&&t[7].length<=t[8]&&n==_;if(!i&&!a)return e;r&y&&(e[2]=t[2],o|=n&y?0:b);var u=t[3];if(u){var s=e[3];e[3]=s?ni(s,u,t[4]):u,e[4]=s?Pn(e[3],f):t[4]}(u=t[5])&&(s=e[5],e[5]=s?ri(s,u,t[6]):u,e[6]=s?Pn(e[5],f):t[6]),(u=t[7])&&(e[7]=u),r&O&&(e[8]=null==e[8]?t[8]:Yn(e[8],t[8])),null==e[9]&&(e[9]=t[9]),e[0]=t[0],e[1]=o}(S,m),e=S[0],t=S[1],n=S[2],o=S[3],a=S[4],!(c=S[9]=S[9]===i?p?0:e.length:Vn(S[9]-d,0))&&t&(_|w)&&(t&=~(_|w)),t&&t!=y)k=t==_||t==w?function(e,t,n){var o=pi(e);return function a(){for(var u=arguments.length,s=r(u),l=u,c=Ii(a);l--;)s[l]=arguments[l];var f=u<3&&s[0]!==c&&s[u-1]!==c?[]:Pn(s,c);return(u-=f.length)<n?Ei(e,t,vi,a.placeholder,i,s,f,i,i,n-u):$t(this&&this!==Mt&&this instanceof a?o:e,this,s)}}(e,t,c):t!=E&&t!=(y|E)||a.length?vi.apply(i,S):function(e,t,n,o){var i=t&y,a=pi(e);return function t(){for(var u=-1,s=arguments.length,l=-1,c=o.length,f=r(c+s),p=this&&this!==Mt&&this instanceof t?a:e;++l<c;)f[l]=o[l];for(;s--;)f[l++]=arguments[++u];return $t(p,i?n:this,f)}}(e,t,n,o);else var k=function(e,t,n){var r=t&y,o=pi(e);return function t(){return(this&&this!==Mt&&this instanceof t?o:e).apply(r?n:this,arguments)}}(e,t,n);return aa((m?jo:ra)(k,S),e,t)}function ki(e,t,n,r){return e===i||du(e,ut[n])&&!ct.call(r,n)?t:e}function Pi(e,t,n,r,o,a){return ku(e)&&ku(t)&&(a.set(t,e),yo(e,t,i,Pi,a),a.delete(t)),e}function ji(e){return Ru(e)?i:e}function Ti(e,t,n,r,o,a){var u=n&v,s=e.length,l=t.length;if(s!=l&&!(u&&l>s))return!1;var c=a.get(e);if(c&&a.get(t))return c==t;var f=-1,p=!0,d=n&m?new Er:i;for(a.set(e,t),a.set(t,e);++f<s;){var h=e[f],y=t[f];if(r)var g=u?r(y,h,f,t,e,a):r(h,y,f,e,t,a);if(g!==i){if(g)continue;p=!1;break}if(d){if(!rn(t,function(e,t){if(!bn(d,t)&&(h===e||o(h,e,n,r,a)))return d.push(t)})){p=!1;break}}else if(h!==y&&!o(h,y,n,r,a)){p=!1;break}}return a.delete(e),a.delete(t),p}function Ri(e){return ia(ta(e,i,ga),e+"")}function Ni(e){return Jr(e,os,Bi)}function Mi(e){return Jr(e,is,Wi)}var Ai=or?function(e){return or.get(e)}:Ds;function Di(e){for(var t=e.name+"",n=ir[t],r=ct.call(ir,t)?n.length:0;r--;){var o=n[r],i=o.func;if(null==i||i==e)return o.name}return t}function Ii(e){return(ct.call(hr,"placeholder")?hr:e).placeholder}function Li(){var e=hr.iteratee||Rs;return e=e===Rs?lo:e,arguments.length?e(arguments[0],arguments[1]):e}function zi(e,t){var n,r,o=e.__data__;return("string"==(r=typeof(n=t))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof t?"string":"hash"]:o.map}function Ui(e){for(var t=os(e),n=t.length;n--;){var r=t[n],o=e[r];t[n]=[r,o,Zi(o)]}return t}function Fi(e,t){var n=function(e,t){return null==e?i:e[t]}(e,t);return so(n)?n:i}var Bi=Bn?function(e){return null==e?[]:(e=tt(e),Qt(Bn(e),function(t){return At.call(e,t)}))}:Ws,Wi=Bn?function(e){for(var t=[];e;)en(t,Bi(e)),e=Rt(e);return t}:Ws,qi=Zr;function Hi(e,t,n){for(var r=-1,o=(t=Go(t,e)).length,i=!1;++r<o;){var a=ca(t[r]);if(!(i=null!=e&&n(e,a)))break;e=e[a]}return i||++r!=o?i:!!(o=null==e?0:e.length)&&Su(o)&&Yi(a,o)&&(yu(e)||mu(e))}function $i(e){return"function"!=typeof e.constructor||Ji(e)?{}:vr(Rt(e))}function Vi(e){return yu(e)||mu(e)||!!(Lt&&e&&e[Lt])}function Yi(e,t){var n=typeof e;return!!(t=null==t?A:t)&&("number"==n||"symbol"!=n&&Ge.test(e))&&e>-1&&e%1==0&&e<t}function Gi(e,t,n){if(!ku(n))return!1;var r=typeof t;return!!("number"==r?bu(n)&&Yi(t,n.length):"string"==r&&t in n)&&du(n[t],e)}function Ki(e,t){if(yu(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!Du(e))||Te.test(e)||!je.test(e)||null!=t&&e in tt(t)}function Qi(e){var t=Di(e),n=hr[t];if("function"!=typeof n||!(t in gr.prototype))return!1;if(e===n)return!0;var r=Ai(n);return!!r&&e===r[0]}(Jn&&qi(new Jn(new ArrayBuffer(1)))!=le||Zn&&qi(new Zn)!=Q||er&&"[object Promise]"!=qi(er.resolve())||tr&&qi(new tr)!=ne||nr&&qi(new nr)!=ae)&&(qi=function(e){var t=Zr(e),n=t==Z?e.constructor:i,r=n?fa(n):"";if(r)switch(r){case ar:return le;case ur:return Q;case sr:return"[object Promise]";case lr:return ne;case cr:return ae}return t});var Xi=st?Ou:qs;function Ji(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||ut)}function Zi(e){return e==e&&!ku(e)}function ea(e,t){return function(n){return null!=n&&n[e]===t&&(t!==i||e in tt(n))}}function ta(e,t,n){return t=Vn(t===i?e.length-1:t,0),function(){for(var o=arguments,i=-1,a=Vn(o.length-t,0),u=r(a);++i<a;)u[i]=o[t+i];i=-1;for(var s=r(t+1);++i<t;)s[i]=o[i];return s[t]=n(u),$t(e,this,s)}}function na(e,t){return t.length<2?e:Xr(e,No(t,0,-1))}var ra=ua(jo),oa=zn||function(e,t){return Mt.setTimeout(e,t)},ia=ua(To);function aa(e,t,n){var r=t+"";return ia(e,function(e,t){var n=t.length;if(!n)return e;var r=n-1;return t[r]=(n>1?"& ":"")+t[r],t=t.join(n>2?", ":" "),e.replace(Le,"{\n/* [wrapped with "+t+"] */\n")}(r,function(e,t){return Yt(F,function(n){var r="_."+n[0];t&n[1]&&!Xt(e,r)&&e.push(r)}),e.sort()}(function(e){var t=e.match(ze);return t?t[1].split(Ue):[]}(r),n)))}function ua(e){var t=0,n=0;return function(){var r=Gn(),o=T-(r-n);if(n=r,o>0){if(++t>=j)return arguments[0]}else t=0;return e.apply(i,arguments)}}function sa(e,t){var n=-1,r=e.length,o=r-1;for(t=t===i?r:t;++n<t;){var a=xo(n,o),u=e[a];e[a]=e[n],e[n]=u}return e.length=t,e}var la=function(e){var t=uu(e,function(e){return n.size===c&&n.clear(),e}),n=t.cache;return t}(function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(Re,function(e,n,r,o){t.push(r?o.replace(Be,"$1"):n||e)}),t});function ca(e){if("string"==typeof e||Du(e))return e;var t=e+"";return"0"==t&&1/e==-M?"-0":t}function fa(e){if(null!=e){try{return lt.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function pa(e){if(e instanceof gr)return e.clone();var t=new yr(e.__wrapped__,e.__chain__);return t.__actions__=oi(e.__actions__),t.__index__=e.__index__,t.__values__=e.__values__,t}var da=Co(function(e,t){return _u(e)?Ur(e,$r(t,1,_u,!0)):[]}),ha=Co(function(e,t){var n=xa(t);return _u(n)&&(n=i),_u(e)?Ur(e,$r(t,1,_u,!0),Li(n,2)):[]}),va=Co(function(e,t){var n=xa(t);return _u(n)&&(n=i),_u(e)?Ur(e,$r(t,1,_u,!0),i,n):[]});function ma(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Bu(n);return o<0&&(o=Vn(r+o,0)),un(e,Li(t,3),o)}function ya(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r-1;return n!==i&&(o=Bu(n),o=n<0?Vn(r+o,0):Yn(o,r-1)),un(e,Li(t,3),o,!0)}function ga(e){return null!=e&&e.length?$r(e,1):[]}function ba(e){return e&&e.length?e[0]:i}var _a=Co(function(e){var t=Zt(e,Vo);return t.length&&t[0]===e[0]?ro(t):[]}),wa=Co(function(e){var t=xa(e),n=Zt(e,Vo);return t===xa(n)?t=i:n.pop(),n.length&&n[0]===e[0]?ro(n,Li(t,2)):[]}),Ea=Co(function(e){var t=xa(e),n=Zt(e,Vo);return(t="function"==typeof t?t:i)&&n.pop(),n.length&&n[0]===e[0]?ro(n,i,t):[]});function xa(e){var t=null==e?0:e.length;return t?e[t-1]:i}var Oa=Co(Ca);function Ca(e,t){return e&&e.length&&t&&t.length?wo(e,t):e}var Sa=Ri(function(e,t){var n=null==e?0:e.length,r=Ar(e,t);return Eo(e,Zt(t,function(e){return Yi(e,n)?+e:e}).sort(ti)),r});function ka(e){return null==e?e:Xn.call(e)}var Pa=Co(function(e){return Uo($r(e,1,_u,!0))}),ja=Co(function(e){var t=xa(e);return _u(t)&&(t=i),Uo($r(e,1,_u,!0),Li(t,2))}),Ta=Co(function(e){var t=xa(e);return t="function"==typeof t?t:i,Uo($r(e,1,_u,!0),i,t)});function Ra(e){if(!e||!e.length)return[];var t=0;return e=Qt(e,function(e){if(_u(e))return t=Vn(e.length,t),!0}),mn(t,function(t){return Zt(e,pn(t))})}function Na(e,t){if(!e||!e.length)return[];var n=Ra(e);return null==t?n:Zt(n,function(e){return $t(t,i,e)})}var Ma=Co(function(e,t){return _u(e)?Ur(e,t):[]}),Aa=Co(function(e){return Ho(Qt(e,_u))}),Da=Co(function(e){var t=xa(e);return _u(t)&&(t=i),Ho(Qt(e,_u),Li(t,2))}),Ia=Co(function(e){var t=xa(e);return t="function"==typeof t?t:i,Ho(Qt(e,_u),i,t)}),La=Co(Ra);var za=Co(function(e){var t=e.length,n=t>1?e[t-1]:i;return Na(e,n="function"==typeof n?(e.pop(),n):i)});function Ua(e){var t=hr(e);return t.__chain__=!0,t}function Fa(e,t){return t(e)}var Ba=Ri(function(e){var t=e.length,n=t?e[0]:0,r=this.__wrapped__,o=function(t){return Ar(t,e)};return!(t>1||this.__actions__.length)&&r instanceof gr&&Yi(n)?((r=r.slice(n,+n+(t?1:0))).__actions__.push({func:Fa,args:[o],thisArg:i}),new yr(r,this.__chain__).thru(function(e){return t&&!e.length&&e.push(i),e})):this.thru(o)});var Wa=ai(function(e,t,n){ct.call(e,n)?++e[n]:Mr(e,n,1)});var qa=di(ma),Ha=di(ya);function $a(e,t){return(yu(e)?Yt:Fr)(e,Li(t,3))}function Va(e,t){return(yu(e)?Gt:Br)(e,Li(t,3))}var Ya=ai(function(e,t,n){ct.call(e,n)?e[n].push(t):Mr(e,n,[t])});var Ga=Co(function(e,t,n){var o=-1,i="function"==typeof t,a=bu(e)?r(e.length):[];return Fr(e,function(e){a[++o]=i?$t(t,e,n):oo(e,t,n)}),a}),Ka=ai(function(e,t,n){Mr(e,n,t)});function Qa(e,t){return(yu(e)?Zt:ho)(e,Li(t,3))}var Xa=ai(function(e,t,n){e[n?0:1].push(t)},function(){return[[],[]]});var Ja=Co(function(e,t){if(null==e)return[];var n=t.length;return n>1&&Gi(e,t[0],t[1])?t=[]:n>2&&Gi(t[0],t[1],t[2])&&(t=[t[0]]),bo(e,$r(t,1),[])}),Za=Ln||function(){return Mt.Date.now()};function eu(e,t,n){return t=n?i:t,t=e&&null==t?e.length:t,Si(e,O,i,i,i,i,t)}function tu(e,t){var n;if("function"!=typeof t)throw new ot(s);return e=Bu(e),function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=i),n}}var nu=Co(function(e,t,n){var r=y;if(n.length){var o=Pn(n,Ii(nu));r|=E}return Si(e,r,t,n,o)}),ru=Co(function(e,t,n){var r=y|g;if(n.length){var o=Pn(n,Ii(ru));r|=E}return Si(t,r,e,n,o)});function ou(e,t,n){var r,o,a,u,l,c,f=0,p=!1,d=!1,h=!0;if("function"!=typeof e)throw new ot(s);function v(t){var n=r,a=o;return r=o=i,f=t,u=e.apply(a,n)}function m(e){var n=e-c;return c===i||n>=t||n<0||d&&e-f>=a}function y(){var e=Za();if(m(e))return g(e);l=oa(y,function(e){var n=t-(e-c);return d?Yn(n,a-(e-f)):n}(e))}function g(e){return l=i,h&&r?v(e):(r=o=i,u)}function b(){var e=Za(),n=m(e);if(r=arguments,o=this,c=e,n){if(l===i)return function(e){return f=e,l=oa(y,t),p?v(e):u}(c);if(d)return l=oa(y,t),v(c)}return l===i&&(l=oa(y,t)),u}return t=qu(t)||0,ku(n)&&(p=!!n.leading,a=(d="maxWait"in n)?Vn(qu(n.maxWait)||0,t):a,h="trailing"in n?!!n.trailing:h),b.cancel=function(){l!==i&&Xo(l),f=0,r=c=o=l=i},b.flush=function(){return l===i?u:g(Za())},b}var iu=Co(function(e,t){return zr(e,1,t)}),au=Co(function(e,t,n){return zr(e,qu(t)||0,n)});function uu(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new ot(s);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=e.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(uu.Cache||wr),n}function su(e){if("function"!=typeof e)throw new ot(s);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}uu.Cache=wr;var lu=Ko(function(e,t){var n=(t=1==t.length&&yu(t[0])?Zt(t[0],yn(Li())):Zt($r(t,1),yn(Li()))).length;return Co(function(r){for(var o=-1,i=Yn(r.length,n);++o<i;)r[o]=t[o].call(this,r[o]);return $t(e,this,r)})}),cu=Co(function(e,t){var n=Pn(t,Ii(cu));return Si(e,E,i,t,n)}),fu=Co(function(e,t){var n=Pn(t,Ii(fu));return Si(e,x,i,t,n)}),pu=Ri(function(e,t){return Si(e,C,i,i,i,t)});function du(e,t){return e===t||e!=e&&t!=t}var hu=wi(eo),vu=wi(function(e,t){return e>=t}),mu=io(function(){return arguments}())?io:function(e){return Pu(e)&&ct.call(e,"callee")&&!At.call(e,"callee")},yu=r.isArray,gu=Ut?yn(Ut):function(e){return Pu(e)&&Zr(e)==se};function bu(e){return null!=e&&Su(e.length)&&!Ou(e)}function _u(e){return Pu(e)&&bu(e)}var wu=Wn||qs,Eu=Ft?yn(Ft):function(e){return Pu(e)&&Zr(e)==$};function xu(e){if(!Pu(e))return!1;var t=Zr(e);return t==Y||t==V||"string"==typeof e.message&&"string"==typeof e.name&&!Ru(e)}function Ou(e){if(!ku(e))return!1;var t=Zr(e);return t==G||t==K||t==q||t==ee}function Cu(e){return"number"==typeof e&&e==Bu(e)}function Su(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=A}function ku(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function Pu(e){return null!=e&&"object"==typeof e}var ju=Bt?yn(Bt):function(e){return Pu(e)&&qi(e)==Q};function Tu(e){return"number"==typeof e||Pu(e)&&Zr(e)==X}function Ru(e){if(!Pu(e)||Zr(e)!=Z)return!1;var t=Rt(e);if(null===t)return!0;var n=ct.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&lt.call(n)==ht}var Nu=Wt?yn(Wt):function(e){return Pu(e)&&Zr(e)==te};var Mu=qt?yn(qt):function(e){return Pu(e)&&qi(e)==ne};function Au(e){return"string"==typeof e||!yu(e)&&Pu(e)&&Zr(e)==re}function Du(e){return"symbol"==typeof e||Pu(e)&&Zr(e)==oe}var Iu=Ht?yn(Ht):function(e){return Pu(e)&&Su(e.length)&&!!St[Zr(e)]};var Lu=wi(po),zu=wi(function(e,t){return e<=t});function Uu(e){if(!e)return[];if(bu(e))return Au(e)?Mn(e):oi(e);if(zt&&e[zt])return function(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}(e[zt]());var t=qi(e);return(t==Q?Sn:t==ne?Tn:ds)(e)}function Fu(e){return e?(e=qu(e))===M||e===-M?(e<0?-1:1)*D:e==e?e:0:0===e?e:0}function Bu(e){var t=Fu(e),n=t%1;return t==t?n?t-n:t:0}function Wu(e){return e?Dr(Bu(e),0,L):0}function qu(e){if("number"==typeof e)return e;if(Du(e))return I;if(ku(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=ku(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(Ae,"");var n=$e.test(e);return n||Ye.test(e)?Tt(e.slice(2),n?2:8):He.test(e)?I:+e}function Hu(e){return ii(e,is(e))}function $u(e){return null==e?"":zo(e)}var Vu=ui(function(e,t){if(Ji(t)||bu(t))ii(t,os(t),e);else for(var n in t)ct.call(t,n)&&jr(e,n,t[n])}),Yu=ui(function(e,t){ii(t,is(t),e)}),Gu=ui(function(e,t,n,r){ii(t,is(t),e,r)}),Ku=ui(function(e,t,n,r){ii(t,os(t),e,r)}),Qu=Ri(Ar);var Xu=Co(function(e,t){e=tt(e);var n=-1,r=t.length,o=r>2?t[2]:i;for(o&&Gi(t[0],t[1],o)&&(r=1);++n<r;)for(var a=t[n],u=is(a),s=-1,l=u.length;++s<l;){var c=u[s],f=e[c];(f===i||du(f,ut[c])&&!ct.call(e,c))&&(e[c]=a[c])}return e}),Ju=Co(function(e){return e.push(i,Pi),$t(us,i,e)});function Zu(e,t,n){var r=null==e?i:Xr(e,t);return r===i?n:r}function es(e,t){return null!=e&&Hi(e,t,no)}var ts=mi(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=dt.call(t)),e[t]=n},ks(Ts)),ns=mi(function(e,t,n){null!=t&&"function"!=typeof t.toString&&(t=dt.call(t)),ct.call(e,t)?e[t].push(n):e[t]=[n]},Li),rs=Co(oo);function os(e){return bu(e)?Or(e):co(e)}function is(e){return bu(e)?Or(e,!0):fo(e)}var as=ui(function(e,t,n){yo(e,t,n)}),us=ui(function(e,t,n,r){yo(e,t,n,r)}),ss=Ri(function(e,t){var n={};if(null==e)return n;var r=!1;t=Zt(t,function(t){return t=Go(t,e),r||(r=t.length>1),t}),ii(e,Mi(e),n),r&&(n=Ir(n,p|d|h,ji));for(var o=t.length;o--;)Fo(n,t[o]);return n});var ls=Ri(function(e,t){return null==e?{}:function(e,t){return _o(e,t,function(t,n){return es(e,n)})}(e,t)});function cs(e,t){if(null==e)return{};var n=Zt(Mi(e),function(e){return[e]});return t=Li(t),_o(e,n,function(e,n){return t(e,n[0])})}var fs=Ci(os),ps=Ci(is);function ds(e){return null==e?[]:gn(e,os(e))}var hs=fi(function(e,t,n){return t=t.toLowerCase(),e+(n?vs(t):t)});function vs(e){return xs($u(e).toLowerCase())}function ms(e){return(e=$u(e))&&e.replace(Ke,En).replace(bt,"")}var ys=fi(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()}),gs=fi(function(e,t,n){return e+(n?" ":"")+t.toLowerCase()}),bs=ci("toLowerCase");var _s=fi(function(e,t,n){return e+(n?"_":"")+t.toLowerCase()});var ws=fi(function(e,t,n){return e+(n?" ":"")+xs(t)});var Es=fi(function(e,t,n){return e+(n?" ":"")+t.toUpperCase()}),xs=ci("toUpperCase");function Os(e,t,n){return e=$u(e),(t=n?i:t)===i?function(e){return xt.test(e)}(e)?function(e){return e.match(wt)||[]}(e):function(e){return e.match(Fe)||[]}(e):e.match(t)||[]}var Cs=Co(function(e,t){try{return $t(e,i,t)}catch(e){return xu(e)?e:new Je(e)}}),Ss=Ri(function(e,t){return Yt(t,function(t){t=ca(t),Mr(e,t,nu(e[t],e))}),e});function ks(e){return function(){return e}}var Ps=hi(),js=hi(!0);function Ts(e){return e}function Rs(e){return lo("function"==typeof e?e:Ir(e,p))}var Ns=Co(function(e,t){return function(n){return oo(n,e,t)}}),Ms=Co(function(e,t){return function(n){return oo(e,n,t)}});function As(e,t,n){var r=os(t),o=Qr(t,r);null!=n||ku(t)&&(o.length||!r.length)||(n=t,t=e,e=this,o=Qr(t,os(t)));var i=!(ku(n)&&"chain"in n&&!n.chain),a=Ou(e);return Yt(o,function(n){var r=t[n];e[n]=r,a&&(e.prototype[n]=function(){var t=this.__chain__;if(i||t){var n=e(this.__wrapped__);return(n.__actions__=oi(this.__actions__)).push({func:r,args:arguments,thisArg:e}),n.__chain__=t,n}return r.apply(e,en([this.value()],arguments))})}),e}function Ds(){}var Is=gi(Zt),Ls=gi(Kt),zs=gi(rn);function Us(e){return Ki(e)?pn(ca(e)):function(e){return function(t){return Xr(t,e)}}(e)}var Fs=_i(),Bs=_i(!0);function Ws(){return[]}function qs(){return!1}var Hs=yi(function(e,t){return e+t},0),$s=xi("ceil"),Vs=yi(function(e,t){return e/t},1),Ys=xi("floor");var Gs,Ks=yi(function(e,t){return e*t},1),Qs=xi("round"),Xs=yi(function(e,t){return e-t},0);return hr.after=function(e,t){if("function"!=typeof t)throw new ot(s);return e=Bu(e),function(){if(--e<1)return t.apply(this,arguments)}},hr.ary=eu,hr.assign=Vu,hr.assignIn=Yu,hr.assignInWith=Gu,hr.assignWith=Ku,hr.at=Qu,hr.before=tu,hr.bind=nu,hr.bindAll=Ss,hr.bindKey=ru,hr.castArray=function(){if(!arguments.length)return[];var e=arguments[0];return yu(e)?e:[e]},hr.chain=Ua,hr.chunk=function(e,t,n){t=(n?Gi(e,t,n):t===i)?1:Vn(Bu(t),0);var o=null==e?0:e.length;if(!o||t<1)return[];for(var a=0,u=0,s=r(Un(o/t));a<o;)s[u++]=No(e,a,a+=t);return s},hr.compact=function(e){for(var t=-1,n=null==e?0:e.length,r=0,o=[];++t<n;){var i=e[t];i&&(o[r++]=i)}return o},hr.concat=function(){var e=arguments.length;if(!e)return[];for(var t=r(e-1),n=arguments[0],o=e;o--;)t[o-1]=arguments[o];return en(yu(n)?oi(n):[n],$r(t,1))},hr.cond=function(e){var t=null==e?0:e.length,n=Li();return e=t?Zt(e,function(e){if("function"!=typeof e[1])throw new ot(s);return[n(e[0]),e[1]]}):[],Co(function(n){for(var r=-1;++r<t;){var o=e[r];if($t(o[0],this,n))return $t(o[1],this,n)}})},hr.conforms=function(e){return function(e){var t=os(e);return function(n){return Lr(n,e,t)}}(Ir(e,p))},hr.constant=ks,hr.countBy=Wa,hr.create=function(e,t){var n=vr(e);return null==t?n:Nr(n,t)},hr.curry=function e(t,n,r){var o=Si(t,_,i,i,i,i,i,n=r?i:n);return o.placeholder=e.placeholder,o},hr.curryRight=function e(t,n,r){var o=Si(t,w,i,i,i,i,i,n=r?i:n);return o.placeholder=e.placeholder,o},hr.debounce=ou,hr.defaults=Xu,hr.defaultsDeep=Ju,hr.defer=iu,hr.delay=au,hr.difference=da,hr.differenceBy=ha,hr.differenceWith=va,hr.drop=function(e,t,n){var r=null==e?0:e.length;return r?No(e,(t=n||t===i?1:Bu(t))<0?0:t,r):[]},hr.dropRight=function(e,t,n){var r=null==e?0:e.length;return r?No(e,0,(t=r-(t=n||t===i?1:Bu(t)))<0?0:t):[]},hr.dropRightWhile=function(e,t){return e&&e.length?Wo(e,Li(t,3),!0,!0):[]},hr.dropWhile=function(e,t){return e&&e.length?Wo(e,Li(t,3),!0):[]},hr.fill=function(e,t,n,r){var o=null==e?0:e.length;return o?(n&&"number"!=typeof n&&Gi(e,t,n)&&(n=0,r=o),function(e,t,n,r){var o=e.length;for((n=Bu(n))<0&&(n=-n>o?0:o+n),(r=r===i||r>o?o:Bu(r))<0&&(r+=o),r=n>r?0:Wu(r);n<r;)e[n++]=t;return e}(e,t,n,r)):[]},hr.filter=function(e,t){return(yu(e)?Qt:Hr)(e,Li(t,3))},hr.flatMap=function(e,t){return $r(Qa(e,t),1)},hr.flatMapDeep=function(e,t){return $r(Qa(e,t),M)},hr.flatMapDepth=function(e,t,n){return n=n===i?1:Bu(n),$r(Qa(e,t),n)},hr.flatten=ga,hr.flattenDeep=function(e){return null!=e&&e.length?$r(e,M):[]},hr.flattenDepth=function(e,t){return null!=e&&e.length?$r(e,t=t===i?1:Bu(t)):[]},hr.flip=function(e){return Si(e,S)},hr.flow=Ps,hr.flowRight=js,hr.fromPairs=function(e){for(var t=-1,n=null==e?0:e.length,r={};++t<n;){var o=e[t];r[o[0]]=o[1]}return r},hr.functions=function(e){return null==e?[]:Qr(e,os(e))},hr.functionsIn=function(e){return null==e?[]:Qr(e,is(e))},hr.groupBy=Ya,hr.initial=function(e){return null!=e&&e.length?No(e,0,-1):[]},hr.intersection=_a,hr.intersectionBy=wa,hr.intersectionWith=Ea,hr.invert=ts,hr.invertBy=ns,hr.invokeMap=Ga,hr.iteratee=Rs,hr.keyBy=Ka,hr.keys=os,hr.keysIn=is,hr.map=Qa,hr.mapKeys=function(e,t){var n={};return t=Li(t,3),Gr(e,function(e,r,o){Mr(n,t(e,r,o),e)}),n},hr.mapValues=function(e,t){var n={};return t=Li(t,3),Gr(e,function(e,r,o){Mr(n,r,t(e,r,o))}),n},hr.matches=function(e){return vo(Ir(e,p))},hr.matchesProperty=function(e,t){return mo(e,Ir(t,p))},hr.memoize=uu,hr.merge=as,hr.mergeWith=us,hr.method=Ns,hr.methodOf=Ms,hr.mixin=As,hr.negate=su,hr.nthArg=function(e){return e=Bu(e),Co(function(t){return go(t,e)})},hr.omit=ss,hr.omitBy=function(e,t){return cs(e,su(Li(t)))},hr.once=function(e){return tu(2,e)},hr.orderBy=function(e,t,n,r){return null==e?[]:(yu(t)||(t=null==t?[]:[t]),yu(n=r?i:n)||(n=null==n?[]:[n]),bo(e,t,n))},hr.over=Is,hr.overArgs=lu,hr.overEvery=Ls,hr.overSome=zs,hr.partial=cu,hr.partialRight=fu,hr.partition=Xa,hr.pick=ls,hr.pickBy=cs,hr.property=Us,hr.propertyOf=function(e){return function(t){return null==e?i:Xr(e,t)}},hr.pull=Oa,hr.pullAll=Ca,hr.pullAllBy=function(e,t,n){return e&&e.length&&t&&t.length?wo(e,t,Li(n,2)):e},hr.pullAllWith=function(e,t,n){return e&&e.length&&t&&t.length?wo(e,t,i,n):e},hr.pullAt=Sa,hr.range=Fs,hr.rangeRight=Bs,hr.rearg=pu,hr.reject=function(e,t){return(yu(e)?Qt:Hr)(e,su(Li(t,3)))},hr.remove=function(e,t){var n=[];if(!e||!e.length)return n;var r=-1,o=[],i=e.length;for(t=Li(t,3);++r<i;){var a=e[r];t(a,r,e)&&(n.push(a),o.push(r))}return Eo(e,o),n},hr.rest=function(e,t){if("function"!=typeof e)throw new ot(s);return Co(e,t=t===i?t:Bu(t))},hr.reverse=ka,hr.sampleSize=function(e,t,n){return t=(n?Gi(e,t,n):t===i)?1:Bu(t),(yu(e)?Sr:ko)(e,t)},hr.set=function(e,t,n){return null==e?e:Po(e,t,n)},hr.setWith=function(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:Po(e,t,n,r)},hr.shuffle=function(e){return(yu(e)?kr:Ro)(e)},hr.slice=function(e,t,n){var r=null==e?0:e.length;return r?(n&&"number"!=typeof n&&Gi(e,t,n)?(t=0,n=r):(t=null==t?0:Bu(t),n=n===i?r:Bu(n)),No(e,t,n)):[]},hr.sortBy=Ja,hr.sortedUniq=function(e){return e&&e.length?Io(e):[]},hr.sortedUniqBy=function(e,t){return e&&e.length?Io(e,Li(t,2)):[]},hr.split=function(e,t,n){return n&&"number"!=typeof n&&Gi(e,t,n)&&(t=n=i),(n=n===i?L:n>>>0)?(e=$u(e))&&("string"==typeof t||null!=t&&!Nu(t))&&!(t=zo(t))&&Cn(e)?Qo(Mn(e),0,n):e.split(t,n):[]},hr.spread=function(e,t){if("function"!=typeof e)throw new ot(s);return t=null==t?0:Vn(Bu(t),0),Co(function(n){var r=n[t],o=Qo(n,0,t);return r&&en(o,r),$t(e,this,o)})},hr.tail=function(e){var t=null==e?0:e.length;return t?No(e,1,t):[]},hr.take=function(e,t,n){return e&&e.length?No(e,0,(t=n||t===i?1:Bu(t))<0?0:t):[]},hr.takeRight=function(e,t,n){var r=null==e?0:e.length;return r?No(e,(t=r-(t=n||t===i?1:Bu(t)))<0?0:t,r):[]},hr.takeRightWhile=function(e,t){return e&&e.length?Wo(e,Li(t,3),!1,!0):[]},hr.takeWhile=function(e,t){return e&&e.length?Wo(e,Li(t,3)):[]},hr.tap=function(e,t){return t(e),e},hr.throttle=function(e,t,n){var r=!0,o=!0;if("function"!=typeof e)throw new ot(s);return ku(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),ou(e,t,{leading:r,maxWait:t,trailing:o})},hr.thru=Fa,hr.toArray=Uu,hr.toPairs=fs,hr.toPairsIn=ps,hr.toPath=function(e){return yu(e)?Zt(e,ca):Du(e)?[e]:oi(la($u(e)))},hr.toPlainObject=Hu,hr.transform=function(e,t,n){var r=yu(e),o=r||wu(e)||Iu(e);if(t=Li(t,4),null==n){var i=e&&e.constructor;n=o?r?new i:[]:ku(e)&&Ou(i)?vr(Rt(e)):{}}return(o?Yt:Gr)(e,function(e,r,o){return t(n,e,r,o)}),n},hr.unary=function(e){return eu(e,1)},hr.union=Pa,hr.unionBy=ja,hr.unionWith=Ta,hr.uniq=function(e){return e&&e.length?Uo(e):[]},hr.uniqBy=function(e,t){return e&&e.length?Uo(e,Li(t,2)):[]},hr.uniqWith=function(e,t){return t="function"==typeof t?t:i,e&&e.length?Uo(e,i,t):[]},hr.unset=function(e,t){return null==e||Fo(e,t)},hr.unzip=Ra,hr.unzipWith=Na,hr.update=function(e,t,n){return null==e?e:Bo(e,t,Yo(n))},hr.updateWith=function(e,t,n,r){return r="function"==typeof r?r:i,null==e?e:Bo(e,t,Yo(n),r)},hr.values=ds,hr.valuesIn=function(e){return null==e?[]:gn(e,is(e))},hr.without=Ma,hr.words=Os,hr.wrap=function(e,t){return cu(Yo(t),e)},hr.xor=Aa,hr.xorBy=Da,hr.xorWith=Ia,hr.zip=La,hr.zipObject=function(e,t){return $o(e||[],t||[],jr)},hr.zipObjectDeep=function(e,t){return $o(e||[],t||[],Po)},hr.zipWith=za,hr.entries=fs,hr.entriesIn=ps,hr.extend=Yu,hr.extendWith=Gu,As(hr,hr),hr.add=Hs,hr.attempt=Cs,hr.camelCase=hs,hr.capitalize=vs,hr.ceil=$s,hr.clamp=function(e,t,n){return n===i&&(n=t,t=i),n!==i&&(n=(n=qu(n))==n?n:0),t!==i&&(t=(t=qu(t))==t?t:0),Dr(qu(e),t,n)},hr.clone=function(e){return Ir(e,h)},hr.cloneDeep=function(e){return Ir(e,p|h)},hr.cloneDeepWith=function(e,t){return Ir(e,p|h,t="function"==typeof t?t:i)},hr.cloneWith=function(e,t){return Ir(e,h,t="function"==typeof t?t:i)},hr.conformsTo=function(e,t){return null==t||Lr(e,t,os(t))},hr.deburr=ms,hr.defaultTo=function(e,t){return null==e||e!=e?t:e},hr.divide=Vs,hr.endsWith=function(e,t,n){e=$u(e),t=zo(t);var r=e.length,o=n=n===i?r:Dr(Bu(n),0,r);return(n-=t.length)>=0&&e.slice(n,o)==t},hr.eq=du,hr.escape=function(e){return(e=$u(e))&&Ce.test(e)?e.replace(xe,xn):e},hr.escapeRegExp=function(e){return(e=$u(e))&&Me.test(e)?e.replace(Ne,"\\$&"):e},hr.every=function(e,t,n){var r=yu(e)?Kt:Wr;return n&&Gi(e,t,n)&&(t=i),r(e,Li(t,3))},hr.find=qa,hr.findIndex=ma,hr.findKey=function(e,t){return an(e,Li(t,3),Gr)},hr.findLast=Ha,hr.findLastIndex=ya,hr.findLastKey=function(e,t){return an(e,Li(t,3),Kr)},hr.floor=Ys,hr.forEach=$a,hr.forEachRight=Va,hr.forIn=function(e,t){return null==e?e:Vr(e,Li(t,3),is)},hr.forInRight=function(e,t){return null==e?e:Yr(e,Li(t,3),is)},hr.forOwn=function(e,t){return e&&Gr(e,Li(t,3))},hr.forOwnRight=function(e,t){return e&&Kr(e,Li(t,3))},hr.get=Zu,hr.gt=hu,hr.gte=vu,hr.has=function(e,t){return null!=e&&Hi(e,t,to)},hr.hasIn=es,hr.head=ba,hr.identity=Ts,hr.includes=function(e,t,n,r){e=bu(e)?e:ds(e),n=n&&!r?Bu(n):0;var o=e.length;return n<0&&(n=Vn(o+n,0)),Au(e)?n<=o&&e.indexOf(t,n)>-1:!!o&&sn(e,t,n)>-1},hr.indexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=null==n?0:Bu(n);return o<0&&(o=Vn(r+o,0)),sn(e,t,o)},hr.inRange=function(e,t,n){return t=Fu(t),n===i?(n=t,t=0):n=Fu(n),function(e,t,n){return e>=Yn(t,n)&&e<Vn(t,n)}(e=qu(e),t,n)},hr.invoke=rs,hr.isArguments=mu,hr.isArray=yu,hr.isArrayBuffer=gu,hr.isArrayLike=bu,hr.isArrayLikeObject=_u,hr.isBoolean=function(e){return!0===e||!1===e||Pu(e)&&Zr(e)==H},hr.isBuffer=wu,hr.isDate=Eu,hr.isElement=function(e){return Pu(e)&&1===e.nodeType&&!Ru(e)},hr.isEmpty=function(e){if(null==e)return!0;if(bu(e)&&(yu(e)||"string"==typeof e||"function"==typeof e.splice||wu(e)||Iu(e)||mu(e)))return!e.length;var t=qi(e);if(t==Q||t==ne)return!e.size;if(Ji(e))return!co(e).length;for(var n in e)if(ct.call(e,n))return!1;return!0},hr.isEqual=function(e,t){return ao(e,t)},hr.isEqualWith=function(e,t,n){var r=(n="function"==typeof n?n:i)?n(e,t):i;return r===i?ao(e,t,i,n):!!r},hr.isError=xu,hr.isFinite=function(e){return"number"==typeof e&&qn(e)},hr.isFunction=Ou,hr.isInteger=Cu,hr.isLength=Su,hr.isMap=ju,hr.isMatch=function(e,t){return e===t||uo(e,t,Ui(t))},hr.isMatchWith=function(e,t,n){return n="function"==typeof n?n:i,uo(e,t,Ui(t),n)},hr.isNaN=function(e){return Tu(e)&&e!=+e},hr.isNative=function(e){if(Xi(e))throw new Je(u);return so(e)},hr.isNil=function(e){return null==e},hr.isNull=function(e){return null===e},hr.isNumber=Tu,hr.isObject=ku,hr.isObjectLike=Pu,hr.isPlainObject=Ru,hr.isRegExp=Nu,hr.isSafeInteger=function(e){return Cu(e)&&e>=-A&&e<=A},hr.isSet=Mu,hr.isString=Au,hr.isSymbol=Du,hr.isTypedArray=Iu,hr.isUndefined=function(e){return e===i},hr.isWeakMap=function(e){return Pu(e)&&qi(e)==ae},hr.isWeakSet=function(e){return Pu(e)&&Zr(e)==ue},hr.join=function(e,t){return null==e?"":Hn.call(e,t)},hr.kebabCase=ys,hr.last=xa,hr.lastIndexOf=function(e,t,n){var r=null==e?0:e.length;if(!r)return-1;var o=r;return n!==i&&(o=(o=Bu(n))<0?Vn(r+o,0):Yn(o,r-1)),t==t?function(e,t,n){for(var r=n+1;r--;)if(e[r]===t)return r;return r}(e,t,o):un(e,cn,o,!0)},hr.lowerCase=gs,hr.lowerFirst=bs,hr.lt=Lu,hr.lte=zu,hr.max=function(e){return e&&e.length?qr(e,Ts,eo):i},hr.maxBy=function(e,t){return e&&e.length?qr(e,Li(t,2),eo):i},hr.mean=function(e){return fn(e,Ts)},hr.meanBy=function(e,t){return fn(e,Li(t,2))},hr.min=function(e){return e&&e.length?qr(e,Ts,po):i},hr.minBy=function(e,t){return e&&e.length?qr(e,Li(t,2),po):i},hr.stubArray=Ws,hr.stubFalse=qs,hr.stubObject=function(){return{}},hr.stubString=function(){return""},hr.stubTrue=function(){return!0},hr.multiply=Ks,hr.nth=function(e,t){return e&&e.length?go(e,Bu(t)):i},hr.noConflict=function(){return Mt._===this&&(Mt._=vt),this},hr.noop=Ds,hr.now=Za,hr.pad=function(e,t,n){e=$u(e);var r=(t=Bu(t))?Nn(e):0;if(!t||r>=t)return e;var o=(t-r)/2;return bi(Fn(o),n)+e+bi(Un(o),n)},hr.padEnd=function(e,t,n){e=$u(e);var r=(t=Bu(t))?Nn(e):0;return t&&r<t?e+bi(t-r,n):e},hr.padStart=function(e,t,n){e=$u(e);var r=(t=Bu(t))?Nn(e):0;return t&&r<t?bi(t-r,n)+e:e},hr.parseInt=function(e,t,n){return n||null==t?t=0:t&&(t=+t),Kn($u(e).replace(De,""),t||0)},hr.random=function(e,t,n){if(n&&"boolean"!=typeof n&&Gi(e,t,n)&&(t=n=i),n===i&&("boolean"==typeof t?(n=t,t=i):"boolean"==typeof e&&(n=e,e=i)),e===i&&t===i?(e=0,t=1):(e=Fu(e),t===i?(t=e,e=0):t=Fu(t)),e>t){var r=e;e=t,t=r}if(n||e%1||t%1){var o=Qn();return Yn(e+o*(t-e+jt("1e-"+((o+"").length-1))),t)}return xo(e,t)},hr.reduce=function(e,t,n){var r=yu(e)?tn:hn,o=arguments.length<3;return r(e,Li(t,4),n,o,Fr)},hr.reduceRight=function(e,t,n){var r=yu(e)?nn:hn,o=arguments.length<3;return r(e,Li(t,4),n,o,Br)},hr.repeat=function(e,t,n){return t=(n?Gi(e,t,n):t===i)?1:Bu(t),Oo($u(e),t)},hr.replace=function(){var e=arguments,t=$u(e[0]);return e.length<3?t:t.replace(e[1],e[2])},hr.result=function(e,t,n){var r=-1,o=(t=Go(t,e)).length;for(o||(o=1,e=i);++r<o;){var a=null==e?i:e[ca(t[r])];a===i&&(r=o,a=n),e=Ou(a)?a.call(e):a}return e},hr.round=Qs,hr.runInContext=e,hr.sample=function(e){return(yu(e)?Cr:So)(e)},hr.size=function(e){if(null==e)return 0;if(bu(e))return Au(e)?Nn(e):e.length;var t=qi(e);return t==Q||t==ne?e.size:co(e).length},hr.snakeCase=_s,hr.some=function(e,t,n){var r=yu(e)?rn:Mo;return n&&Gi(e,t,n)&&(t=i),r(e,Li(t,3))},hr.sortedIndex=function(e,t){return Ao(e,t)},hr.sortedIndexBy=function(e,t,n){return Do(e,t,Li(n,2))},hr.sortedIndexOf=function(e,t){var n=null==e?0:e.length;if(n){var r=Ao(e,t);if(r<n&&du(e[r],t))return r}return-1},hr.sortedLastIndex=function(e,t){return Ao(e,t,!0)},hr.sortedLastIndexBy=function(e,t,n){return Do(e,t,Li(n,2),!0)},hr.sortedLastIndexOf=function(e,t){if(null!=e&&e.length){var n=Ao(e,t,!0)-1;if(du(e[n],t))return n}return-1},hr.startCase=ws,hr.startsWith=function(e,t,n){return e=$u(e),n=null==n?0:Dr(Bu(n),0,e.length),t=zo(t),e.slice(n,n+t.length)==t},hr.subtract=Xs,hr.sum=function(e){return e&&e.length?vn(e,Ts):0},hr.sumBy=function(e,t){return e&&e.length?vn(e,Li(t,2)):0},hr.template=function(e,t,n){var r=hr.templateSettings;n&&Gi(e,t,n)&&(t=i),e=$u(e),t=Gu({},t,r,ki);var o,a,u=Gu({},t.imports,r.imports,ki),s=os(u),l=gn(u,s),c=0,f=t.interpolate||Qe,p="__p += '",d=nt((t.escape||Qe).source+"|"+f.source+"|"+(f===Pe?We:Qe).source+"|"+(t.evaluate||Qe).source+"|$","g"),h="//# sourceURL="+("sourceURL"in t?t.sourceURL:"lodash.templateSources["+ ++Ct+"]")+"\n";e.replace(d,function(t,n,r,i,u,s){return r||(r=i),p+=e.slice(c,s).replace(Xe,On),n&&(o=!0,p+="' +\n__e("+n+") +\n'"),u&&(a=!0,p+="';\n"+u+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),c=s+t.length,t}),p+="';\n";var v=t.variable;v||(p="with (obj) {\n"+p+"\n}\n"),p=(a?p.replace(be,""):p).replace(_e,"$1").replace(we,"$1;"),p="function("+(v||"obj")+") {\n"+(v?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(a?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var m=Cs(function(){return Ze(s,h+"return "+p).apply(i,l)});if(m.source=p,xu(m))throw m;return m},hr.times=function(e,t){if((e=Bu(e))<1||e>A)return[];var n=L,r=Yn(e,L);t=Li(t),e-=L;for(var o=mn(r,t);++n<e;)t(n);return o},hr.toFinite=Fu,hr.toInteger=Bu,hr.toLength=Wu,hr.toLower=function(e){return $u(e).toLowerCase()},hr.toNumber=qu,hr.toSafeInteger=function(e){return e?Dr(Bu(e),-A,A):0===e?e:0},hr.toString=$u,hr.toUpper=function(e){return $u(e).toUpperCase()},hr.trim=function(e,t,n){if((e=$u(e))&&(n||t===i))return e.replace(Ae,"");if(!e||!(t=zo(t)))return e;var r=Mn(e),o=Mn(t);return Qo(r,_n(r,o),wn(r,o)+1).join("")},hr.trimEnd=function(e,t,n){if((e=$u(e))&&(n||t===i))return e.replace(Ie,"");if(!e||!(t=zo(t)))return e;var r=Mn(e);return Qo(r,0,wn(r,Mn(t))+1).join("")},hr.trimStart=function(e,t,n){if((e=$u(e))&&(n||t===i))return e.replace(De,"");if(!e||!(t=zo(t)))return e;var r=Mn(e);return Qo(r,_n(r,Mn(t))).join("")},hr.truncate=function(e,t){var n=k,r=P;if(ku(t)){var o="separator"in t?t.separator:o;n="length"in t?Bu(t.length):n,r="omission"in t?zo(t.omission):r}var a=(e=$u(e)).length;if(Cn(e)){var u=Mn(e);a=u.length}if(n>=a)return e;var s=n-Nn(r);if(s<1)return r;var l=u?Qo(u,0,s).join(""):e.slice(0,s);if(o===i)return l+r;if(u&&(s+=l.length-s),Nu(o)){if(e.slice(s).search(o)){var c,f=l;for(o.global||(o=nt(o.source,$u(qe.exec(o))+"g")),o.lastIndex=0;c=o.exec(f);)var p=c.index;l=l.slice(0,p===i?s:p)}}else if(e.indexOf(zo(o),s)!=s){var d=l.lastIndexOf(o);d>-1&&(l=l.slice(0,d))}return l+r},hr.unescape=function(e){return(e=$u(e))&&Oe.test(e)?e.replace(Ee,An):e},hr.uniqueId=function(e){var t=++ft;return $u(e)+t},hr.upperCase=Es,hr.upperFirst=xs,hr.each=$a,hr.eachRight=Va,hr.first=ba,As(hr,(Gs={},Gr(hr,function(e,t){ct.call(hr.prototype,t)||(Gs[t]=e)}),Gs),{chain:!1}),hr.VERSION="4.17.10",Yt(["bind","bindKey","curry","curryRight","partial","partialRight"],function(e){hr[e].placeholder=hr}),Yt(["drop","take"],function(e,t){gr.prototype[e]=function(n){n=n===i?1:Vn(Bu(n),0);var r=this.__filtered__&&!t?new gr(this):this.clone();return r.__filtered__?r.__takeCount__=Yn(n,r.__takeCount__):r.__views__.push({size:Yn(n,L),type:e+(r.__dir__<0?"Right":"")}),r},gr.prototype[e+"Right"]=function(t){return this.reverse()[e](t).reverse()}}),Yt(["filter","map","takeWhile"],function(e,t){var n=t+1,r=n==R||3==n;gr.prototype[e]=function(e){var t=this.clone();return t.__iteratees__.push({iteratee:Li(e,3),type:n}),t.__filtered__=t.__filtered__||r,t}}),Yt(["head","last"],function(e,t){var n="take"+(t?"Right":"");gr.prototype[e]=function(){return this[n](1).value()[0]}}),Yt(["initial","tail"],function(e,t){var n="drop"+(t?"":"Right");gr.prototype[e]=function(){return this.__filtered__?new gr(this):this[n](1)}}),gr.prototype.compact=function(){return this.filter(Ts)},gr.prototype.find=function(e){return this.filter(e).head()},gr.prototype.findLast=function(e){return this.reverse().find(e)},gr.prototype.invokeMap=Co(function(e,t){return"function"==typeof e?new gr(this):this.map(function(n){return oo(n,e,t)})}),gr.prototype.reject=function(e){return this.filter(su(Li(e)))},gr.prototype.slice=function(e,t){e=Bu(e);var n=this;return n.__filtered__&&(e>0||t<0)?new gr(n):(e<0?n=n.takeRight(-e):e&&(n=n.drop(e)),t!==i&&(n=(t=Bu(t))<0?n.dropRight(-t):n.take(t-e)),n)},gr.prototype.takeRightWhile=function(e){return this.reverse().takeWhile(e).reverse()},gr.prototype.toArray=function(){return this.take(L)},Gr(gr.prototype,function(e,t){var n=/^(?:filter|find|map|reject)|While$/.test(t),r=/^(?:head|last)$/.test(t),o=hr[r?"take"+("last"==t?"Right":""):t],a=r||/^find/.test(t);o&&(hr.prototype[t]=function(){var t=this.__wrapped__,u=r?[1]:arguments,s=t instanceof gr,l=u[0],c=s||yu(t),f=function(e){var t=o.apply(hr,en([e],u));return r&&p?t[0]:t};c&&n&&"function"==typeof l&&1!=l.length&&(s=c=!1);var p=this.__chain__,d=!!this.__actions__.length,h=a&&!p,v=s&&!d;if(!a&&c){t=v?t:new gr(this);var m=e.apply(t,u);return m.__actions__.push({func:Fa,args:[f],thisArg:i}),new yr(m,p)}return h&&v?e.apply(this,u):(m=this.thru(f),h?r?m.value()[0]:m.value():m)})}),Yt(["pop","push","shift","sort","splice","unshift"],function(e){var t=it[e],n=/^(?:push|sort|unshift)$/.test(e)?"tap":"thru",r=/^(?:pop|shift)$/.test(e);hr.prototype[e]=function(){var e=arguments;if(r&&!this.__chain__){var o=this.value();return t.apply(yu(o)?o:[],e)}return this[n](function(n){return t.apply(yu(n)?n:[],e)})}}),Gr(gr.prototype,function(e,t){var n=hr[t];if(n){var r=n.name+"";(ir[r]||(ir[r]=[])).push({name:t,func:n})}}),ir[vi(i,g).name]=[{name:"wrapper",func:i}],gr.prototype.clone=function(){var e=new gr(this.__wrapped__);return e.__actions__=oi(this.__actions__),e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=oi(this.__iteratees__),e.__takeCount__=this.__takeCount__,e.__views__=oi(this.__views__),e},gr.prototype.reverse=function(){if(this.__filtered__){var e=new gr(this);e.__dir__=-1,e.__filtered__=!0}else(e=this.clone()).__dir__*=-1;return e},gr.prototype.value=function(){var e=this.__wrapped__.value(),t=this.__dir__,n=yu(e),r=t<0,o=n?e.length:0,i=function(e,t,n){for(var r=-1,o=n.length;++r<o;){var i=n[r],a=i.size;switch(i.type){case"drop":e+=a;break;case"dropRight":t-=a;break;case"take":t=Yn(t,e+a);break;case"takeRight":e=Vn(e,t-a)}}return{start:e,end:t}}(0,o,this.__views__),a=i.start,u=i.end,s=u-a,l=r?u:a-1,c=this.__iteratees__,f=c.length,p=0,d=Yn(s,this.__takeCount__);if(!n||!r&&o==s&&d==s)return qo(e,this.__actions__);var h=[];e:for(;s--&&p<d;){for(var v=-1,m=e[l+=t];++v<f;){var y=c[v],g=y.iteratee,b=y.type,_=g(m);if(b==N)m=_;else if(!_){if(b==R)continue e;break e}}h[p++]=m}return h},hr.prototype.at=Ba,hr.prototype.chain=function(){return Ua(this)},hr.prototype.commit=function(){return new yr(this.value(),this.__chain__)},hr.prototype.next=function(){this.__values__===i&&(this.__values__=Uu(this.value()));var e=this.__index__>=this.__values__.length;return{done:e,value:e?i:this.__values__[this.__index__++]}},hr.prototype.plant=function(e){for(var t,n=this;n instanceof mr;){var r=pa(n);r.__index__=0,r.__values__=i,t?o.__wrapped__=r:t=r;var o=r;n=n.__wrapped__}return o.__wrapped__=e,t},hr.prototype.reverse=function(){var e=this.__wrapped__;if(e instanceof gr){var t=e;return this.__actions__.length&&(t=new gr(this)),(t=t.reverse()).__actions__.push({func:Fa,args:[ka],thisArg:i}),new yr(t,this.__chain__)}return this.thru(ka)},hr.prototype.toJSON=hr.prototype.valueOf=hr.prototype.value=function(){return qo(this.__wrapped__,this.__actions__)},hr.prototype.first=hr.prototype.head,zt&&(hr.prototype[zt]=function(){return this}),hr}();Mt._=Dn,(o=function(){return Dn}.call(t,n,t,r))===i||(r.exports=o)}).call(this)}).call(this,n(21),n(27)(e))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=(n(8),n(214));t.default=function(){var e,t,n,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments[1];switch(Object.freeze(i),a.type){case r.RECEIVE_BOARDS:return a.payload.boards;case r.RECEIVE_SINGLE_BOARD:return(0,o.merge)({},i,(e={},t=a.board.id,n=a.payload.board,t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e));case r.REMOVE_BOARD:var u=(0,o.merge)({},i);return delete u[a.id],u;default:return i}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(8),i=n(99),a=(r=i)&&r.__esModule?r:{default:r};t.default=function(){var e,t,n,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments[1];switch(Object.freeze(r),i.type){case o.RECEIVE_PEGS:return(0,a.default)({},r,i.pegs);case o.RECEIVE_SINGLE_PEG:return(0,a.default)({},r,(e={},t=i.peg.id,n=i.peg,t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e));case o.REMOVE_PEG:var u=(0,a.default)({},r);return delete u[i.peg.id],u;default:return r}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchAllPegs=function(){return $.ajax({method:"GET",url:"/api/pegs"})},t.fetchSinglePeg=function(e){return $.ajax({method:"GET",url:"/api/pegs/"+e})},t.createPeg=function(e){return $.ajax({method:"POST",url:"/api/pegs",data:{peg:e}})},t.updatePeg=function(e){return $.ajax({method:"PATCH",url:"/api/pegs/"+e.id,data:{peg:e}})},t.deletePeg=function(e){return $.ajax({method:"DELETE",url:"/api/pegs/"+e})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchBoards=function(){return $.ajax({method:"GET",url:"/api/boards"})},t.fetchBoard=function(e){return $.ajax({method:"GET",url:"/api/boards/"+e})},t.createBoard=function(e){return $.ajax({method:"POST",url:"/api/boards",data:{board:e}})},t.updateBoard=function(e){return $.ajax({method:"PATCH",url:"/api/boards/"+e.id,data:{board:e}})},t.deleteBoard=function(e){return $.ajax({method:"DELETE",url:"/api/boards/"+e})}},function(e,t,n){var r=n(30),o=n(19),i=n(82),a=n(10);e.exports=function(e,t,n){if(!a(n))return!1;var u=typeof t;return!!("number"==u?o(n)&&i(t,n.length):"string"==u&&t in n)&&r(n[t],e)}},function(e,t){var n=800,r=16,o=Date.now;e.exports=function(e){var t=0,i=0;return function(){var a=o(),u=r-(a-i);if(i=a,u>0){if(++t>=n)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}},function(e,t){e.exports=function(e){return function(){return e}}},function(e,t,n){var r=n(221),o=n(93),i=n(80),a=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i;e.exports=a},function(e,t){e.exports=function(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}},function(e,t,n){var r=n(80),o=n(79),i=n(78);e.exports=function(e,t){return i(o(e,t,r),e+"")}},function(e,t){e.exports=function(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}},function(e,t,n){var r=n(10),o=n(26),i=n(225),a=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return i(e);var t=o(e),n=[];for(var u in e)("constructor"!=u||!t&&a.call(e,u))&&n.push(u);return n}},function(e,t){e.exports=function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}},function(e,t,n){var r=n(14),o=n(25);e.exports=function(e){return r(e,o(e))}},function(e,t,n){var r=n(18),o=n(87),i=n(13),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,e.exports=function(e){return i(e)&&o(e.length)&&!!a[r(e)]}},function(e,t){e.exports=function(){return!1}},function(e,t,n){var r=n(19),o=n(13);e.exports=function(e){return o(e)&&r(e)}},function(e,t,n){var r=n(18),o=n(13),i="[object Arguments]";e.exports=function(e){return o(e)&&r(e)==i}},function(e,t,n){var r=n(10),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=i},function(e,t,n){var r=n(9).Uint8Array;e.exports=r},function(e,t,n){var r=n(94),o=n(92),i=n(91),a=n(90),u=n(89),s=n(50),l=n(12),c=n(231),f=n(49),p=n(54),d=n(10),h=n(86),v=n(85),m=n(84),y=n(228);e.exports=function(e,t,n,g,b,_,w){var E=m(e,n),x=m(t,n),O=w.get(x);if(O)r(e,n,O);else{var C=_?_(E,x,n+"",e,t,w):void 0,S=void 0===C;if(S){var k=l(x),P=!k&&f(x),j=!k&&!P&&v(x);C=x,k||P||j?l(E)?C=E:c(E)?C=a(E):P?(S=!1,C=o(x,!0)):j?(S=!1,C=i(x,!0)):C=[]:h(x)||s(x)?(C=E,s(E)?C=y(E):(!d(E)||g&&p(E))&&(C=u(x))):S=!1}S&&(w.set(x,C),b(C,x,g,_,w),w.delete(x)),r(e,n,C)}}},function(e,t){e.exports=function(e){return function(t,n,r){for(var o=-1,i=Object(t),a=r(t),u=a.length;u--;){var s=a[e?u:++o];if(!1===n(i[s],s,i))break}return t}}},function(e,t,n){var r=n(236)();e.exports=r},function(e,t,n){var r=n(28);e.exports=function(e,t){var n=r(this,e),o=n.size;return n.set(e,t),this.size+=n.size==o?0:1,this}},function(e,t,n){var r=n(28);e.exports=function(e){return r(this,e).has(e)}},function(e,t,n){var r=n(28);e.exports=function(e){return r(this,e).get(e)}},function(e,t){e.exports=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}},function(e,t,n){var r=n(28);e.exports=function(e){var t=r(this,e).delete(e);return this.size-=t?1:0,t}},function(e,t,n){var r=n(29),o="__lodash_hash_undefined__";e.exports=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=r&&void 0===t?o:t,this}},function(e,t,n){var r=n(29),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;return r?void 0!==t[e]:o.call(t,e)}},function(e,t,n){var r=n(29),o="__lodash_hash_undefined__",i=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;if(r){var n=t[e];return n===o?void 0:n}return i.call(t,e)?t[e]:void 0}},function(e,t){e.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}},function(e,t,n){var r=n(29);e.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(e,t,n){var r=n(247),o=n(246),i=n(245),a=n(244),u=n(243);function s(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}s.prototype.clear=r,s.prototype.delete=o,s.prototype.get=i,s.prototype.has=a,s.prototype.set=u,e.exports=s},function(e,t,n){var r=n(248),o=n(32),i=n(55);e.exports=function(){this.size=0,this.__data__={hash:new r,map:new(i||o),string:new r}}},function(e,t){e.exports=function(e,t){return null==e?void 0:e[t]}},function(e,t,n){var r=n(9)["__core-js_shared__"];e.exports=r},function(e,t,n){var r,o=n(251),i=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";e.exports=function(e){return!!i&&i in e}},function(e,t){var n=Object.prototype.toString;e.exports=function(e){return n.call(e)}},function(e,t,n){var r=n(20),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,u=r?r.toStringTag:void 0;e.exports=function(e){var t=i.call(e,u),n=e[u];try{e[u]=void 0;var r=!0}catch(e){}var o=a.call(e);return r&&(t?e[u]=n:delete e[u]),o}},function(e,t,n){var r=n(54),o=n(252),i=n(10),a=n(96),u=/^\[object .+?Constructor\]$/,s=Function.prototype,l=Object.prototype,c=s.toString,f=l.hasOwnProperty,p=RegExp("^"+c.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=function(e){return!(!i(e)||o(e))&&(r(e)?p:u).test(a(e))}},function(e,t,n){var r=n(32),o=n(55),i=n(95),a=200;e.exports=function(e,t){var n=this.__data__;if(n instanceof r){var u=n.__data__;if(!o||u.length<a-1)return u.push([e,t]),this.size=++n.size,this;n=this.__data__=new i(u)}return n.set(e,t),this.size=n.size,this}},function(e,t){e.exports=function(e){return this.__data__.has(e)}},function(e,t){e.exports=function(e){return this.__data__.get(e)}},function(e,t){e.exports=function(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}},function(e,t,n){var r=n(32);e.exports=function(){this.__data__=new r,this.size=0}},function(e,t,n){var r=n(31);e.exports=function(e,t){var n=this.__data__,o=r(n,e);return o<0?(++this.size,n.push([e,t])):n[o][1]=t,this}},function(e,t,n){var r=n(31);e.exports=function(e){return r(this.__data__,e)>-1}},function(e,t,n){var r=n(31);e.exports=function(e){var t=this.__data__,n=r(t,e);return n<0?void 0:t[n][1]}},function(e,t,n){var r=n(31),o=Array.prototype.splice;e.exports=function(e){var t=this.__data__,n=r(t,e);return!(n<0||(n==t.length-1?t.pop():o.call(t,n,1),--this.size,0))}},function(e,t){e.exports=function(){this.__data__=[],this.size=0}},function(e,t,n){var r=n(98),o=n(94),i=n(237),a=n(235),u=n(10),s=n(25),l=n(84);e.exports=function e(t,n,c,f,p){t!==n&&i(n,function(i,s){if(u(i))p||(p=new r),a(t,n,s,c,e,f,p);else{var d=f?f(l(t,s),i,s+"",t,n,p):void 0;void 0===d&&(d=i),o(t,s,d)}},s)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchUser=function(e){return $.ajax({method:"GET",url:"/api/users/"+e})},t.updateUser=function(e,t){return $.ajax({method:"PATCH",contentType:!1,processData:!1,url:"/api/users/"+t,data:e})},t.createUser=function(e){return $.ajax({url:"api/users",method:"GET",data:{user:e}})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createUser=t.updateUser=t.requestUser=t.RECEIVE_USER=void 0;var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(267));var o=t.RECEIVE_USER="RECEIVE_USER";t.requestUser=function(e){return function(t){return r.fetchUser(e).then(function(e){return t({type:o,user:e})})}},t.updateUser=function(e,t){return function(n){return r.updateUser(e,t).then(function(e){return n({type:o,user:e})})}},t.createUser=function(e){return function(t){return r.createUser(e).then(function(e){return t({type:o,user:e})})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.signup=function(e){return $.ajax({method:"POST",url:"/api/users",data:{user:e}})},t.login=function(e){return $.ajax({method:"POST",url:"/api/session",data:{user:e}})},t.logout=function(){return $.ajax({method:"DELETE",url:"/api/session"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(16),i=(n(268),n(99)),a=(r=i)&&r.__esModule?r:{default:r};n(7),n(8);t.default=function(){var e,t,n,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=arguments[1];switch(i.type){case o.RECEIVE_CURRENT_USER:return(0,a.default)({},r,(e={},t=i.currentUser.id,n=i.currentUser,t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e));default:return r}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(17),o=u(n(270)),i=u(n(216)),a=u(n(215));function u(e){return e&&e.__esModule?e:{default:e}}var s=(0,r.combineReducers)({users:o.default,pegs:i.default,boards:a.default});t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(17),o=s(n(271)),i=s(n(213)),a=s(n(211)),u=s(n(210));function s(e){return e&&e.__esModule?e:{default:e}}var l=(0,r.combineReducers)({entities:o.default,session:a.default,ui:i.default,errors:u.default});t.default=l},function(e,t,n){"use strict";function r(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}n.r(t);var o=r();o.withExtraArgument=r,t.default=o},function(e,t,n){(function(e){!function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function i(e,t){i.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function a(e,t){a.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function u(e,t,n){u.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function s(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function l(e){var t=void 0===e?"undefined":E(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function c(e,t,n,r,f,p,d){f=f||[],d=d||[];var h=f.slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":E(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var v=r.normalize(h,p,e,t);v&&(e=v[0],t=v[1])}}}h.push(p)}"regexp"===l(e)&&"regexp"===l(t)&&(e=e.toString(),t=t.toString());var m=void 0===e?"undefined":E(e),y=void 0===t?"undefined":E(t),g="undefined"!==m||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),b="undefined"!==y||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!g&&b)n(new i(h,t));else if(!b&&g)n(new a(h,e));else if(l(e)!==l(t))n(new o(h,e,t));else if("date"===l(e)&&e-t!=0)n(new o(h,e,t));else if("object"===m&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var _;for(e.length,_=0;_<e.length;_++)_>=t.length?n(new u(h,_,new a(void 0,e[_]))):c(e[_],t[_],n,r,h,_,d);for(;_<t.length;)n(new u(h,_,new i(void 0,t[_++])))}else{var w=Object.keys(e),x=Object.keys(t);w.forEach(function(o,i){var a=x.indexOf(o);a>=0?(c(e[o],t[o],n,r,h,o,d),x=s(x,a)):c(e[o],void 0,n,r,h,o,d)}),x.forEach(function(e){c(void 0,t[e],n,r,h,e,d)})}d.length=d.length-1}else e!==t&&("number"===m&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],c(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,i=n.path?n.path.length-1:0;++o<i;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],a=r.path.length-1;for(o=0;o<a;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":delete i[r.path[o]];break;case"E":case"N":i[r.path[o]]=r.rhs}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":t=s(t,n);break;case"E":case"N":t[n]=r.rhs}return t}(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function d(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=function(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+i+"]",a];default:return[]}}(e);n.log.apply(n,["%c "+C[t].text,function(e){return"color: "+C[e].color+"; font-weight: bold"}(t)].concat(x(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function h(e,t,n,r){switch(void 0===e?"undefined":E(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,x(n)):e[r];case"function":return e(t);default:return e}}function v(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,i=void 0===o?function(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+r),n&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}(t):o,a=t.collapsed,u=t.colors,s=t.level,l=t.diff,c=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,v=o.startedTime,m=o.action,y=o.prevState,g=o.error,b=o.took,w=o.nextState,E=e[f+1];E&&(w=E.prevState,b=E.started-p);var x=r(m),O="function"==typeof a?a(function(){return w},m,o):a,C=_(v),S=u.title?"color: "+u.title(x)+";":"",k=["color: gray; font-weight: lighter;"];k.push(S),t.timestamp&&k.push("color: gray; font-weight: lighter;"),t.duration&&k.push("color: gray; font-weight: lighter;");var P=i(x,C,b);try{O?u.title&&c?n.groupCollapsed.apply(n,["%c "+P].concat(k)):n.groupCollapsed(P):u.title&&c?n.group.apply(n,["%c "+P].concat(k)):n.group(P)}catch(e){n.log(P)}var j=h(s,x,[y],"prevState"),T=h(s,x,[x],"action"),R=h(s,x,[g,y],"error"),N=h(s,x,[w],"nextState");if(j)if(u.prevState){var M="color: "+u.prevState(y)+"; font-weight: bold";n[j]("%c prev state",M,y)}else n[j]("prev state",y);if(T)if(u.action){var A="color: "+u.action(x)+"; font-weight: bold";n[T]("%c action    ",A,x)}else n[T]("action    ",x);if(g&&R)if(u.error){var D="color: "+u.error(g,y)+"; font-weight: bold;";n[R]("%c error     ",D,g)}else n[R]("error     ",g);if(N)if(u.nextState){var I="color: "+u.nextState(w)+"; font-weight: bold";n[N]("%c next state",I,w)}else n[N]("next state",w);l&&d(y,w,n,O);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function m(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},S,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,u=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var s=[];return function(e){var n=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(n,l))return e(l);var c={};s.push(c),c.started=w.now(),c.startedTime=new Date,c.prevState=r(n()),c.action=l;var f=void 0;if(a)try{f=e(l)}catch(e){c.error=o(e)}else f=e(l);c.took=w.now()-c.started,c.nextState=r(n());var p=t.diff&&"function"==typeof u?u(n,l):t.diff;if(v(s,Object.assign({},t,{diff:p})),s.length=0,c.error)throw c.error;return f}}}}var y,g,b=function(e,t){return function(e,t){return new Array(t+1).join(e)}("0",t-e.toString().length)+e},_=function(e){return b(e.getHours(),2)+":"+b(e.getMinutes(),2)+":"+b(e.getSeconds(),2)+"."+b(e.getMilliseconds(),3)},w="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},x=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},O=[];y="object"===(void 0===e?"undefined":E(e))&&e?e:"undefined"!=typeof window?window:{},(g=y.DeepDiff)&&O.push(function(){void 0!==g&&y.DeepDiff===f&&(y.DeepDiff=g,g=void 0)}),n(o,r),n(i,r),n(a,r),n(u,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:c,enumerable:!0},applyDiff:{value:function(e,t,n){e&&t&&c(e,t,function(r){n&&!n(e,t,r)||p(e,t,r)})},enumerable:!0},applyChange:{value:p,enumerable:!0},revertChange:{value:function(e,t,n){if(e&&t&&n&&n.kind){var r,o,i=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===i[n.path[r]]&&(i[n.path[r]]={}),i=i[n.path[r]];switch(n.kind){case"A":!function e(t,n,r){if(r.path&&r.path.length){var o,i=t[n],a=r.path.length-1;for(o=0;o<a;o++)i=i[r.path[o]];switch(r.kind){case"A":e(i[r.path[o]],r.index,r.item);break;case"D":case"E":i[r.path[o]]=r.lhs;break;case"N":delete i[r.path[o]]}}else switch(r.kind){case"A":e(t[n],r.index,r.item);break;case"D":case"E":t[n]=r.lhs;break;case"N":t=s(t,n)}return t}(i[n.path[r]],n.index,n.item);break;case"D":case"E":i[n.path[r]]=n.lhs;break;case"N":delete i[n.path[r]]}}},enumerable:!0},isConflict:{value:function(){return void 0!==g},enumerable:!0},noConflict:{value:function(){return O&&(O.forEach(function(e){e()}),O=null),f},enumerable:!0}});var C={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},S={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},k=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?m()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=S,t.createLogger=m,t.logger=k,t.default=k,Object.defineProperty(t,"__esModule",{value:!0})}(t)}).call(this,n(21))},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(17),o=(a(n(274)),a(n(273))),i=a(n(272));function a(e){return e&&e.__esModule?e:{default:e}}t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,r.createStore)(i.default,e,(0,r.applyMiddleware)(o.default))}},function(e,t,n){"use strict";e.exports=function(e){var t=(e?e.ownerDocument||e:document).defaultView||window;return!(!e||!("function"==typeof t.Node?e instanceof t.Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}},function(e,t,n){"use strict";var r=n(277);e.exports=function(e){return r(e)&&3==e.nodeType}},function(e,t,n){"use strict";var r=n(278);e.exports=function e(t,n){return!(!t||!n)&&(t===n||!r(t)&&(r(n)?e(t,n.parentNode):"contains"in t?t.contains(n):!!t.compareDocumentPosition&&!!(16&t.compareDocumentPosition(n))))}},function(e,t,n){"use strict";var r=Object.prototype.hasOwnProperty;function o(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}e.exports=function(e,t){if(o(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(var a=0;a<n.length;a++)if(!r.call(t,n[a])||!o(e[n[a]],t[n[a]]))return!1;return!0}},function(e,t,n){"use strict";e.exports=function(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}},function(e,t,n){"use strict";var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o={canUseDOM:r,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:r&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:r&&!!window.screen,isInWorker:!r};e.exports=o},function(e,t,n){"use strict";
/** @license React v16.4.0
 * react-dom.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(33),o=n(1),i=n(282),a=n(58),u=n(56),s=n(281),l=n(280),c=n(279),f=n(57);function p(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,o=0;o<t;o++)n+="&args[]="+encodeURIComponent(arguments[o+1]);r(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}o||p("227");var d={_caughtError:null,_hasCaughtError:!1,_rethrowError:null,_hasRethrowError:!1,invokeGuardedCallback:function(e,t,n,r,o,i,a,u,s){(function(e,t,n,r,o,i,a,u,s){this._hasCaughtError=!1,this._caughtError=null;var l=Array.prototype.slice.call(arguments,3);try{t.apply(n,l)}catch(e){this._caughtError=e,this._hasCaughtError=!0}}).apply(d,arguments)},invokeGuardedCallbackAndCatchFirstError:function(e,t,n,r,o,i,a,u,s){if(d.invokeGuardedCallback.apply(this,arguments),d.hasCaughtError()){var l=d.clearCaughtError();d._hasRethrowError||(d._hasRethrowError=!0,d._rethrowError=l)}},rethrowCaughtError:function(){return function(){if(d._hasRethrowError){var e=d._rethrowError;throw d._rethrowError=null,d._hasRethrowError=!1,e}}.apply(d,arguments)},hasCaughtError:function(){return d._hasCaughtError},clearCaughtError:function(){if(d._hasCaughtError){var e=d._caughtError;return d._caughtError=null,d._hasCaughtError=!1,e}p("198")}};var h=null,v={};function m(){if(h)for(var e in v){var t=v[e],n=h.indexOf(e);if(-1<n||p("96",e),!g[n])for(var r in t.extractEvents||p("97",e),g[n]=t,n=t.eventTypes){var o=void 0,i=n[r],a=t,u=r;b.hasOwnProperty(u)&&p("99",u),b[u]=i;var s=i.phasedRegistrationNames;if(s){for(o in s)s.hasOwnProperty(o)&&y(s[o],a,u);o=!0}else i.registrationName?(y(i.registrationName,a,u),o=!0):o=!1;o||p("98",r,e)}}}function y(e,t,n){_[e]&&p("100",e),_[e]=t,w[e]=t.eventTypes[n].dependencies}var g=[],b={},_={},w={};function E(e){h&&p("101"),h=Array.prototype.slice.call(e),m()}function x(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var r=e[t];v.hasOwnProperty(t)&&v[t]===r||(v[t]&&p("102",t),v[t]=r,n=!0)}n&&m()}var O={plugins:g,eventNameDispatchConfigs:b,registrationNameModules:_,registrationNameDependencies:w,possibleRegistrationNames:null,injectEventPluginOrder:E,injectEventPluginsByName:x},C=null,S=null,k=null;function P(e,t,n,r){t=e.type||"unknown-event",e.currentTarget=k(r),d.invokeGuardedCallbackAndCatchFirstError(t,n,void 0,e),e.currentTarget=null}function j(e,t){return null==t&&p("30"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function T(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}var R=null;function N(e,t){if(e){var n=e._dispatchListeners,r=e._dispatchInstances;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)P(e,t,n[o],r[o]);else n&&P(e,t,n,r);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function M(e){return N(e,!0)}function A(e){return N(e,!1)}var D={injectEventPluginOrder:E,injectEventPluginsByName:x};function I(e,t){var n=e.stateNode;if(!n)return null;var r=C(n);if(!r)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(r=!r.disabled)||(r=!("button"===(e=e.type)||"input"===e||"select"===e||"textarea"===e)),e=!r;break e;default:e=!1}return e?null:(n&&"function"!=typeof n&&p("231",t,typeof n),n)}function L(e,t){null!==e&&(R=j(R,e)),e=R,R=null,e&&(T(e,t?M:A),R&&p("95"),d.rethrowCaughtError())}function z(e,t,n,r){for(var o=null,i=0;i<g.length;i++){var a=g[i];a&&(a=a.extractEvents(e,t,n,r))&&(o=j(o,a))}L(o,!1)}var U={injection:D,getListener:I,runEventsInBatch:L,runExtractedEventsInBatch:z},F=Math.random().toString(36).slice(2),B="__reactInternalInstance$"+F,W="__reactEventHandlers$"+F;function q(e){if(e[B])return e[B];for(;!e[B];){if(!e.parentNode)return null;e=e.parentNode}return 5===(e=e[B]).tag||6===e.tag?e:null}function H(e){if(5===e.tag||6===e.tag)return e.stateNode;p("33")}function $(e){return e[W]||null}var V={precacheFiberNode:function(e,t){t[B]=e},getClosestInstanceFromNode:q,getInstanceFromNode:function(e){return!(e=e[B])||5!==e.tag&&6!==e.tag?null:e},getNodeFromInstance:H,getFiberCurrentPropsFromNode:$,updateFiberProps:function(e,t){e[W]=t}};function Y(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function G(e,t,n){for(var r=[];e;)r.push(e),e=Y(e);for(e=r.length;0<e--;)t(r[e],"captured",n);for(e=0;e<r.length;e++)t(r[e],"bubbled",n)}function K(e,t,n){(t=I(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=j(n._dispatchListeners,t),n._dispatchInstances=j(n._dispatchInstances,e))}function Q(e){e&&e.dispatchConfig.phasedRegistrationNames&&G(e._targetInst,K,e)}function X(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst;G(t=t?Y(t):null,K,e)}}function J(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=I(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=j(n._dispatchListeners,t),n._dispatchInstances=j(n._dispatchInstances,e))}function Z(e){e&&e.dispatchConfig.registrationName&&J(e._targetInst,null,e)}function ee(e){T(e,Q)}function te(e,t,n,r){if(n&&r)e:{for(var o=n,i=r,a=0,u=o;u;u=Y(u))a++;u=0;for(var s=i;s;s=Y(s))u++;for(;0<a-u;)o=Y(o),a--;for(;0<u-a;)i=Y(i),u--;for(;a--;){if(o===i||o===i.alternate)break e;o=Y(o),i=Y(i)}o=null}else o=null;for(i=o,o=[];n&&n!==i&&(null===(a=n.alternate)||a!==i);)o.push(n),n=Y(n);for(n=[];r&&r!==i&&(null===(a=r.alternate)||a!==i);)n.push(r),r=Y(r);for(r=0;r<o.length;r++)J(o[r],"bubbled",e);for(e=n.length;0<e--;)J(n[e],"captured",t)}var ne={accumulateTwoPhaseDispatches:ee,accumulateTwoPhaseDispatchesSkipTarget:function(e){T(e,X)},accumulateEnterLeaveDispatches:te,accumulateDirectDispatches:function(e){T(e,Z)}};function re(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n["ms"+e]="MS"+t,n["O"+e]="o"+t.toLowerCase(),n}var oe={animationend:re("Animation","AnimationEnd"),animationiteration:re("Animation","AnimationIteration"),animationstart:re("Animation","AnimationStart"),transitionend:re("Transition","TransitionEnd")},ie={},ae={};function ue(e){if(ie[e])return ie[e];if(!oe[e])return e;var t,n=oe[e];for(t in n)if(n.hasOwnProperty(t)&&t in ae)return ie[e]=n[t];return e}i.canUseDOM&&(ae=document.createElement("div").style,"AnimationEvent"in window||(delete oe.animationend.animation,delete oe.animationiteration.animation,delete oe.animationstart.animation),"TransitionEvent"in window||delete oe.transitionend.transition);var se=ue("animationend"),le=ue("animationiteration"),ce=ue("animationstart"),fe=ue("transitionend"),pe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),de=null;function he(){return!de&&i.canUseDOM&&(de="textContent"in document.documentElement?"textContent":"innerText"),de}var ve={_root:null,_startText:null,_fallbackText:null};function me(){if(ve._fallbackText)return ve._fallbackText;var e,t,n=ve._startText,r=n.length,o=ye(),i=o.length;for(e=0;e<r&&n[e]===o[e];e++);var a=r-e;for(t=1;t<=a&&n[r-t]===o[i-t];t++);return ve._fallbackText=o.slice(e,1<t?1-t:void 0),ve._fallbackText}function ye(){return"value"in ve._root?ve._root.value:ve._root[he()]}var ge="dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances".split(" "),be={type:null,target:null,currentTarget:u.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};function _e(e,t,n,r){for(var o in this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?u.thatReturnsTrue:u.thatReturnsFalse,this.isPropagationStopped=u.thatReturnsFalse,this}function we(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function Ee(e){e instanceof this||p("223"),e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function xe(e){e.eventPool=[],e.getPooled=we,e.release=Ee}a(_e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=u.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=u.thatReturnsTrue)},persist:function(){this.isPersistent=u.thatReturnsTrue},isPersistent:u.thatReturnsFalse,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;for(t=0;t<ge.length;t++)this[ge[t]]=null}}),_e.Interface=be,_e.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var o=new t;return a(o,n.prototype),n.prototype=o,n.prototype.constructor=n,n.Interface=a({},r.Interface,e),n.extend=r.extend,xe(n),n},xe(_e);var Oe=_e.extend({data:null}),Ce=_e.extend({data:null}),Se=[9,13,27,32],ke=i.canUseDOM&&"CompositionEvent"in window,Pe=null;i.canUseDOM&&"documentMode"in document&&(Pe=document.documentMode);var je=i.canUseDOM&&"TextEvent"in window&&!Pe,Te=i.canUseDOM&&(!ke||Pe&&8<Pe&&11>=Pe),Re=String.fromCharCode(32),Ne={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},Me=!1;function Ae(e,t){switch(e){case"keyup":return-1!==Se.indexOf(t.keyCode);case"keydown":return 229!==t.keyCode;case"keypress":case"mousedown":case"blur":return!0;default:return!1}}function De(e){return"object"==typeof(e=e.detail)&&"data"in e?e.data:null}var Ie=!1;var Le={eventTypes:Ne,extractEvents:function(e,t,n,r){var o=void 0,i=void 0;if(ke)e:{switch(e){case"compositionstart":o=Ne.compositionStart;break e;case"compositionend":o=Ne.compositionEnd;break e;case"compositionupdate":o=Ne.compositionUpdate;break e}o=void 0}else Ie?Ae(e,n)&&(o=Ne.compositionEnd):"keydown"===e&&229===n.keyCode&&(o=Ne.compositionStart);return o?(Te&&(Ie||o!==Ne.compositionStart?o===Ne.compositionEnd&&Ie&&(i=me()):(ve._root=r,ve._startText=ye(),Ie=!0)),o=Oe.getPooled(o,t,n,r),i?o.data=i:null!==(i=De(n))&&(o.data=i),ee(o),i=o):i=null,(e=je?function(e,t){switch(e){case"compositionend":return De(t);case"keypress":return 32!==t.which?null:(Me=!0,Re);case"textInput":return(e=t.data)===Re&&Me?null:e;default:return null}}(e,n):function(e,t){if(Ie)return"compositionend"===e||!ke&&Ae(e,t)?(e=me(),ve._root=null,ve._startText=null,ve._fallbackText=null,Ie=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Te?null:t.data;default:return null}}(e,n))?((t=Ce.getPooled(Ne.beforeInput,t,n,r)).data=e,ee(t)):t=null,null===i?t:null===t?i:[i,t]}},ze=null,Ue={injectFiberControlledHostComponent:function(e){ze=e}},Fe=null,Be=null;function We(e){if(e=S(e)){ze&&"function"==typeof ze.restoreControlledState||p("194");var t=C(e.stateNode);ze.restoreControlledState(e.stateNode,e.type,t)}}function qe(e){Fe?Be?Be.push(e):Be=[e]:Fe=e}function He(){return null!==Fe||null!==Be}function $e(){if(Fe){var e=Fe,t=Be;if(Be=Fe=null,We(e),t)for(e=0;e<t.length;e++)We(t[e])}}var Ve={injection:Ue,enqueueStateRestore:qe,needsStateRestore:He,restoreStateIfNeeded:$e};function Ye(e,t){return e(t)}function Ge(e,t,n){return e(t,n)}function Ke(){}var Qe=!1;function Xe(e,t){if(Qe)return e(t);Qe=!0;try{return Ye(e,t)}finally{Qe=!1,He()&&(Ke(),$e())}}var Je={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ze(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!Je[e.type]:"textarea"===t}function et(e){return(e=e.target||window).correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function tt(e,t){return!(!i.canUseDOM||t&&!("addEventListener"in document))&&((t=(e="on"+e)in document)||((t=document.createElement("div")).setAttribute(e,"return;"),t="function"==typeof t[e]),t)}function nt(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function rt(e){e._valueTracker||(e._valueTracker=function(e){var t=nt(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&void 0!==n&&"function"==typeof n.get&&"function"==typeof n.set){var o=n.get,i=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(e){r=""+e,i.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}(e))}function ot(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=nt(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}var it=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,at="function"==typeof Symbol&&Symbol.for,ut=at?Symbol.for("react.element"):60103,st=at?Symbol.for("react.portal"):60106,lt=at?Symbol.for("react.fragment"):60107,ct=at?Symbol.for("react.strict_mode"):60108,ft=at?Symbol.for("react.profiler"):60114,pt=at?Symbol.for("react.provider"):60109,dt=at?Symbol.for("react.context"):60110,ht=at?Symbol.for("react.async_mode"):60111,vt=at?Symbol.for("react.forward_ref"):60112,mt=at?Symbol.for("react.timeout"):60113,yt="function"==typeof Symbol&&Symbol.iterator;function gt(e){return null===e||void 0===e?null:"function"==typeof(e=yt&&e[yt]||e["@@iterator"])?e:null}function bt(e){var t=e.type;if("function"==typeof t)return t.displayName||t.name;if("string"==typeof t)return t;switch(t){case ht:return"AsyncMode";case dt:return"Context.Consumer";case lt:return"ReactFragment";case st:return"ReactPortal";case ft:return"Profiler("+e.pendingProps.id+")";case pt:return"Context.Provider";case ct:return"StrictMode";case mt:return"Timeout"}if("object"==typeof t&&null!==t)switch(t.$$typeof){case vt:return""!==(e=t.render.displayName||t.render.name||"")?"ForwardRef("+e+")":"ForwardRef"}return null}function _t(e){var t="";do{e:switch(e.tag){case 0:case 1:case 2:case 5:var n=e._debugOwner,r=e._debugSource,o=bt(e),i=null;n&&(i=bt(n)),n=r,o="\n    in "+(o||"Unknown")+(n?" (at "+n.fileName.replace(/^.*[\\\/]/,"")+":"+n.lineNumber+")":i?" (created by "+i+")":"");break e;default:o=""}t+=o,e=e.return}while(e);return t}var wt=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Et={},xt={};function Ot(e,t,n,r,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t}var Ct={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Ct[e]=new Ot(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];Ct[t]=new Ot(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){Ct[e]=new Ot(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","preserveAlpha"].forEach(function(e){Ct[e]=new Ot(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Ct[e]=new Ot(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){Ct[e]=new Ot(e,3,!0,e.toLowerCase(),null)}),["capture","download"].forEach(function(e){Ct[e]=new Ot(e,4,!1,e.toLowerCase(),null)}),["cols","rows","size","span"].forEach(function(e){Ct[e]=new Ot(e,6,!1,e.toLowerCase(),null)}),["rowSpan","start"].forEach(function(e){Ct[e]=new Ot(e,5,!1,e.toLowerCase(),null)});var St=/[\-:]([a-z])/g;function kt(e){return e[1].toUpperCase()}function Pt(e,t,n,r){var o=Ct.hasOwnProperty(t)?Ct[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(function(e,t,n,r){if(null===t||void 0===t||function(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,n,r))return!0;if(r)return!1;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}(t,n,o,r)&&(n=null),r||null===o?function(e){return!!xt.hasOwnProperty(e)||!Et.hasOwnProperty(e)&&(wt.test(e)?xt[e]=!0:(Et[e]=!0,!1))}(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(n=3===(o=o.type)||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function jt(e,t){var n=t.checked;return a({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function Tt(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=Dt(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function Rt(e,t){null!=(t=t.checked)&&Pt(e,"checked",t,!1)}function Nt(e,t){Rt(e,t);var n=Dt(t.value);null!=n&&("number"===t.type?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n)),t.hasOwnProperty("value")?At(e,t.type,n):t.hasOwnProperty("defaultValue")&&At(e,t.type,Dt(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function Mt(e,t){(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue"))&&(""===e.value&&(e.value=""+e._wrapperState.initialValue),e.defaultValue=""+e._wrapperState.initialValue),""!==(t=e.name)&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!e.defaultChecked,""!==t&&(e.name=t)}function At(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}function Dt(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(St,kt);Ct[t]=new Ot(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(St,kt);Ct[t]=new Ot(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(St,kt);Ct[t]=new Ot(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),Ct.tabIndex=new Ot("tabIndex",1,!1,"tabindex",null);var It={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Lt(e,t,n){return(e=_e.getPooled(It.change,e,t,n)).type="change",qe(n),ee(e),e}var zt=null,Ut=null;function Ft(e){L(e,!1)}function Bt(e){if(ot(H(e)))return e}function Wt(e,t){if("change"===e)return t}var qt=!1;function Ht(){zt&&(zt.detachEvent("onpropertychange",$t),Ut=zt=null)}function $t(e){"value"===e.propertyName&&Bt(Ut)&&Xe(Ft,e=Lt(Ut,e,et(e)))}function Vt(e,t,n){"focus"===e?(Ht(),Ut=n,(zt=t).attachEvent("onpropertychange",$t)):"blur"===e&&Ht()}function Yt(e){if("selectionchange"===e||"keyup"===e||"keydown"===e)return Bt(Ut)}function Gt(e,t){if("click"===e)return Bt(t)}function Kt(e,t){if("input"===e||"change"===e)return Bt(t)}i.canUseDOM&&(qt=tt("input")&&(!document.documentMode||9<document.documentMode));var Qt={eventTypes:It,_isInputEventSupported:qt,extractEvents:function(e,t,n,r){var o=t?H(t):window,i=void 0,a=void 0,u=o.nodeName&&o.nodeName.toLowerCase();if("select"===u||"input"===u&&"file"===o.type?i=Wt:Ze(o)?qt?i=Kt:(i=Yt,a=Vt):(u=o.nodeName)&&"input"===u.toLowerCase()&&("checkbox"===o.type||"radio"===o.type)&&(i=Gt),i&&(i=i(e,t)))return Lt(i,n,r);a&&a(e,o,t),"blur"===e&&null!=t&&(e=t._wrapperState||o._wrapperState)&&e.controlled&&"number"===o.type&&At(o,"number",o.value)}},Xt=_e.extend({view:null,detail:null}),Jt={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Zt(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=Jt[e])&&!!t[e]}function en(){return Zt}var tn=Xt.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:en,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)}}),nn=tn.extend({pointerId:null,width:null,height:null,pressure:null,tiltX:null,tiltY:null,pointerType:null,isPrimary:null}),rn={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",dependencies:["pointerout","pointerover"]}},on={eventTypes:rn,extractEvents:function(e,t,n,r){var o="mouseover"===e||"pointerover"===e,i="mouseout"===e||"pointerout"===e;if(o&&(n.relatedTarget||n.fromElement)||!i&&!o)return null;if(o=r.window===r?r:(o=r.ownerDocument)?o.defaultView||o.parentWindow:window,i?(i=t,t=(t=n.relatedTarget||n.toElement)?q(t):null):i=null,i===t)return null;var a=void 0,u=void 0,s=void 0,l=void 0;return"mouseout"===e||"mouseover"===e?(a=tn,u=rn.mouseLeave,s=rn.mouseEnter,l="mouse"):"pointerout"!==e&&"pointerover"!==e||(a=nn,u=rn.pointerLeave,s=rn.pointerEnter,l="pointer"),e=null==i?o:H(i),o=null==t?o:H(t),(u=a.getPooled(u,i,n,r)).type=l+"leave",u.target=e,u.relatedTarget=o,(n=a.getPooled(s,t,n,r)).type=l+"enter",n.target=o,n.relatedTarget=e,te(u,n,i,t),[u,n]}};function an(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!=(2&t.effectTag))return 1;for(;t.return;)if(0!=(2&(t=t.return).effectTag))return 1}return 3===t.tag?2:3}function un(e){2!==an(e)&&p("188")}function sn(e){var t=e.alternate;if(!t)return 3===(t=an(e))&&p("188"),1===t?null:e;for(var n=e,r=t;;){var o=n.return,i=o?o.alternate:null;if(!o||!i)break;if(o.child===i.child){for(var a=o.child;a;){if(a===n)return un(o),e;if(a===r)return un(o),t;a=a.sibling}p("188")}if(n.return!==r.return)n=o,r=i;else{a=!1;for(var u=o.child;u;){if(u===n){a=!0,n=o,r=i;break}if(u===r){a=!0,r=o,n=i;break}u=u.sibling}if(!a){for(u=i.child;u;){if(u===n){a=!0,n=i,r=o;break}if(u===r){a=!0,r=i,n=o;break}u=u.sibling}a||p("189")}}n.alternate!==r&&p("190")}return 3!==n.tag&&p("188"),n.stateNode.current===n?e:t}function ln(e){if(!(e=sn(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}var cn=_e.extend({animationName:null,elapsedTime:null,pseudoElement:null}),fn=_e.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),pn=Xt.extend({relatedTarget:null});function dn(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}var hn={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},vn={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},mn=Xt.extend({key:function(e){if(e.key){var t=hn[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?13===(e=dn(e))?"Enter":String.fromCharCode(e):"keydown"===e.type||"keyup"===e.type?vn[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:en,charCode:function(e){return"keypress"===e.type?dn(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?dn(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),yn=tn.extend({dataTransfer:null}),gn=Xt.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:en}),bn=_e.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),_n=tn.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),wn=[["abort","abort"],[se,"animationEnd"],[le,"animationIteration"],[ce,"animationStart"],["canplay","canPlay"],["canplaythrough","canPlayThrough"],["drag","drag"],["dragenter","dragEnter"],["dragexit","dragExit"],["dragleave","dragLeave"],["dragover","dragOver"],["durationchange","durationChange"],["emptied","emptied"],["encrypted","encrypted"],["ended","ended"],["error","error"],["gotpointercapture","gotPointerCapture"],["load","load"],["loadeddata","loadedData"],["loadedmetadata","loadedMetadata"],["loadstart","loadStart"],["lostpointercapture","lostPointerCapture"],["mousemove","mouseMove"],["mouseout","mouseOut"],["mouseover","mouseOver"],["playing","playing"],["pointermove","pointerMove"],["pointerout","pointerOut"],["pointerover","pointerOver"],["progress","progress"],["scroll","scroll"],["seeking","seeking"],["stalled","stalled"],["suspend","suspend"],["timeupdate","timeUpdate"],["toggle","toggle"],["touchmove","touchMove"],[fe,"transitionEnd"],["waiting","waiting"],["wheel","wheel"]],En={},xn={};function On(e,t){var n=e[0],r="on"+((e=e[1])[0].toUpperCase()+e.slice(1));t={phasedRegistrationNames:{bubbled:r,captured:r+"Capture"},dependencies:[n],isInteractive:t},En[e]=t,xn[n]=t}[["blur","blur"],["cancel","cancel"],["click","click"],["close","close"],["contextmenu","contextMenu"],["copy","copy"],["cut","cut"],["dblclick","doubleClick"],["dragend","dragEnd"],["dragstart","dragStart"],["drop","drop"],["focus","focus"],["input","input"],["invalid","invalid"],["keydown","keyDown"],["keypress","keyPress"],["keyup","keyUp"],["mousedown","mouseDown"],["mouseup","mouseUp"],["paste","paste"],["pause","pause"],["play","play"],["pointercancel","pointerCancel"],["pointerdown","pointerDown"],["pointerup","pointerUp"],["ratechange","rateChange"],["reset","reset"],["seeked","seeked"],["submit","submit"],["touchcancel","touchCancel"],["touchend","touchEnd"],["touchstart","touchStart"],["volumechange","volumeChange"]].forEach(function(e){On(e,!0)}),wn.forEach(function(e){On(e,!1)});var Cn={eventTypes:En,isInteractiveTopLevelEventType:function(e){return void 0!==(e=xn[e])&&!0===e.isInteractive},extractEvents:function(e,t,n,r){var o=xn[e];if(!o)return null;switch(e){case"keypress":if(0===dn(n))return null;case"keydown":case"keyup":e=mn;break;case"blur":case"focus":e=pn;break;case"click":if(2===n.button)return null;case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":e=tn;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":e=yn;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":e=gn;break;case se:case le:case ce:e=cn;break;case fe:e=bn;break;case"scroll":e=Xt;break;case"wheel":e=_n;break;case"copy":case"cut":case"paste":e=fn;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":e=nn;break;default:e=_e}return ee(t=e.getPooled(o,t,n,r)),t}},Sn=Cn.isInteractiveTopLevelEventType,kn=[];function Pn(e){var t=e.targetInst;do{if(!t){e.ancestors.push(t);break}var n;for(n=t;n.return;)n=n.return;if(!(n=3!==n.tag?null:n.stateNode.containerInfo))break;e.ancestors.push(t),t=q(n)}while(t);for(n=0;n<e.ancestors.length;n++)t=e.ancestors[n],z(e.topLevelType,t,e.nativeEvent,et(e.nativeEvent))}var jn=!0;function Tn(e){jn=!!e}function Rn(e,t){if(!t)return null;var n=(Sn(e)?Mn:An).bind(null,e);t.addEventListener(e,n,!1)}function Nn(e,t){if(!t)return null;var n=(Sn(e)?Mn:An).bind(null,e);t.addEventListener(e,n,!0)}function Mn(e,t){Ge(An,e,t)}function An(e,t){if(jn){var n=et(t);if(null===(n=q(n))||"number"!=typeof n.tag||2===an(n)||(n=null),kn.length){var r=kn.pop();r.topLevelType=e,r.nativeEvent=t,r.targetInst=n,e=r}else e={topLevelType:e,nativeEvent:t,targetInst:n,ancestors:[]};try{Xe(Pn,e)}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>kn.length&&kn.push(e)}}}var Dn={get _enabled(){return jn},setEnabled:Tn,isEnabled:function(){return jn},trapBubbledEvent:Rn,trapCapturedEvent:Nn,dispatchEvent:An},In={},Ln=0,zn="_reactListenersID"+(""+Math.random()).slice(2);function Un(e){return Object.prototype.hasOwnProperty.call(e,zn)||(e[zn]=Ln++,In[e[zn]]={}),In[e[zn]]}function Fn(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Bn(e,t){var n,r=Fn(e);for(e=0;r;){if(3===r.nodeType){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Fn(r)}}function Wn(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&"text"===e.type||"textarea"===t||"true"===e.contentEditable)}var qn=i.canUseDOM&&"documentMode"in document&&11>=document.documentMode,Hn={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu focus keydown keyup mousedown mouseup selectionchange".split(" ")}},$n=null,Vn=null,Yn=null,Gn=!1;function Kn(e,t){if(Gn||null==$n||$n!==s())return null;var n=$n;return"selectionStart"in n&&Wn(n)?n={start:n.selectionStart,end:n.selectionEnd}:window.getSelection?n={anchorNode:(n=window.getSelection()).anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}:n=void 0,Yn&&l(Yn,n)?null:(Yn=n,(e=_e.getPooled(Hn.select,Vn,e,t)).type="select",e.target=$n,ee(e),e)}var Qn={eventTypes:Hn,extractEvents:function(e,t,n,r){var o,i=r.window===r?r.document:9===r.nodeType?r:r.ownerDocument;if(!(o=!i)){e:{i=Un(i),o=w.onSelect;for(var a=0;a<o.length;a++){var u=o[a];if(!i.hasOwnProperty(u)||!i[u]){i=!1;break e}}i=!0}o=!i}if(o)return null;switch(i=t?H(t):window,e){case"focus":(Ze(i)||"true"===i.contentEditable)&&($n=i,Vn=t,Yn=null);break;case"blur":Yn=Vn=$n=null;break;case"mousedown":Gn=!0;break;case"contextmenu":case"mouseup":return Gn=!1,Kn(n,r);case"selectionchange":if(qn)break;case"keydown":case"keyup":return Kn(n,r)}return null}};D.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),C=V.getFiberCurrentPropsFromNode,S=V.getInstanceFromNode,k=V.getNodeFromInstance,D.injectEventPluginsByName({SimpleEventPlugin:Cn,EnterLeaveEventPlugin:on,ChangeEventPlugin:Qt,SelectEventPlugin:Qn,BeforeInputEventPlugin:Le});var Xn=void 0;Xn="object"==typeof performance&&"function"==typeof performance.now?function(){return performance.now()}:function(){return Date.now()};var Jn=void 0,Zn=void 0;if(i.canUseDOM){var er=[],tr=0,nr={},rr=-1,or=!1,ir=!1,ar=0,ur=33,sr=33,lr={didTimeout:!1,timeRemaining:function(){var e=ar-Xn();return 0<e?e:0}},cr=function(e,t){if(nr[t])try{e(lr)}finally{delete nr[t]}},fr="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(e){if(e.source===window&&e.data===fr&&(or=!1,0!==er.length)){if(0!==er.length&&(e=Xn(),!(-1===rr||rr>e))){rr=-1,lr.didTimeout=!0;for(var t=0,n=er.length;t<n;t++){var r=er[t],o=r.timeoutTime;-1!==o&&o<=e?cr(r.scheduledCallback,r.callbackId):-1!==o&&(-1===rr||o<rr)&&(rr=o)}}for(e=Xn();0<ar-e&&0<er.length;)e=er.shift(),lr.didTimeout=!1,cr(e.scheduledCallback,e.callbackId),e=Xn();0<er.length&&!ir&&(ir=!0,requestAnimationFrame(pr))}},!1);var pr=function(e){ir=!1;var t=e-ar+sr;t<sr&&ur<sr?(8>t&&(t=8),sr=t<ur?ur:t):ur=t,ar=e+sr,or||(or=!0,window.postMessage(fr,"*"))};Jn=function(e,t){var n=-1;return null!=t&&"number"==typeof t.timeout&&(n=Xn()+t.timeout),(-1===rr||-1!==n&&n<rr)&&(rr=n),t=++tr,er.push({scheduledCallback:e,callbackId:t,timeoutTime:n}),nr[t]=!0,ir||(ir=!0,requestAnimationFrame(pr)),t},Zn=function(e){delete nr[e]}}else{var dr=0,hr={};Jn=function(e){var t=dr++,n=setTimeout(function(){e({timeRemaining:function(){return 1/0},didTimeout:!1})});return hr[t]=n,t},Zn=function(e){var t=hr[e];delete hr[e],clearTimeout(t)}}function vr(e,t){return e=a({children:void 0},t),(t=function(e){var t="";return o.Children.forEach(e,function(e){null==e||"string"!=typeof e&&"number"!=typeof e||(t+=e)}),t}(t.children))&&(e.children=t),e}function mr(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+n,t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function yr(e,t){var n=t.value;e._wrapperState={initialValue:null!=n?n:t.defaultValue,wasMultiple:!!t.multiple}}function gr(e,t){return null!=t.dangerouslySetInnerHTML&&p("91"),a({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function br(e,t){var n=t.value;null==n&&(n=t.defaultValue,null!=(t=t.children)&&(null!=n&&p("92"),Array.isArray(t)&&(1>=t.length||p("93"),t=t[0]),n=""+t),null==n&&(n="")),e._wrapperState={initialValue:""+n}}function _r(e,t){var n=t.value;null!=n&&((n=""+n)!==e.value&&(e.value=n),null==t.defaultValue&&(e.defaultValue=n)),null!=t.defaultValue&&(e.defaultValue=t.defaultValue)}function wr(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}var Er={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function xr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Or(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?xr(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}var Cr,Sr=void 0,kr=(Cr=function(e,t){if(e.namespaceURI!==Er.svg||"innerHTML"in e)e.innerHTML=t;else{for((Sr=Sr||document.createElement("div")).innerHTML="<svg>"+t+"</svg>",t=Sr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}},"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(e,t,n,r){MSApp.execUnsafeLocalFunction(function(){return Cr(e,t)})}:Cr);function Pr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}var jr={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Tr=["Webkit","ms","Moz","O"];function Rr(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=n,i=t[n];o=null==i||"boolean"==typeof i||""===i?"":r||"number"!=typeof i||0===i||jr.hasOwnProperty(o)&&jr[o]?(""+i).trim():i+"px","float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}Object.keys(jr).forEach(function(e){Tr.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),jr[t]=jr[e]})});var Nr=a({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Mr(e,t,n){t&&(Nr[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&p("137",e,n()),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&p("60"),"object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML||p("61")),null!=t.style&&"object"!=typeof t.style&&p("62",n()))}function Ar(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Dr=u.thatReturns("");function Ir(e,t){var n=Un(e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument);t=w[t];for(var r=0;r<t.length;r++){var o=t[r];if(!n.hasOwnProperty(o)||!n[o]){switch(o){case"scroll":Nn("scroll",e);break;case"focus":case"blur":Nn("focus",e),Nn("blur",e),n.blur=!0,n.focus=!0;break;case"cancel":case"close":tt(o,!0)&&Nn(o,e);break;case"invalid":case"submit":case"reset":break;default:-1===pe.indexOf(o)&&Rn(o,e)}n[o]=!0}}}function Lr(e,t,n,r){return n=9===n.nodeType?n:n.ownerDocument,r===Er.html&&(r=xr(e)),r===Er.html?"script"===e?((e=n.createElement("div")).innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):e="string"==typeof t.is?n.createElement(e,{is:t.is}):n.createElement(e):e=n.createElementNS(r,e),e}function zr(e,t){return(9===t.nodeType?t:t.ownerDocument).createTextNode(e)}function Ur(e,t,n,r){var o=Ar(t,n);switch(t){case"iframe":case"object":Rn("load",e);var i=n;break;case"video":case"audio":for(i=0;i<pe.length;i++)Rn(pe[i],e);i=n;break;case"source":Rn("error",e),i=n;break;case"img":case"image":case"link":Rn("error",e),Rn("load",e),i=n;break;case"form":Rn("reset",e),Rn("submit",e),i=n;break;case"details":Rn("toggle",e),i=n;break;case"input":Tt(e,n),i=jt(e,n),Rn("invalid",e),Ir(r,"onChange");break;case"option":i=vr(e,n);break;case"select":yr(e,n),i=a({},n,{value:void 0}),Rn("invalid",e),Ir(r,"onChange");break;case"textarea":br(e,n),i=gr(e,n),Rn("invalid",e),Ir(r,"onChange");break;default:i=n}Mr(t,i,Dr);var s,l=i;for(s in l)if(l.hasOwnProperty(s)){var c=l[s];"style"===s?Rr(e,c):"dangerouslySetInnerHTML"===s?null!=(c=c?c.__html:void 0)&&kr(e,c):"children"===s?"string"==typeof c?("textarea"!==t||""!==c)&&Pr(e,c):"number"==typeof c&&Pr(e,""+c):"suppressContentEditableWarning"!==s&&"suppressHydrationWarning"!==s&&"autoFocus"!==s&&(_.hasOwnProperty(s)?null!=c&&Ir(r,s):null!=c&&Pt(e,s,c,o))}switch(t){case"input":rt(e),Mt(e,n);break;case"textarea":rt(e),wr(e);break;case"option":null!=n.value&&e.setAttribute("value",n.value);break;case"select":e.multiple=!!n.multiple,null!=(t=n.value)?mr(e,!!n.multiple,t,!1):null!=n.defaultValue&&mr(e,!!n.multiple,n.defaultValue,!0);break;default:"function"==typeof i.onClick&&(e.onclick=u)}}function Fr(e,t,n,r,o){var i=null;switch(t){case"input":n=jt(e,n),r=jt(e,r),i=[];break;case"option":n=vr(e,n),r=vr(e,r),i=[];break;case"select":n=a({},n,{value:void 0}),r=a({},r,{value:void 0}),i=[];break;case"textarea":n=gr(e,n),r=gr(e,r),i=[];break;default:"function"!=typeof n.onClick&&"function"==typeof r.onClick&&(e.onclick=u)}Mr(t,r,Dr),t=e=void 0;var s=null;for(e in n)if(!r.hasOwnProperty(e)&&n.hasOwnProperty(e)&&null!=n[e])if("style"===e){var l=n[e];for(t in l)l.hasOwnProperty(t)&&(s||(s={}),s[t]="")}else"dangerouslySetInnerHTML"!==e&&"children"!==e&&"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&"autoFocus"!==e&&(_.hasOwnProperty(e)?i||(i=[]):(i=i||[]).push(e,null));for(e in r){var c=r[e];if(l=null!=n?n[e]:void 0,r.hasOwnProperty(e)&&c!==l&&(null!=c||null!=l))if("style"===e)if(l){for(t in l)!l.hasOwnProperty(t)||c&&c.hasOwnProperty(t)||(s||(s={}),s[t]="");for(t in c)c.hasOwnProperty(t)&&l[t]!==c[t]&&(s||(s={}),s[t]=c[t])}else s||(i||(i=[]),i.push(e,s)),s=c;else"dangerouslySetInnerHTML"===e?(c=c?c.__html:void 0,l=l?l.__html:void 0,null!=c&&l!==c&&(i=i||[]).push(e,""+c)):"children"===e?l===c||"string"!=typeof c&&"number"!=typeof c||(i=i||[]).push(e,""+c):"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&(_.hasOwnProperty(e)?(null!=c&&Ir(o,e),i||l===c||(i=[])):(i=i||[]).push(e,c))}return s&&(i=i||[]).push("style",s),i}function Br(e,t,n,r,o){"input"===n&&"radio"===o.type&&null!=o.name&&Rt(e,o),Ar(n,r),r=Ar(n,o);for(var i=0;i<t.length;i+=2){var a=t[i],u=t[i+1];"style"===a?Rr(e,u):"dangerouslySetInnerHTML"===a?kr(e,u):"children"===a?Pr(e,u):Pt(e,a,u,r)}switch(n){case"input":Nt(e,o);break;case"textarea":_r(e,o);break;case"select":e._wrapperState.initialValue=void 0,t=e._wrapperState.wasMultiple,e._wrapperState.wasMultiple=!!o.multiple,null!=(n=o.value)?mr(e,!!o.multiple,n,!1):t!==!!o.multiple&&(null!=o.defaultValue?mr(e,!!o.multiple,o.defaultValue,!0):mr(e,!!o.multiple,o.multiple?[]:"",!1))}}function Wr(e,t,n,r,o){switch(t){case"iframe":case"object":Rn("load",e);break;case"video":case"audio":for(r=0;r<pe.length;r++)Rn(pe[r],e);break;case"source":Rn("error",e);break;case"img":case"image":case"link":Rn("error",e),Rn("load",e);break;case"form":Rn("reset",e),Rn("submit",e);break;case"details":Rn("toggle",e);break;case"input":Tt(e,n),Rn("invalid",e),Ir(o,"onChange");break;case"select":yr(e,n),Rn("invalid",e),Ir(o,"onChange");break;case"textarea":br(e,n),Rn("invalid",e),Ir(o,"onChange")}for(var i in Mr(t,n,Dr),r=null,n)if(n.hasOwnProperty(i)){var a=n[i];"children"===i?"string"==typeof a?e.textContent!==a&&(r=["children",a]):"number"==typeof a&&e.textContent!==""+a&&(r=["children",""+a]):_.hasOwnProperty(i)&&null!=a&&Ir(o,i)}switch(t){case"input":rt(e),Mt(e,n);break;case"textarea":rt(e),wr(e);break;case"select":case"option":break;default:"function"==typeof n.onClick&&(e.onclick=u)}return r}function qr(e,t){return e.nodeValue!==t}var Hr={createElement:Lr,createTextNode:zr,setInitialProperties:Ur,diffProperties:Fr,updateProperties:Br,diffHydratedProperties:Wr,diffHydratedText:qr,warnForUnmatchedText:function(){},warnForDeletedHydratableElement:function(){},warnForDeletedHydratableText:function(){},warnForInsertedHydratedElement:function(){},warnForInsertedHydratedText:function(){},restoreControlledState:function(e,t,n){switch(t){case"input":if(Nt(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=$(r);o||p("90"),ot(r),Nt(r,o)}}}break;case"textarea":_r(e,n);break;case"select":null!=(t=n.value)&&mr(e,!!n.multiple,t,!1)}}},$r=null,Vr=null;function Yr(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function Gr(e,t){return"textarea"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&"string"==typeof t.dangerouslySetInnerHTML.__html}var Kr=Xn,Qr=Jn,Xr=Zn;function Jr(e){for(e=e.nextSibling;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}function Zr(e){for(e=e.firstChild;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e}new Set;var eo=[],to=-1;function no(e){return{current:e}}function ro(e){0>to||(e.current=eo[to],eo[to]=null,to--)}function oo(e,t){eo[++to]=e.current,e.current=t}var io=no(f),ao=no(!1),uo=f;function so(e){return co(e)?uo:io.current}function lo(e,t){var n=e.type.contextTypes;if(!n)return f;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o,i={};for(o in n)i[o]=t[o];return r&&((e=e.stateNode).__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function co(e){return 2===e.tag&&null!=e.type.childContextTypes}function fo(e){co(e)&&(ro(ao),ro(io))}function po(e){ro(ao),ro(io)}function ho(e,t,n){io.current!==f&&p("168"),oo(io,t),oo(ao,n)}function vo(e,t){var n=e.stateNode,r=e.type.childContextTypes;if("function"!=typeof n.getChildContext)return t;for(var o in n=n.getChildContext())o in r||p("108",bt(e)||"Unknown",o);return a({},t,n)}function mo(e){if(!co(e))return!1;var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||f,uo=io.current,oo(io,t),oo(ao,ao.current),!0}function yo(e,t){var n=e.stateNode;if(n||p("169"),t){var r=vo(e,uo);n.__reactInternalMemoizedMergedChildContext=r,ro(ao),ro(io),oo(io,r)}else ro(ao);oo(ao,t)}function go(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=null,this.index=0,this.ref=null,this.pendingProps=t,this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.expirationTime=0,this.alternate=null}function bo(e,t,n){var r=e.alternate;return null===r?((r=new go(e.tag,t,e.key,e.mode)).type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.effectTag=0,r.nextEffect=null,r.firstEffect=null,r.lastEffect=null),r.expirationTime=n,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function _o(e,t,n){var r=e.type,o=e.key;if(e=e.props,"function"==typeof r)var i=r.prototype&&r.prototype.isReactComponent?2:0;else if("string"==typeof r)i=5;else switch(r){case lt:return wo(e.children,t,n,o);case ht:i=11,t|=3;break;case ct:i=11,t|=2;break;case ft:return(r=new go(15,e,o,4|t)).type=ft,r.expirationTime=n,r;case mt:i=16,t|=2;break;default:e:{switch("object"==typeof r&&null!==r?r.$$typeof:null){case pt:i=13;break e;case dt:i=12;break e;case vt:i=14;break e;default:p("130",null==r?r:typeof r,"")}i=void 0}}return(t=new go(i,e,o,t)).type=r,t.expirationTime=n,t}function wo(e,t,n,r){return(e=new go(10,e,r,t)).expirationTime=n,e}function Eo(e,t,n){return(e=new go(6,e,null,t)).expirationTime=n,e}function xo(e,t,n){return(t=new go(4,null!==e.children?e.children:[],e.key,t)).expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Oo(e,t,n){return e={current:t=new go(3,null,null,t?3:0),containerInfo:e,pendingChildren:null,earliestPendingTime:0,latestPendingTime:0,earliestSuspendedTime:0,latestSuspendedTime:0,latestPingedTime:0,pendingCommitExpirationTime:0,finishedWork:null,context:null,pendingContext:null,hydrate:n,remainingExpirationTime:0,firstBatch:null,nextScheduledRoot:null},t.stateNode=e}var Co=null,So=null;function ko(e){return function(t){try{return e(t)}catch(e){}}}function Po(e){"function"==typeof Co&&Co(e)}function jo(e){"function"==typeof So&&So(e)}var To=!1;function Ro(e){return{expirationTime:0,baseState:e,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function No(e){return{expirationTime:e.expirationTime,baseState:e.baseState,firstUpdate:e.firstUpdate,lastUpdate:e.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function Mo(e){return{expirationTime:e,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function Ao(e,t,n){null===e.lastUpdate?e.firstUpdate=e.lastUpdate=t:(e.lastUpdate.next=t,e.lastUpdate=t),(0===e.expirationTime||e.expirationTime>n)&&(e.expirationTime=n)}function Do(e,t,n){var r=e.alternate;if(null===r){var o=e.updateQueue,i=null;null===o&&(o=e.updateQueue=Ro(e.memoizedState))}else o=e.updateQueue,i=r.updateQueue,null===o?null===i?(o=e.updateQueue=Ro(e.memoizedState),i=r.updateQueue=Ro(r.memoizedState)):o=e.updateQueue=No(i):null===i&&(i=r.updateQueue=No(o));null===i||o===i?Ao(o,t,n):null===o.lastUpdate||null===i.lastUpdate?(Ao(o,t,n),Ao(i,t,n)):(Ao(o,t,n),i.lastUpdate=t)}function Io(e,t,n){var r=e.updateQueue;null===(r=null===r?e.updateQueue=Ro(e.memoizedState):Lo(e,r)).lastCapturedUpdate?r.firstCapturedUpdate=r.lastCapturedUpdate=t:(r.lastCapturedUpdate.next=t,r.lastCapturedUpdate=t),(0===r.expirationTime||r.expirationTime>n)&&(r.expirationTime=n)}function Lo(e,t){var n=e.alternate;return null!==n&&t===n.updateQueue&&(t=e.updateQueue=No(t)),t}function zo(e,t,n,r,o,i){switch(n.tag){case 1:return"function"==typeof(e=n.payload)?e.call(i,r,o):e;case 3:e.effectTag=-1025&e.effectTag|64;case 0:if(null===(o="function"==typeof(e=n.payload)?e.call(i,r,o):e)||void 0===o)break;return a({},r,o);case 2:To=!0}return r}function Uo(e,t,n,r,o){if(To=!1,!(0===t.expirationTime||t.expirationTime>o)){for(var i=(t=Lo(e,t)).baseState,a=null,u=0,s=t.firstUpdate,l=i;null!==s;){var c=s.expirationTime;c>o?(null===a&&(a=s,i=l),(0===u||u>c)&&(u=c)):(l=zo(e,0,s,l,n,r),null!==s.callback&&(e.effectTag|=32,s.nextEffect=null,null===t.lastEffect?t.firstEffect=t.lastEffect=s:(t.lastEffect.nextEffect=s,t.lastEffect=s))),s=s.next}for(c=null,s=t.firstCapturedUpdate;null!==s;){var f=s.expirationTime;f>o?(null===c&&(c=s,null===a&&(i=l)),(0===u||u>f)&&(u=f)):(l=zo(e,0,s,l,n,r),null!==s.callback&&(e.effectTag|=32,s.nextEffect=null,null===t.lastCapturedEffect?t.firstCapturedEffect=t.lastCapturedEffect=s:(t.lastCapturedEffect.nextEffect=s,t.lastCapturedEffect=s))),s=s.next}null===a&&(t.lastUpdate=null),null===c?t.lastCapturedUpdate=null:e.effectTag|=32,null===a&&null===c&&(i=l),t.baseState=i,t.firstUpdate=a,t.firstCapturedUpdate=c,t.expirationTime=u,e.memoizedState=l}}function Fo(e,t){"function"!=typeof e&&p("191",e),e.call(t)}function Bo(e,t,n){for(null!==t.firstCapturedUpdate&&(null!==t.lastUpdate&&(t.lastUpdate.next=t.firstCapturedUpdate,t.lastUpdate=t.lastCapturedUpdate),t.firstCapturedUpdate=t.lastCapturedUpdate=null),e=t.firstEffect,t.firstEffect=t.lastEffect=null;null!==e;){var r=e.callback;null!==r&&(e.callback=null,Fo(r,n)),e=e.nextEffect}for(e=t.firstCapturedEffect,t.firstCapturedEffect=t.lastCapturedEffect=null;null!==e;)null!==(t=e.callback)&&(e.callback=null,Fo(t,n)),e=e.nextEffect}function Wo(e,t){return{value:e,source:t,stack:_t(t)}}var qo=no(null),Ho=no(null),$o=no(0);function Vo(e){var t=e.type._context;oo($o,t._changedBits),oo(Ho,t._currentValue),oo(qo,e),t._currentValue=e.pendingProps.value,t._changedBits=e.stateNode}function Yo(e){var t=$o.current,n=Ho.current;ro(qo),ro(Ho),ro($o),(e=e.type._context)._currentValue=n,e._changedBits=t}var Go={},Ko=no(Go),Qo=no(Go),Xo=no(Go);function Jo(e){return e===Go&&p("174"),e}function Zo(e,t){oo(Xo,t),oo(Qo,e),oo(Ko,Go);var n=t.nodeType;switch(n){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Or(null,"");break;default:t=Or(t=(n=8===n?t.parentNode:t).namespaceURI||null,n=n.tagName)}ro(Ko),oo(Ko,t)}function ei(e){ro(Ko),ro(Qo),ro(Xo)}function ti(e){Qo.current===e&&(ro(Ko),ro(Qo))}function ni(e,t,n){var r=e.memoizedState;r=null===(t=t(n,r))||void 0===t?r:a({},r,t),e.memoizedState=r,null!==(e=e.updateQueue)&&0===e.expirationTime&&(e.baseState=r)}var ri={isMounted:function(e){return!!(e=e._reactInternalFiber)&&2===an(e)},enqueueSetState:function(e,t,n){e=e._reactInternalFiber;var r=va(),o=Mo(r=da(r,e));o.payload=t,void 0!==n&&null!==n&&(o.callback=n),Do(e,o,r),ha(e,r)},enqueueReplaceState:function(e,t,n){e=e._reactInternalFiber;var r=va(),o=Mo(r=da(r,e));o.tag=1,o.payload=t,void 0!==n&&null!==n&&(o.callback=n),Do(e,o,r),ha(e,r)},enqueueForceUpdate:function(e,t){e=e._reactInternalFiber;var n=va(),r=Mo(n=da(n,e));r.tag=2,void 0!==t&&null!==t&&(r.callback=t),Do(e,r,n),ha(e,n)}};function oi(e,t,n,r,o,i){var a=e.stateNode;return e=e.type,"function"==typeof a.shouldComponentUpdate?a.shouldComponentUpdate(n,o,i):!e.prototype||!e.prototype.isPureReactComponent||(!l(t,n)||!l(r,o))}function ii(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&ri.enqueueReplaceState(t,t.state,null)}function ai(e,t){var n=e.type,r=e.stateNode,o=e.pendingProps,i=so(e);r.props=o,r.state=e.memoizedState,r.refs=f,r.context=lo(e,i),null!==(i=e.updateQueue)&&(Uo(e,i,o,r,t),r.state=e.memoizedState),"function"==typeof(i=e.type.getDerivedStateFromProps)&&(ni(e,i,o),r.state=e.memoizedState),"function"==typeof n.getDerivedStateFromProps||"function"==typeof r.getSnapshotBeforeUpdate||"function"!=typeof r.UNSAFE_componentWillMount&&"function"!=typeof r.componentWillMount||(n=r.state,"function"==typeof r.componentWillMount&&r.componentWillMount(),"function"==typeof r.UNSAFE_componentWillMount&&r.UNSAFE_componentWillMount(),n!==r.state&&ri.enqueueReplaceState(r,r.state,null),null!==(i=e.updateQueue)&&(Uo(e,i,o,r,t),r.state=e.memoizedState)),"function"==typeof r.componentDidMount&&(e.effectTag|=4)}var ui=Array.isArray;function si(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){var r=void 0;(n=n._owner)&&(2!==n.tag&&p("110"),r=n.stateNode),r||p("147",e);var o=""+e;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===o?t.ref:((t=function(e){var t=r.refs===f?r.refs={}:r.refs;null===e?delete t[o]:t[o]=e})._stringRef=o,t)}"string"!=typeof e&&p("148"),n._owner||p("254",e)}return e}function li(e,t){"textarea"!==e.type&&p("31","[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function ci(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function r(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function o(e,t,n){return(e=bo(e,t,n)).index=0,e.sibling=null,e}function i(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index)<n?(t.effectTag=2,n):r:(t.effectTag=2,n):n}function a(t){return e&&null===t.alternate&&(t.effectTag=2),t}function u(e,t,n,r){return null===t||6!==t.tag?((t=Eo(n,e.mode,r)).return=e,t):((t=o(t,n,r)).return=e,t)}function s(e,t,n,r){return null!==t&&t.type===n.type?((r=o(t,n.props,r)).ref=si(e,t,n),r.return=e,r):((r=_o(n,e.mode,r)).ref=si(e,t,n),r.return=e,r)}function l(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?((t=xo(n,e.mode,r)).return=e,t):((t=o(t,n.children||[],r)).return=e,t)}function c(e,t,n,r,i){return null===t||10!==t.tag?((t=wo(n,e.mode,r,i)).return=e,t):((t=o(t,n,r)).return=e,t)}function f(e,t,n){if("string"==typeof t||"number"==typeof t)return(t=Eo(""+t,e.mode,n)).return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case ut:return(n=_o(t,e.mode,n)).ref=si(e,null,t),n.return=e,n;case st:return(t=xo(t,e.mode,n)).return=e,t}if(ui(t)||gt(t))return(t=wo(t,e.mode,n,null)).return=e,t;li(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:u(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case ut:return n.key===o?n.type===lt?c(e,t,n.props.children,r,o):s(e,t,n,r):null;case st:return n.key===o?l(e,t,n,r):null}if(ui(n)||gt(n))return null!==o?null:c(e,t,n,r,null);li(e,n)}return null}function h(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return u(t,e=e.get(n)||null,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case ut:return e=e.get(null===r.key?n:r.key)||null,r.type===lt?c(t,e,r.props.children,o,r.key):s(t,e,r,o);case st:return l(t,e=e.get(null===r.key?n:r.key)||null,r,o)}if(ui(r)||gt(r))return c(t,e=e.get(n)||null,r,o,null);li(t,r)}return null}function v(o,a,u,s){for(var l=null,c=null,p=a,v=a=0,m=null;null!==p&&v<u.length;v++){p.index>v?(m=p,p=null):m=p.sibling;var y=d(o,p,u[v],s);if(null===y){null===p&&(p=m);break}e&&p&&null===y.alternate&&t(o,p),a=i(y,a,v),null===c?l=y:c.sibling=y,c=y,p=m}if(v===u.length)return n(o,p),l;if(null===p){for(;v<u.length;v++)(p=f(o,u[v],s))&&(a=i(p,a,v),null===c?l=p:c.sibling=p,c=p);return l}for(p=r(o,p);v<u.length;v++)(m=h(p,o,v,u[v],s))&&(e&&null!==m.alternate&&p.delete(null===m.key?v:m.key),a=i(m,a,v),null===c?l=m:c.sibling=m,c=m);return e&&p.forEach(function(e){return t(o,e)}),l}function m(o,a,u,s){var l=gt(u);"function"!=typeof l&&p("150"),null==(u=l.call(u))&&p("151");for(var c=l=null,v=a,m=a=0,y=null,g=u.next();null!==v&&!g.done;m++,g=u.next()){v.index>m?(y=v,v=null):y=v.sibling;var b=d(o,v,g.value,s);if(null===b){v||(v=y);break}e&&v&&null===b.alternate&&t(o,v),a=i(b,a,m),null===c?l=b:c.sibling=b,c=b,v=y}if(g.done)return n(o,v),l;if(null===v){for(;!g.done;m++,g=u.next())null!==(g=f(o,g.value,s))&&(a=i(g,a,m),null===c?l=g:c.sibling=g,c=g);return l}for(v=r(o,v);!g.done;m++,g=u.next())null!==(g=h(v,o,m,g.value,s))&&(e&&null!==g.alternate&&v.delete(null===g.key?m:g.key),a=i(g,a,m),null===c?l=g:c.sibling=g,c=g);return e&&v.forEach(function(e){return t(o,e)}),l}return function(e,r,i,u){"object"==typeof i&&null!==i&&i.type===lt&&null===i.key&&(i=i.props.children);var s="object"==typeof i&&null!==i;if(s)switch(i.$$typeof){case ut:e:{var l=i.key;for(s=r;null!==s;){if(s.key===l){if(10===s.tag?i.type===lt:s.type===i.type){n(e,s.sibling),(r=o(s,i.type===lt?i.props.children:i.props,u)).ref=si(e,s,i),r.return=e,e=r;break e}n(e,s);break}t(e,s),s=s.sibling}i.type===lt?((r=wo(i.props.children,e.mode,u,i.key)).return=e,e=r):((u=_o(i,e.mode,u)).ref=si(e,r,i),u.return=e,e=u)}return a(e);case st:e:{for(s=i.key;null!==r;){if(r.key===s){if(4===r.tag&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),(r=o(r,i.children||[],u)).return=e,e=r;break e}n(e,r);break}t(e,r),r=r.sibling}(r=xo(i,e.mode,u)).return=e,e=r}return a(e)}if("string"==typeof i||"number"==typeof i)return i=""+i,null!==r&&6===r.tag?(n(e,r.sibling),(r=o(r,i,u)).return=e,e=r):(n(e,r),(r=Eo(i,e.mode,u)).return=e,e=r),a(e);if(ui(i))return v(e,r,i,u);if(gt(i))return m(e,r,i,u);if(s&&li(e,i),void 0===i)switch(e.tag){case 2:case 1:p("152",(u=e.type).displayName||u.name||"Component")}return n(e,r)}}var fi=ci(!0),pi=ci(!1),di=null,hi=null,vi=!1;function mi(e,t){var n=new go(5,null,null,0);n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function yi(e,t){switch(e.tag){case 5:var n=e.type;return null!==(t=1!==t.nodeType||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t)&&(e.stateNode=t,!0);case 6:return null!==(t=""===e.pendingProps||3!==t.nodeType?null:t)&&(e.stateNode=t,!0);default:return!1}}function gi(e){if(vi){var t=hi;if(t){var n=t;if(!yi(e,t)){if(!(t=Jr(n))||!yi(e,t))return e.effectTag|=2,vi=!1,void(di=e);mi(di,n)}di=e,hi=Zr(t)}else e.effectTag|=2,vi=!1,di=e}}function bi(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag;)e=e.return;di=e}function _i(e){if(e!==di)return!1;if(!vi)return bi(e),vi=!0,!1;var t=e.type;if(5!==e.tag||"head"!==t&&"body"!==t&&!Gr(t,e.memoizedProps))for(t=hi;t;)mi(e,t),t=Jr(t);return bi(e),hi=di?Jr(e.stateNode):null,!0}function wi(){hi=di=null,vi=!1}function Ei(e,t,n){xi(e,t,n,t.expirationTime)}function xi(e,t,n,r){t.child=null===e?pi(t,null,n,r):fi(t,e.child,n,r)}function Oi(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function Ci(e,t,n,r,o){Oi(e,t);var i=0!=(64&t.effectTag);if(!n&&!i)return r&&yo(t,!1),Pi(e,t);n=t.stateNode,it.current=t;var a=i?null:n.render();return t.effectTag|=1,i&&(xi(e,t,null,o),t.child=null),xi(e,t,a,o),t.memoizedState=n.state,t.memoizedProps=n.props,r&&yo(t,!0),t.child}function Si(e){var t=e.stateNode;t.pendingContext?ho(0,t.pendingContext,t.pendingContext!==t.context):t.context&&ho(0,t.context,!1),Zo(e,t.containerInfo)}function ki(e,t,n,r){var o=e.child;for(null!==o&&(o.return=e);null!==o;){switch(o.tag){case 12:var i=0|o.stateNode;if(o.type===t&&0!=(i&n)){for(i=o;null!==i;){var a=i.alternate;if(0===i.expirationTime||i.expirationTime>r)i.expirationTime=r,null!==a&&(0===a.expirationTime||a.expirationTime>r)&&(a.expirationTime=r);else{if(null===a||!(0===a.expirationTime||a.expirationTime>r))break;a.expirationTime=r}i=i.return}i=null}else i=o.child;break;case 13:i=o.type===e.type?null:o.child;break;default:i=o.child}if(null!==i)i.return=o;else for(i=o;null!==i;){if(i===e){i=null;break}if(null!==(o=i.sibling)){o.return=i.return,i=o;break}i=i.return}o=i}}function Pi(e,t){if(null!==e&&t.child!==e.child&&p("153"),null!==t.child){var n=bo(e=t.child,e.pendingProps,e.expirationTime);for(t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,(n=n.sibling=bo(e,e.pendingProps,e.expirationTime)).return=t;n.sibling=null}return t.child}function ji(e,t,n){if(0===t.expirationTime||t.expirationTime>n){switch(t.tag){case 3:Si(t);break;case 2:mo(t);break;case 4:Zo(t,t.stateNode.containerInfo);break;case 13:Vo(t)}return null}switch(t.tag){case 0:null!==e&&p("155");var r=t.type,o=t.pendingProps,i=so(t);return r=r(o,i=lo(t,i)),t.effectTag|=1,"object"==typeof r&&null!==r&&"function"==typeof r.render&&void 0===r.$$typeof?(i=t.type,t.tag=2,t.memoizedState=null!==r.state&&void 0!==r.state?r.state:null,"function"==typeof(i=i.getDerivedStateFromProps)&&ni(t,i,o),o=mo(t),r.updater=ri,t.stateNode=r,r._reactInternalFiber=t,ai(t,n),e=Ci(e,t,!0,o,n)):(t.tag=1,Ei(e,t,r),t.memoizedProps=o,e=t.child),e;case 1:return o=t.type,n=t.pendingProps,ao.current||t.memoizedProps!==n?(o=o(n,r=lo(t,r=so(t))),t.effectTag|=1,Ei(e,t,o),t.memoizedProps=n,e=t.child):e=Pi(e,t),e;case 2:if(o=mo(t),null===e)if(null===t.stateNode){var a=t.pendingProps,u=t.type;r=so(t);var s=2===t.tag&&null!=t.type.contextTypes;a=new u(a,i=s?lo(t,r):f),t.memoizedState=null!==a.state&&void 0!==a.state?a.state:null,a.updater=ri,t.stateNode=a,a._reactInternalFiber=t,s&&((s=t.stateNode).__reactInternalMemoizedUnmaskedChildContext=r,s.__reactInternalMemoizedMaskedChildContext=i),ai(t,n),r=!0}else{u=t.type,r=t.stateNode,s=t.memoizedProps,i=t.pendingProps,r.props=s;var l=r.context;a=lo(t,a=so(t));var c=u.getDerivedStateFromProps;(u="function"==typeof c||"function"==typeof r.getSnapshotBeforeUpdate)||"function"!=typeof r.UNSAFE_componentWillReceiveProps&&"function"!=typeof r.componentWillReceiveProps||(s!==i||l!==a)&&ii(t,r,i,a),To=!1;var d=t.memoizedState;l=r.state=d;var h=t.updateQueue;null!==h&&(Uo(t,h,i,r,n),l=t.memoizedState),s!==i||d!==l||ao.current||To?("function"==typeof c&&(ni(t,c,i),l=t.memoizedState),(s=To||oi(t,s,i,d,l,a))?(u||"function"!=typeof r.UNSAFE_componentWillMount&&"function"!=typeof r.componentWillMount||("function"==typeof r.componentWillMount&&r.componentWillMount(),"function"==typeof r.UNSAFE_componentWillMount&&r.UNSAFE_componentWillMount()),"function"==typeof r.componentDidMount&&(t.effectTag|=4)):("function"==typeof r.componentDidMount&&(t.effectTag|=4),t.memoizedProps=i,t.memoizedState=l),r.props=i,r.state=l,r.context=a,r=s):("function"==typeof r.componentDidMount&&(t.effectTag|=4),r=!1)}else u=t.type,r=t.stateNode,i=t.memoizedProps,s=t.pendingProps,r.props=i,l=r.context,a=lo(t,a=so(t)),(u="function"==typeof(c=u.getDerivedStateFromProps)||"function"==typeof r.getSnapshotBeforeUpdate)||"function"!=typeof r.UNSAFE_componentWillReceiveProps&&"function"!=typeof r.componentWillReceiveProps||(i!==s||l!==a)&&ii(t,r,s,a),To=!1,l=t.memoizedState,d=r.state=l,null!==(h=t.updateQueue)&&(Uo(t,h,s,r,n),d=t.memoizedState),i!==s||l!==d||ao.current||To?("function"==typeof c&&(ni(t,c,s),d=t.memoizedState),(c=To||oi(t,i,s,l,d,a))?(u||"function"!=typeof r.UNSAFE_componentWillUpdate&&"function"!=typeof r.componentWillUpdate||("function"==typeof r.componentWillUpdate&&r.componentWillUpdate(s,d,a),"function"==typeof r.UNSAFE_componentWillUpdate&&r.UNSAFE_componentWillUpdate(s,d,a)),"function"==typeof r.componentDidUpdate&&(t.effectTag|=4),"function"==typeof r.getSnapshotBeforeUpdate&&(t.effectTag|=256)):("function"!=typeof r.componentDidUpdate||i===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof r.getSnapshotBeforeUpdate||i===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),t.memoizedProps=s,t.memoizedState=d),r.props=s,r.state=d,r.context=a,r=c):("function"!=typeof r.componentDidUpdate||i===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=4),"function"!=typeof r.getSnapshotBeforeUpdate||i===e.memoizedProps&&l===e.memoizedState||(t.effectTag|=256),r=!1);return Ci(e,t,r,o,n);case 3:return Si(t),null!==(o=t.updateQueue)?(r=null!==(r=t.memoizedState)?r.element:null,Uo(t,o,t.pendingProps,null,n),(o=t.memoizedState.element)===r?(wi(),e=Pi(e,t)):(r=t.stateNode,(r=(null===e||null===e.child)&&r.hydrate)&&(hi=Zr(t.stateNode.containerInfo),di=t,r=vi=!0),r?(t.effectTag|=2,t.child=pi(t,null,o,n)):(wi(),Ei(e,t,o)),e=t.child)):(wi(),e=Pi(e,t)),e;case 5:return Jo(Xo.current),(o=Jo(Ko.current))!==(r=Or(o,t.type))&&(oo(Qo,t),oo(Ko,r)),null===e&&gi(t),o=t.type,s=t.memoizedProps,r=t.pendingProps,i=null!==e?e.memoizedProps:null,ao.current||s!==r||((s=1&t.mode&&!!r.hidden)&&(t.expirationTime=1073741823),s&&1073741823===n)?(s=r.children,Gr(o,r)?s=null:i&&Gr(o,i)&&(t.effectTag|=16),Oi(e,t),1073741823!==n&&1&t.mode&&r.hidden?(t.expirationTime=1073741823,t.memoizedProps=r,e=null):(Ei(e,t,s),t.memoizedProps=r,e=t.child)):e=Pi(e,t),e;case 6:return null===e&&gi(t),t.memoizedProps=t.pendingProps,null;case 16:return null;case 4:return Zo(t,t.stateNode.containerInfo),o=t.pendingProps,ao.current||t.memoizedProps!==o?(null===e?t.child=fi(t,null,o,n):Ei(e,t,o),t.memoizedProps=o,e=t.child):e=Pi(e,t),e;case 14:return o=t.type.render,n=t.pendingProps,r=t.ref,ao.current||t.memoizedProps!==n||r!==(null!==e?e.ref:null)?(Ei(e,t,o=o(n,r)),t.memoizedProps=n,e=t.child):e=Pi(e,t),e;case 10:return n=t.pendingProps,ao.current||t.memoizedProps!==n?(Ei(e,t,n),t.memoizedProps=n,e=t.child):e=Pi(e,t),e;case 11:return n=t.pendingProps.children,ao.current||null!==n&&t.memoizedProps!==n?(Ei(e,t,n),t.memoizedProps=n,e=t.child):e=Pi(e,t),e;case 15:return n=t.pendingProps,t.memoizedProps===n?e=Pi(e,t):(Ei(e,t,n.children),t.memoizedProps=n,e=t.child),e;case 13:return function(e,t,n){var r=t.type._context,o=t.pendingProps,i=t.memoizedProps,a=!0;if(ao.current)a=!1;else if(i===o)return t.stateNode=0,Vo(t),Pi(e,t);var u=o.value;if(t.memoizedProps=o,null===i)u=1073741823;else if(i.value===o.value){if(i.children===o.children&&a)return t.stateNode=0,Vo(t),Pi(e,t);u=0}else{var s=i.value;if(s===u&&(0!==s||1/s==1/u)||s!=s&&u!=u){if(i.children===o.children&&a)return t.stateNode=0,Vo(t),Pi(e,t);u=0}else if(u="function"==typeof r._calculateChangedBits?r._calculateChangedBits(s,u):1073741823,0==(u|=0)){if(i.children===o.children&&a)return t.stateNode=0,Vo(t),Pi(e,t)}else ki(t,r,u,n)}return t.stateNode=u,Vo(t),Ei(e,t,o.children),t.child}(e,t,n);case 12:e:if(r=t.type,i=t.pendingProps,s=t.memoizedProps,o=r._currentValue,a=r._changedBits,ao.current||0!==a||s!==i){if(t.memoizedProps=i,void 0!==(u=i.unstable_observedBits)&&null!==u||(u=1073741823),t.stateNode=u,0!=(a&u))ki(t,r,a,n);else if(s===i){e=Pi(e,t);break e}n=(n=i.children)(o),t.effectTag|=1,Ei(e,t,n),e=t.child}else e=Pi(e,t);return e;default:p("156")}}function Ti(e){e.effectTag|=4}var Ri=void 0,Ni=void 0,Mi=void 0;function Ai(e,t){var n=t.pendingProps;switch(t.tag){case 1:return null;case 2:return fo(t),null;case 3:ei(),po();var r=t.stateNode;return r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),null!==e&&null!==e.child||(_i(t),t.effectTag&=-3),Ri(t),null;case 5:ti(t),r=Jo(Xo.current);var o=t.type;if(null!==e&&null!=t.stateNode){var i=e.memoizedProps,a=t.stateNode,u=Jo(Ko.current);a=Fr(a,o,i,n,r),Ni(e,t,a,o,i,n,r,u),e.ref!==t.ref&&(t.effectTag|=128)}else{if(!n)return null===t.stateNode&&p("166"),null;if(e=Jo(Ko.current),_i(t))n=t.stateNode,o=t.type,i=t.memoizedProps,n[B]=t,n[W]=i,r=Wr(n,o,i,e,r),t.updateQueue=r,null!==r&&Ti(t);else{(e=Lr(o,n,r,e))[B]=t,e[W]=n;e:for(i=t.child;null!==i;){if(5===i.tag||6===i.tag)e.appendChild(i.stateNode);else if(4!==i.tag&&null!==i.child){i.child.return=i,i=i.child;continue}if(i===t)break;for(;null===i.sibling;){if(null===i.return||i.return===t)break e;i=i.return}i.sibling.return=i.return,i=i.sibling}Ur(e,o,n,r),Yr(o,n)&&Ti(t),t.stateNode=e}null!==t.ref&&(t.effectTag|=128)}return null;case 6:if(e&&null!=t.stateNode)Mi(e,t,e.memoizedProps,n);else{if("string"!=typeof n)return null===t.stateNode&&p("166"),null;r=Jo(Xo.current),Jo(Ko.current),_i(t)?(r=t.stateNode,n=t.memoizedProps,r[B]=t,qr(r,n)&&Ti(t)):((r=zr(n,r))[B]=t,t.stateNode=r)}return null;case 14:case 16:case 10:case 11:case 15:return null;case 4:return ei(),Ri(t),null;case 13:return Yo(t),null;case 12:return null;case 0:p("167");default:p("156")}}function Di(e,t){var n=t.source;null===t.stack&&null!==n&&_t(n),null!==n&&bt(n),t=t.value,null!==e&&2===e.tag&&bt(e);try{t&&t.suppressReactErrorLogging||console.error(t)}catch(e){e&&e.suppressReactErrorLogging||console.error(e)}}function Ii(e){var t=e.ref;if(null!==t)if("function"==typeof t)try{t(null)}catch(t){fa(e,t)}else t.current=null}function Li(e){switch(jo(e),e.tag){case 2:Ii(e);var t=e.stateNode;if("function"==typeof t.componentWillUnmount)try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(t){fa(e,t)}break;case 5:Ii(e);break;case 4:Fi(e)}}function zi(e){return 5===e.tag||3===e.tag||4===e.tag}function Ui(e){e:{for(var t=e.return;null!==t;){if(zi(t)){var n=t;break e}t=t.return}p("160"),n=void 0}var r=t=void 0;switch(n.tag){case 5:t=n.stateNode,r=!1;break;case 3:case 4:t=n.stateNode.containerInfo,r=!0;break;default:p("161")}16&n.effectTag&&(Pr(t,""),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||zi(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}for(var o=e;;){if(5===o.tag||6===o.tag)if(n)if(r){var i=t,a=o.stateNode,u=n;8===i.nodeType?i.parentNode.insertBefore(a,u):i.insertBefore(a,u)}else t.insertBefore(o.stateNode,n);else r?(i=t,a=o.stateNode,8===i.nodeType?i.parentNode.insertBefore(a,i):i.appendChild(a)):t.appendChild(o.stateNode);else if(4!==o.tag&&null!==o.child){o.child.return=o,o=o.child;continue}if(o===e)break;for(;null===o.sibling;){if(null===o.return||o.return===e)return;o=o.return}o.sibling.return=o.return,o=o.sibling}}function Fi(e){for(var t=e,n=!1,r=void 0,o=void 0;;){if(!n){n=t.return;e:for(;;){switch(null===n&&p("160"),n.tag){case 5:r=n.stateNode,o=!1;break e;case 3:case 4:r=n.stateNode.containerInfo,o=!0;break e}n=n.return}n=!0}if(5===t.tag||6===t.tag){e:for(var i=t,a=i;;)if(Li(a),null!==a.child&&4!==a.tag)a.child.return=a,a=a.child;else{if(a===i)break;for(;null===a.sibling;){if(null===a.return||a.return===i)break e;a=a.return}a.sibling.return=a.return,a=a.sibling}o?(i=r,a=t.stateNode,8===i.nodeType?i.parentNode.removeChild(a):i.removeChild(a)):r.removeChild(t.stateNode)}else if(4===t.tag?r=t.stateNode.containerInfo:Li(t),null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;4===(t=t.return).tag&&(n=!1)}t.sibling.return=t.return,t=t.sibling}}function Bi(e,t){switch(t.tag){case 2:break;case 5:var n=t.stateNode;if(null!=n){var r=t.memoizedProps;e=null!==e?e.memoizedProps:r;var o=t.type,i=t.updateQueue;t.updateQueue=null,null!==i&&(n[W]=r,Br(n,i,o,e,r))}break;case 6:null===t.stateNode&&p("162"),t.stateNode.nodeValue=t.memoizedProps;break;case 3:case 15:case 16:break;default:p("163")}}function Wi(e,t,n){(n=Mo(n)).tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ga(r),Di(e,t)},n}function qi(e,t,n){(n=Mo(n)).tag=3;var r=e.stateNode;return null!==r&&"function"==typeof r.componentDidCatch&&(n.callback=function(){null===aa?aa=new Set([this]):aa.add(this);var n=t.value,r=t.stack;Di(e,t),this.componentDidCatch(n,{componentStack:null!==r?r:""})}),n}function Hi(e,t,n,r,o,i){n.effectTag|=512,n.firstEffect=n.lastEffect=null,r=Wo(r,n),e=t;do{switch(e.tag){case 3:return e.effectTag|=1024,void Io(e,r=Wi(e,r,i),i);case 2:if(t=r,n=e.stateNode,0==(64&e.effectTag)&&null!==n&&"function"==typeof n.componentDidCatch&&(null===aa||!aa.has(n)))return e.effectTag|=1024,void Io(e,r=qi(e,t,i),i)}e=e.return}while(null!==e)}function $i(e){switch(e.tag){case 2:fo(e);var t=e.effectTag;return 1024&t?(e.effectTag=-1025&t|64,e):null;case 3:return ei(),po(),1024&(t=e.effectTag)?(e.effectTag=-1025&t|64,e):null;case 5:return ti(e),null;case 16:return 1024&(t=e.effectTag)?(e.effectTag=-1025&t|64,e):null;case 4:return ei(),null;case 13:return Yo(e),null;default:return null}}Ri=function(){},Ni=function(e,t,n){(t.updateQueue=n)&&Ti(t)},Mi=function(e,t,n,r){n!==r&&Ti(t)};var Vi=Kr(),Yi=2,Gi=Vi,Ki=0,Qi=0,Xi=!1,Ji=null,Zi=null,ea=0,ta=-1,na=!1,ra=null,oa=!1,ia=!1,aa=null;function ua(){if(null!==Ji)for(var e=Ji.return;null!==e;){var t=e;switch(t.tag){case 2:fo(t);break;case 3:ei(),po();break;case 5:ti(t);break;case 4:ei();break;case 13:Yo(t)}e=e.return}Zi=null,ea=0,ta=-1,na=!1,Ji=null,ia=!1}function sa(e){for(;;){var t=e.alternate,n=e.return,r=e.sibling;if(0==(512&e.effectTag)){t=Ai(t,e);var o=e;if(1073741823===ea||1073741823!==o.expirationTime){var i=0;switch(o.tag){case 3:case 2:var a=o.updateQueue;null!==a&&(i=a.expirationTime)}for(a=o.child;null!==a;)0!==a.expirationTime&&(0===i||i>a.expirationTime)&&(i=a.expirationTime),a=a.sibling;o.expirationTime=i}if(null!==t)return t;if(null!==n&&0==(512&n.effectTag)&&(null===n.firstEffect&&(n.firstEffect=e.firstEffect),null!==e.lastEffect&&(null!==n.lastEffect&&(n.lastEffect.nextEffect=e.firstEffect),n.lastEffect=e.lastEffect),1<e.effectTag&&(null!==n.lastEffect?n.lastEffect.nextEffect=e:n.firstEffect=e,n.lastEffect=e)),null!==r)return r;if(null===n){ia=!0;break}e=n}else{if(null!==(e=$i(e)))return e.effectTag&=511,e;if(null!==n&&(n.firstEffect=n.lastEffect=null,n.effectTag|=512),null!==r)return r;if(null===n)break;e=n}}return null}function la(e){var t=ji(e.alternate,e,ea);return null===t&&(t=sa(e)),it.current=null,t}function ca(e,t,n){Xi&&p("243"),Xi=!0,t===ea&&e===Zi&&null!==Ji||(ua(),ea=t,ta=-1,Ji=bo((Zi=e).current,null,ea),e.pendingCommitExpirationTime=0);var r=!1;for(na=!n||ea<=Yi;;){try{if(n)for(;null!==Ji&&!Ya();)Ji=la(Ji);else for(;null!==Ji;)Ji=la(Ji)}catch(t){if(null===Ji)r=!0,Ga(t);else{null===Ji&&p("271");var o=(n=Ji).return;if(null===o){r=!0,Ga(t);break}Hi(e,o,n,t,0,ea),Ji=sa(n)}}break}if(Xi=!1,r)return null;if(null===Ji){if(ia)return e.pendingCommitExpirationTime=t,e.current.alternate;na&&p("262"),0<=ta&&setTimeout(function(){var t=e.current.expirationTime;0!==t&&(0===e.remainingExpirationTime||e.remainingExpirationTime<t)&&za(e,t)},ta),function(e){null===xa&&p("246"),xa.remainingExpirationTime=e}(e.current.expirationTime)}return null}function fa(e,t){var n;e:{for(Xi&&!oa&&p("263"),n=e.return;null!==n;){switch(n.tag){case 2:var r=n.stateNode;if("function"==typeof n.type.getDerivedStateFromCatch||"function"==typeof r.componentDidCatch&&(null===aa||!aa.has(r))){Do(n,e=qi(n,e=Wo(t,e),1),1),ha(n,1),n=void 0;break e}break;case 3:Do(n,e=Wi(n,e=Wo(t,e),1),1),ha(n,1),n=void 0;break e}n=n.return}3===e.tag&&(Do(e,n=Wi(e,n=Wo(t,e),1),1),ha(e,1)),n=void 0}return n}function pa(){var e=2+25*(1+((va()-2+500)/25|0));return e<=Ki&&(e=Ki+1),Ki=e}function da(e,t){return e=0!==Qi?Qi:Xi?oa?1:ea:1&t.mode?Na?2+10*(1+((e-2+15)/10|0)):2+25*(1+((e-2+500)/25|0)):1,Na&&(0===Ca||e>Ca)&&(Ca=e),e}function ha(e,t){for(;null!==e;){if((0===e.expirationTime||e.expirationTime>t)&&(e.expirationTime=t),null!==e.alternate&&(0===e.alternate.expirationTime||e.alternate.expirationTime>t)&&(e.alternate.expirationTime=t),null===e.return){if(3!==e.tag)break;var n=e.stateNode;!Xi&&0!==ea&&t<ea&&ua();var r=n.current.expirationTime;Xi&&!oa&&Zi===n||za(n,r),Da>Aa&&p("185")}e=e.return}}function va(){return Gi=Kr()-Vi,Yi=2+(Gi/10|0)}function ma(e){var t=Qi;Qi=2+25*(1+((va()-2+500)/25|0));try{return e()}finally{Qi=t}}function ya(e,t,n,r,o){var i=Qi;Qi=1;try{return e(t,n,r,o)}finally{Qi=i}}var ga=null,ba=null,_a=0,wa=-1,Ea=!1,xa=null,Oa=0,Ca=0,Sa=!1,ka=!1,Pa=null,ja=null,Ta=!1,Ra=!1,Na=!1,Ma=null,Aa=1e3,Da=0,Ia=1;function La(e){if(0!==_a){if(e>_a)return;Xr(wa)}var t=Kr()-Vi;_a=e,wa=Qr(Fa,{timeout:10*(e-2)-t})}function za(e,t){if(null===e.nextScheduledRoot)e.remainingExpirationTime=t,null===ba?(ga=ba=e,e.nextScheduledRoot=e):(ba=ba.nextScheduledRoot=e).nextScheduledRoot=ga;else{var n=e.remainingExpirationTime;(0===n||t<n)&&(e.remainingExpirationTime=t)}Ea||(Ta?Ra&&(xa=e,Oa=1,$a(e,1,!1)):1===t?Ba():La(t))}function Ua(){var e=0,t=null;if(null!==ba)for(var n=ba,r=ga;null!==r;){var o=r.remainingExpirationTime;if(0===o){if((null===n||null===ba)&&p("244"),r===r.nextScheduledRoot){ga=ba=r.nextScheduledRoot=null;break}if(r===ga)ga=o=r.nextScheduledRoot,ba.nextScheduledRoot=o,r.nextScheduledRoot=null;else{if(r===ba){(ba=n).nextScheduledRoot=ga,r.nextScheduledRoot=null;break}n.nextScheduledRoot=r.nextScheduledRoot,r.nextScheduledRoot=null}r=n.nextScheduledRoot}else{if((0===e||o<e)&&(e=o,t=r),r===ba)break;n=r,r=r.nextScheduledRoot}}null!==(n=xa)&&n===t&&1===e?Da++:Da=0,xa=t,Oa=e}function Fa(e){Wa(0,!0,e)}function Ba(){Wa(1,!1,null)}function Wa(e,t,n){if(ja=n,Ua(),t)for(;null!==xa&&0!==Oa&&(0===e||e>=Oa)&&(!Sa||va()>=Oa);)va(),$a(xa,Oa,!Sa),Ua();else for(;null!==xa&&0!==Oa&&(0===e||e>=Oa);)$a(xa,Oa,!1),Ua();null!==ja&&(_a=0,wa=-1),0!==Oa&&La(Oa),ja=null,Sa=!1,Ha()}function qa(e,t){Ea&&p("253"),xa=e,Oa=t,$a(e,t,!1),Ba(),Ha()}function Ha(){if(Da=0,null!==Ma){var e=Ma;Ma=null;for(var t=0;t<e.length;t++){var n=e[t];try{n._onComplete()}catch(e){ka||(ka=!0,Pa=e)}}}if(ka)throw e=Pa,Pa=null,ka=!1,e}function $a(e,t,n){Ea&&p("245"),Ea=!0,n?null!==(n=e.finishedWork)?Va(e,n,t):(e.finishedWork=null,null!==(n=ca(e,t,!0))&&(Ya()?e.finishedWork=n:Va(e,n,t))):null!==(n=e.finishedWork)?Va(e,n,t):(e.finishedWork=null,null!==(n=ca(e,t,!1))&&Va(e,n,t)),Ea=!1}function Va(e,t,n){var r=e.firstBatch;if(null!==r&&r._expirationTime<=n&&(null===Ma?Ma=[r]:Ma.push(r),r._defer))return e.finishedWork=t,void(e.remainingExpirationTime=0);if(e.finishedWork=null,oa=Xi=!0,(n=t.stateNode).current===t&&p("177"),0===(r=n.pendingCommitExpirationTime)&&p("261"),n.pendingCommitExpirationTime=0,va(),it.current=null,1<t.effectTag)if(null!==t.lastEffect){t.lastEffect.nextEffect=t;var o=t.firstEffect}else o=t;else o=t.firstEffect;$r=jn;var i=s();if(Wn(i)){if("selectionStart"in i)var a={start:i.selectionStart,end:i.selectionEnd};else e:{var u=window.getSelection&&window.getSelection();if(u&&0!==u.rangeCount){a=u.anchorNode;var l=u.anchorOffset,f=u.focusNode;u=u.focusOffset;try{a.nodeType,f.nodeType}catch(e){a=null;break e}var d=0,h=-1,v=-1,m=0,y=0,g=i,b=null;t:for(;;){for(var _;g!==a||0!==l&&3!==g.nodeType||(h=d+l),g!==f||0!==u&&3!==g.nodeType||(v=d+u),3===g.nodeType&&(d+=g.nodeValue.length),null!==(_=g.firstChild);)b=g,g=_;for(;;){if(g===i)break t;if(b===a&&++m===l&&(h=d),b===f&&++y===u&&(v=d),null!==(_=g.nextSibling))break;b=(g=b).parentNode}g=_}a=-1===h||-1===v?null:{start:h,end:v}}else a=null}a=a||{start:0,end:0}}else a=null;for(Vr={focusedElem:i,selectionRange:a},Tn(!1),ra=o;null!==ra;){i=!1,a=void 0;try{for(;null!==ra;){if(256&ra.effectTag){var w=ra.alternate;switch((l=ra).tag){case 2:if(256&l.effectTag&&null!==w){var E=w.memoizedProps,x=w.memoizedState,O=l.stateNode;O.props=l.memoizedProps,O.state=l.memoizedState;var C=O.getSnapshotBeforeUpdate(E,x);O.__reactInternalSnapshotBeforeUpdate=C}break;case 3:case 5:case 6:case 4:break;default:p("163")}}ra=ra.nextEffect}}catch(e){i=!0,a=e}i&&(null===ra&&p("178"),fa(ra,a),null!==ra&&(ra=ra.nextEffect))}for(ra=o;null!==ra;){w=!1,E=void 0;try{for(;null!==ra;){var S=ra.effectTag;if(16&S&&Pr(ra.stateNode,""),128&S){var k=ra.alternate;if(null!==k){var P=k.ref;null!==P&&("function"==typeof P?P(null):P.current=null)}}switch(14&S){case 2:Ui(ra),ra.effectTag&=-3;break;case 6:Ui(ra),ra.effectTag&=-3,Bi(ra.alternate,ra);break;case 4:Bi(ra.alternate,ra);break;case 8:Fi(x=ra),x.return=null,x.child=null,x.alternate&&(x.alternate.child=null,x.alternate.return=null)}ra=ra.nextEffect}}catch(e){w=!0,E=e}w&&(null===ra&&p("178"),fa(ra,E),null!==ra&&(ra=ra.nextEffect))}if(P=Vr,k=s(),S=P.focusedElem,w=P.selectionRange,k!==S&&c(document.documentElement,S)){Wn(S)&&(k=w.start,void 0===(P=w.end)&&(P=k),"selectionStart"in S?(S.selectionStart=k,S.selectionEnd=Math.min(P,S.value.length)):window.getSelection&&(k=window.getSelection(),E=S[he()].length,P=Math.min(w.start,E),w=void 0===w.end?P:Math.min(w.end,E),!k.extend&&P>w&&(E=w,w=P,P=E),E=Bn(S,P),x=Bn(S,w),E&&x&&(1!==k.rangeCount||k.anchorNode!==E.node||k.anchorOffset!==E.offset||k.focusNode!==x.node||k.focusOffset!==x.offset)&&((O=document.createRange()).setStart(E.node,E.offset),k.removeAllRanges(),P>w?(k.addRange(O),k.extend(x.node,x.offset)):(O.setEnd(x.node,x.offset),k.addRange(O))))),k=[];for(P=S;P=P.parentNode;)1===P.nodeType&&k.push({element:P,left:P.scrollLeft,top:P.scrollTop});for(S.focus(),S=0;S<k.length;S++)(P=k[S]).element.scrollLeft=P.left,P.element.scrollTop=P.top}for(Vr=null,Tn($r),$r=null,n.current=t,ra=o;null!==ra;){o=!1,S=void 0;try{for(k=r;null!==ra;){var j=ra.effectTag;if(36&j){var T=ra.alternate;switch(w=k,(P=ra).tag){case 2:var R=P.stateNode;if(4&P.effectTag)if(null===T)R.props=P.memoizedProps,R.state=P.memoizedState,R.componentDidMount();else{var N=T.memoizedProps,M=T.memoizedState;R.props=P.memoizedProps,R.state=P.memoizedState,R.componentDidUpdate(N,M,R.__reactInternalSnapshotBeforeUpdate)}var A=P.updateQueue;null!==A&&(R.props=P.memoizedProps,R.state=P.memoizedState,Bo(P,A,R));break;case 3:var D=P.updateQueue;if(null!==D){if(E=null,null!==P.child)switch(P.child.tag){case 5:E=P.child.stateNode;break;case 2:E=P.child.stateNode}Bo(P,D,E)}break;case 5:var I=P.stateNode;null===T&&4&P.effectTag&&Yr(P.type,P.memoizedProps)&&I.focus();break;case 6:case 4:case 15:case 16:break;default:p("163")}}if(128&j){P=void 0;var L=ra.ref;if(null!==L){var z=ra.stateNode;switch(ra.tag){case 5:P=z;break;default:P=z}"function"==typeof L?L(P):L.current=P}}var U=ra.nextEffect;ra.nextEffect=null,ra=U}}catch(e){o=!0,S=e}o&&(null===ra&&p("178"),fa(ra,S),null!==ra&&(ra=ra.nextEffect))}Xi=oa=!1,Po(t.stateNode),0===(t=n.current.expirationTime)&&(aa=null),e.remainingExpirationTime=t}function Ya(){return!(null===ja||ja.timeRemaining()>Ia)&&(Sa=!0)}function Ga(e){null===xa&&p("246"),xa.remainingExpirationTime=0,ka||(ka=!0,Pa=e)}function Ka(e,t){var n=Ta;Ta=!0;try{return e(t)}finally{(Ta=n)||Ea||Ba()}}function Qa(e,t){if(Ta&&!Ra){Ra=!0;try{return e(t)}finally{Ra=!1}}return e(t)}function Xa(e,t){Ea&&p("187");var n=Ta;Ta=!0;try{return ya(e,t)}finally{Ta=n,Ba()}}function Ja(e){var t=Ta;Ta=!0;try{ya(e)}finally{(Ta=t)||Ea||Wa(1,!1,null)}}function Za(e,t,n,r,o){var i=t.current;if(n){var a;n=n._reactInternalFiber;e:{for(2===an(n)&&2===n.tag||p("170"),a=n;3!==a.tag;){if(co(a)){a=a.stateNode.__reactInternalMemoizedMergedChildContext;break e}(a=a.return)||p("171")}a=a.stateNode.context}n=co(n)?vo(n,a):a}else n=f;return null===t.context?t.context=n:t.pendingContext=n,t=o,(o=Mo(r)).payload={element:e},null!==(t=void 0===t?null:t)&&(o.callback=t),Do(i,o,r),ha(i,r),r}function eu(e){var t=e._reactInternalFiber;return void 0===t&&("function"==typeof e.render?p("188"):p("268",Object.keys(e))),null===(e=ln(t))?null:e.stateNode}function tu(e,t,n,r){var o=t.current;return Za(e,t,n,o=da(va(),o),r)}function nu(e){if(!(e=e.current).child)return null;switch(e.child.tag){case 5:default:return e.child.stateNode}}function ru(e){var t=e.findFiberByHostInstance;return function(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);Co=ko(function(e){return t.onCommitFiberRoot(n,e)}),So=ko(function(e){return t.onCommitFiberUnmount(n,e)})}catch(e){}return!0}(a({},e,{findHostInstanceByFiber:function(e){return null===(e=ln(e))?null:e.stateNode},findFiberByHostInstance:function(e){return t?t(e):null}}))}var ou=Ka,iu=function(e,t,n){if(Na)return e(t,n);Ta||Ea||0===Ca||(Wa(Ca,!1,null),Ca=0);var r=Na,o=Ta;Ta=Na=!0;try{return e(t,n)}finally{Na=r,(Ta=o)||Ea||Ba()}},au=function(){Ea||0===Ca||(Wa(Ca,!1,null),Ca=0)};function uu(e){this._expirationTime=pa(),this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function su(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function lu(e,t,n){this._internalRoot=Oo(e,t,n)}function cu(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function fu(e,t,n,r,o){cu(n)||p("200");var i=n._reactRootContainer;if(i){if("function"==typeof o){var a=o;o=function(){var e=nu(i._internalRoot);a.call(e)}}null!=e?i.legacy_renderSubtreeIntoContainer(e,t,o):i.render(t,o)}else{if(i=n._reactRootContainer=function(e,t){if(t||(t=!(!(t=e?9===e.nodeType?e.documentElement:e.firstChild:null)||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new lu(e,!1,t)}(n,r),"function"==typeof o){var u=o;o=function(){var e=nu(i._internalRoot);u.call(e)}}Qa(function(){null!=e?i.legacy_renderSubtreeIntoContainer(e,t,o):i.render(t,o)})}return nu(i._internalRoot)}function pu(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return cu(t)||p("200"),function(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:st,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}(e,t,null,n)}Ue.injectFiberControlledHostComponent(Hr),uu.prototype.render=function(e){this._defer||p("250"),this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,r=new su;return Za(e,t,null,n,r._onCommit),r},uu.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},uu.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(this._defer&&null!==t||p("251"),this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var r=null,o=t;o!==this;)r=o,o=o._next;null===r&&p("251"),r._next=o._next,this._next=t,e.firstBatch=this}this._defer=!1,qa(e,n),t=this._next,this._next=null,null!==(t=e.firstBatch=t)&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},uu.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},su.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},su.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];"function"!=typeof n&&p("191",n),n()}}},lu.prototype.render=function(e,t){var n=this._internalRoot,r=new su;return null!==(t=void 0===t?null:t)&&r.then(t),tu(e,n,null,r._onCommit),r},lu.prototype.unmount=function(e){var t=this._internalRoot,n=new su;return null!==(e=void 0===e?null:e)&&n.then(e),tu(null,t,null,n._onCommit),n},lu.prototype.legacy_renderSubtreeIntoContainer=function(e,t,n){var r=this._internalRoot,o=new su;return null!==(n=void 0===n?null:n)&&o.then(n),tu(t,r,e,o._onCommit),o},lu.prototype.createBatch=function(){var e=new uu(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime<=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e},Ye=ou,Ge=iu,Ke=au;var du={createPortal:pu,findDOMNode:function(e){return null==e?null:1===e.nodeType?e:eu(e)},hydrate:function(e,t,n){return fu(null,e,t,!0,n)},render:function(e,t,n){return fu(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,r){return(null==e||void 0===e._reactInternalFiber)&&p("38"),fu(e,t,n,!1,r)},unmountComponentAtNode:function(e){return cu(e)||p("40"),!!e._reactRootContainer&&(Qa(function(){fu(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:function(){return pu.apply(void 0,arguments)},unstable_batchedUpdates:Ka,unstable_deferredUpdates:ma,flushSync:Xa,unstable_flushControlled:Ja,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{EventPluginHub:U,EventPluginRegistry:O,EventPropagators:ne,ReactControlledComponent:Ve,ReactDOMComponentTree:V,ReactDOMEventListener:Dn},unstable_createRoot:function(e,t){return new lu(e,!0,null!=t&&!0===t.hydrate)}};ru({findFiberByHostInstance:q,bundleType:0,version:"16.4.0",rendererPackageName:"react-dom"});var hu={default:du},vu=hu&&du||hu;e.exports=vu.default?vu.default:vu},function(e,t,n){"use strict";!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}(),e.exports=n(283)},function(e,t,n){"use strict";
/** @license React v16.4.0
 * react.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(58),o=n(33),i=n(57),a=n(56),u="function"==typeof Symbol&&Symbol.for,s=u?Symbol.for("react.element"):60103,l=u?Symbol.for("react.portal"):60106,c=u?Symbol.for("react.fragment"):60107,f=u?Symbol.for("react.strict_mode"):60108,p=u?Symbol.for("react.profiler"):60114,d=u?Symbol.for("react.provider"):60109,h=u?Symbol.for("react.context"):60110,v=u?Symbol.for("react.async_mode"):60111,m=u?Symbol.for("react.forward_ref"):60112;u&&Symbol.for("react.timeout");var y="function"==typeof Symbol&&Symbol.iterator;function g(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);o(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};function _(e,t,n){this.props=e,this.context=t,this.refs=i,this.updater=n||b}function w(){}function E(e,t,n){this.props=e,this.context=t,this.refs=i,this.updater=n||b}_.prototype.isReactComponent={},_.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&g("85"),this.updater.enqueueSetState(this,e,t,"setState")},_.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},w.prototype=_.prototype;var x=E.prototype=new w;x.constructor=E,r(x,_.prototype),x.isPureReactComponent=!0;var O={current:null},C=Object.prototype.hasOwnProperty,S={key:!0,ref:!0,__self:!0,__source:!0};function k(e,t,n){var r=void 0,o={},i=null,a=null;if(null!=t)for(r in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(i=""+t.key),t)C.call(t,r)&&!S.hasOwnProperty(r)&&(o[r]=t[r]);var u=arguments.length-2;if(1===u)o.children=n;else if(1<u){for(var l=Array(u),c=0;c<u;c++)l[c]=arguments[c+2];o.children=l}if(e&&e.defaultProps)for(r in u=e.defaultProps)void 0===o[r]&&(o[r]=u[r]);return{$$typeof:s,type:e,key:i,ref:a,props:o,_owner:O.current}}function P(e){return"object"==typeof e&&null!==e&&e.$$typeof===s}var j=/\/+/g,T=[];function R(e,t,n,r){if(T.length){var o=T.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function N(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>T.length&&T.push(e)}function M(e,t,n,r){var o=typeof e;"undefined"!==o&&"boolean"!==o||(e=null);var i=!1;if(null===e)i=!0;else switch(o){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case s:case l:i=!0}}if(i)return n(r,e,""===t?"."+A(e,0):t),1;if(i=0,t=""===t?".":t+":",Array.isArray(e))for(var a=0;a<e.length;a++){var u=t+A(o=e[a],a);i+=M(o,u,n,r)}else if(null===e||void 0===e?u=null:u="function"==typeof(u=y&&e[y]||e["@@iterator"])?u:null,"function"==typeof u)for(e=u.call(e),a=0;!(o=e.next()).done;)i+=M(o=o.value,u=t+A(o,a++),n,r);else"object"===o&&g("31","[object Object]"===(n=""+e)?"object with keys {"+Object.keys(e).join(", ")+"}":n,"");return i}function A(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}(e.key):t.toString(36)}function D(e,t){e.func.call(e.context,t,e.count++)}function I(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?L(e,r,n,a.thatReturnsArgument):null!=e&&(P(e)&&(t=o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(j,"$&/")+"/")+n,e={$$typeof:s,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}),r.push(e))}function L(e,t,n,r,o){var i="";null!=n&&(i=(""+n).replace(j,"$&/")+"/"),t=R(t,i,r,o),null==e||M(e,"",I,t),N(t)}var z={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return L(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;t=R(null,null,t,n),null==e||M(e,"",D,t),N(t)},count:function(e){return null==e?0:M(e,"",a.thatReturnsNull,null)},toArray:function(e){var t=[];return L(e,t,null,a.thatReturnsArgument),t},only:function(e){return P(e)||g("143"),e}},createRef:function(){return{current:null}},Component:_,PureComponent:E,createContext:function(e,t){return void 0===t&&(t=null),(e={$$typeof:h,_calculateChangedBits:t,_defaultValue:e,_currentValue:e,_currentValue2:e,_changedBits:0,_changedBits2:0,Provider:null,Consumer:null}).Provider={$$typeof:d,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:m,render:e}},Fragment:c,StrictMode:f,unstable_AsyncMode:v,unstable_Profiler:p,createElement:k,cloneElement:function(e,t,n){(null===e||void 0===e)&&g("267",e);var o=void 0,i=r({},e.props),a=e.key,u=e.ref,l=e._owner;if(null!=t){void 0!==t.ref&&(u=t.ref,l=O.current),void 0!==t.key&&(a=""+t.key);var c=void 0;for(o in e.type&&e.type.defaultProps&&(c=e.type.defaultProps),t)C.call(t,o)&&!S.hasOwnProperty(o)&&(i[o]=void 0===t[o]&&void 0!==c?c[o]:t[o])}if(1===(o=arguments.length-2))i.children=n;else if(1<o){c=Array(o);for(var f=0;f<o;f++)c[f]=arguments[f+2];i.children=c}return{$$typeof:s,type:e.type,key:a,ref:u,props:i,_owner:l}},createFactory:function(e){var t=k.bind(null,e);return t.type=e,t},isValidElement:P,version:"16.4.0",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:O,assign:r}},U={default:z},F=U&&z||U;e.exports=F.default?F.default:F},function(e,t,n){"use strict";var r=l(n(1)),o=l(n(284)),i=l(n(276)),a=l(n(206)),u=n(8),s=n(7);function l(e){return e&&e.__esModule?e:{default:e}}document.addEventListener("DOMContentLoaded",function(){window.requestAllPegs=u.requestAllPegs,window.requestOnePeg=u.requestOnePeg,window.createPeg=u.createPeg,window.updatePeg=u.updatePeg,window.deletePeg=u.deletePeg,window.requestAllBoards=s.requestAllBoards,window.requestOneBoard=s.requestOneBoard,window.createBoard=s.createBoard,window.updateBoard=s.updateBoard,window.deleteBoard=s.deleteBoard;var e,t,n,l=void 0;if(window.currentUser){var c={session:{id:window.currentUser.id},entities:{users:(e={},t=window.currentUser.id,n=window.currentUser,t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e)}};l=(0,i.default)(c),delete window.currentUser}else l=(0,i.default)();window.getState=l.getState,window.dispatch=l.dispatch,o.default.render(r.default.createElement(a.default,{store:l}),document.getElementById("root"))})}]);
//# sourceMappingURL=bundle.js.map
;
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
