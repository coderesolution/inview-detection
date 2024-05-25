(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global["inview-detection"] = factory());
})(this, (function () {
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  /**
   * Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
   * made@coderesolution.com
   */
  var InviewDetection = /*#__PURE__*/function () {
    function InviewDetection(options, gsap, ScrollTrigger) {
      if (options === void 0) {
        options = {};
      }
      if (gsap === void 0) {
        gsap = null;
      }
      if (ScrollTrigger === void 0) {
        ScrollTrigger = null;
      }
      // Set dependencies
      this._gsap = gsap;
      this._ScrollTrigger = ScrollTrigger;

      // Define default options
      this.defaultOptions = {
        elements: '[data-inview]',
        duration: 1,
        delay: 0.1,
        start: 'top 90%',
        ease: 'power4',
        stagger: 0.08,
        animationFrom: {
          opacity: 0,
          'will-change': 'transform',
          y: 20
        },
        animationTo: {
          opacity: 1,
          y: 0
        },
        screen: '(min-width: 1025px)',
        autoStart: true,
        inviewClass: 'is-inview',
        viewedClass: 'has-viewed',
        debug: false
      };

      // Merge default options with provided options
      this.options = _extends({}, this.defaultOptions, options);

      // Store ScrollTrigger instances
      this.triggers = [];

      // Store all animated elements
      this.animatedElementsList = [];

      // Store event listeners
      this.eventListeners = {};

      // Start by default if set
      if (this.getOption('autoStart')) {
        this.init();
      }
    }

    // Register GSAP and plugins
    var _proto = InviewDetection.prototype;
    _proto.register = function register(gsap, ScrollTrigger) {
      this._gsap = gsap;
      this._ScrollTrigger = ScrollTrigger;
    }

    // Function to get a specific option
    ;
    _proto.getOption = function getOption(optionName) {
      return this.options[optionName];
    }

    // Initialisation function
    ;
    _proto.init = function init() {
      var _this = this;
      // Check if gsap is registered
      if (this._gsap === null || this._gsap === undefined) {
        console.log('GSAP is not registered. Exiting');
        return;
      }

      // Check if ScrollTrigger is registered
      if (this._ScrollTrigger === null || this._ScrollTrigger === undefined) {
        console.log('ScrollTrigger is not registered. Exiting');
        return;
      }
      try {
        // Convert elements to an array and loop through each
        this._gsap.utils.toArray(this.getOption('elements')).forEach(function (parent, index) {
          // Define array to hold animated elements
          var animatedElementsList = [];

          // If the parent doesn't have 'data-inview-scope' attribute,
          // add it to the animated elements
          // Otherwise, add scoped and child elements
          if (!parent.hasAttribute('data-inview-scope')) {
            animatedElementsList.push({
              el: parent,
              order: parent.dataset.inviewOrder
            });
          } else {
            _this.addScopedElements(parent, animatedElementsList);
            _this.addChildElements(parent, animatedElementsList);
          }

          // Order the animated elements based on their 'order' property
          _this.sortAnimatedElements(animatedElementsList);

          // Animate the elements
          _this.animateElements(parent, animatedElementsList, index);
        });
      } catch (error) {
        // Catch and log any errors
        console.error('Error initialising InviewDetection:', error);
      }
    }

    // Function to register event listeners
    ;
    _proto.on = function on(eventName, listener) {
      if (!this.eventListeners[eventName]) {
        this.eventListeners[eventName] = [];
      }
      this.eventListeners[eventName].push(listener);
    }

    // Function to emit events
    ;
    _proto.emit = function emit(eventName, element) {
      var eventListeners = this.eventListeners[eventName];
      if (eventListeners) {
        eventListeners.forEach(function (listener) {
          listener(element);
        });
      }
    }

    // Function to load and initialize the class
    ;
    _proto.start = function start() {
      // Initialize the class
      this.init();
    }

    // Function to add scoped elements to the animatedElementsList array
    ;
    _proto.addScopedElements = function addScopedElements(parent, animatedElementsList) {
      var _this2 = this;
      try {
        // If the parent has 'data-inview-scope' attribute,
        // add all elements defined in this attribute to the animatedElementsList array
        if (parent.dataset.inviewScope) {
          parent.querySelectorAll(':scope ' + parent.dataset.inviewScope).forEach(function (element) {
            var order = parseFloat(element.dataset.inviewOrder);
            animatedElementsList.push({
              el: element,
              order: order
            });
            _this2.animatedElementsList.push(element);
          });
        }
      } catch (error) {
        // Catch and log any errors
        console.error('Error adding scoped elements:', error);
      }
    }

    // Function to add child elements to the animatedElementsList array
    ;
    _proto.addChildElements = function addChildElements(parent, animatedElementsList) {
      var _this3 = this;
      try {
        // Add all elements with 'data-inview-child' attribute to the animatedElementsList array
        parent.querySelectorAll(':scope [data-inview-child]').forEach(function (element) {
          var order = parseFloat(element.dataset.inviewOrder);
          animatedElementsList.push({
            el: element,
            order: order
          });
          _this3.animatedElementsList.push(element);
        });
      } catch (error) {
        // Catch and log any errors
        console.error('Error adding child elements:', error);
      }
    }

    // Function to find the closest parent with 'data-inview-order' attribute
    ;
    _proto.findClosestParentOrderAttr = function findClosestParentOrderAttr(element) {
      var parent = element.parentElement;
      var ancestorsIndexed = 0;
      var ancestorsLimit = 5;

      // Iterate through parent elements up to ancestorsLimit
      while (parent && ancestorsIndexed <= ancestorsLimit) {
        if (parent.hasAttribute('data-inview-order')) {
          return parseFloat(parent.getAttribute('data-inview-order'));
        }
        parent = parent.parentElement;
        ancestorsIndexed++;
      }
      if (element.hasAttribute('data-inview-order')) {
        var value = element.getAttribute('data-inview-order');
        return isNaN(+value) ? false : +value;
      }
      return false;
    }

    // Function to order animated elements based on their 'order' property
    ;
    _proto.sortAnimatedElements = function sortAnimatedElements(animatedElementsList) {
      animatedElementsList.sort(function (a, b) {
        var _a$order, _b$order;
        return ((_a$order = a['order']) != null ? _a$order : 1) - ((_b$order = b['order']) != null ? _b$order : -1);
      });

      // Replace each animatedElement object with its corresponding element
      for (var i = 0; i < animatedElementsList.length; i++) {
        animatedElementsList[i] = animatedElementsList[i].el;
      }
    }

    // Function to animate the elements
    ;
    _proto.animateElements = function animateElements(parent, animatedElementsList, index) {
      var _this4 = this;
      // Initialise animation property arrays
      var animationFromPropertiesArray = [];
      var animationToPropertiesArray = [];

      // Create a matchMedia instance
      var matchMedia = this._gsap.matchMedia();

      // Get the screen media query
      var screen = parent.dataset.inviewScreen || this.getOption('screen');

      // Initialise a new gsap timeline
      matchMedia.add(screen, function () {
        var timeline = _this4._gsap.timeline({
          scrollTrigger: {
            trigger: parent,
            start: parent.dataset.inviewStart || _this4.getOption('start'),
            invalidateOnRefresh: true,
            onEnter: function () {
              try {
                timeline.play();
                timeline.hasPlayed = true;
                parent.classList.add(_this4.getOption('viewedClass'));

                // Check if the parent has the 'data-inview-call' attribute and, if so, dispatch a custom event with the attribute's value as the event name
                if (parent.hasAttribute('data-inview-call')) {
                  var customEventName = parent.getAttribute('data-inview-call');
                  window.dispatchEvent(new CustomEvent(customEventName, {
                    detail: {
                      target: parent
                    }
                  }));
                }
                if (_this4.eventListeners['onEnter']) {
                  _this4.emit('onEnter', parent);
                }
                return Promise.resolve();
              } catch (e) {
                return Promise.reject(e);
              }
            },
            onLeave: function onLeave() {
              if (parent.hasAttribute('data-inview-repeat')) {
                timeline.restart().pause();
              }
              if (_this4.eventListeners['onLeave']) {
                _this4.emit('onLeave', parent);
              }
            },
            onEnterBack: function () {
              try {
                if (parent.hasAttribute('data-inview-repeat')) {
                  timeline.restart();
                  timeline.hasPlayed = true;
                } else if (!timeline.hasPlayed) {
                  timeline.play();
                  timeline.hasPlayed = true;
                }
                if (_this4.eventListeners['onEnterBack']) {
                  _this4.emit('onEnterBack', parent);
                }
                return Promise.resolve();
              } catch (e) {
                return Promise.reject(e);
              }
            },
            onLeaveBack: function onLeaveBack() {
              if (parent.hasAttribute('data-inview-repeat')) {
                timeline.restart().pause();
              }
              if (_this4.eventListeners['onLeaveBack']) {
                _this4.emit('onLeaveBack', parent);
              }
            },
            markers: _this4.getOption('debug') || parent.hasAttribute('data-inview-debug') ? true : false,
            // Modified line to include global debug option
            toggleClass: {
              targets: parent,
              className: _this4.getOption('inviewClass')
            }
          }
        });
        timeline.hasPlayed = false;

        // Initialise a variable to hold the current time position on the timeline
        var currentTime = 0;
        animatedElementsList.forEach(function (element) {
          try {
            var animationFromProperties = _this4.getOption('animationFrom');
            var animationToProperties = _this4.getOption('animationTo');

            // Check if the element has custom animation properties defined in 'data-inview-from' and 'data-inview-to'
            if (element.dataset.inviewFrom) {
              animationFromProperties = JSON.parse(element.dataset.inviewFrom);
            } else if (parent.dataset.inviewFrom) {
              animationFromProperties = JSON.parse(parent.dataset.inviewFrom);
            }
            if (element.dataset.inviewTo) {
              animationToProperties = JSON.parse(element.dataset.inviewTo);
            } else if (parent.dataset.inviewTo) {
              animationToProperties = JSON.parse(parent.dataset.inviewTo);
            }

            // Push the properties for this element to the arrays
            animationFromPropertiesArray.push(animationFromProperties);
            animationToPropertiesArray.push(animationToProperties);

            // Set initial animation properties for the animated elements
            _this4._gsap.set(element, animationFromProperties);

            // Get the stagger time
            var staggerTime = parent.dataset.inviewStagger || _this4.getOption('stagger');

            // Add the animation to the timeline
            timeline.to(element, _extends({}, animationToProperties, {
              duration: parent.dataset.inviewDuration || _this4.getOption('duration'),
              delay: parent.dataset.inviewDelay || _this4.getOption('delay'),
              ease: parent.dataset.inviewEase || _this4.getOption('ease')
            }), currentTime);

            // Increase the current time position by the stagger time for the next animation
            currentTime += parseFloat(staggerTime);
          } catch (e) {
            console.error("An error occurred while animating the element: " + e);
          }
        });

        // Pause the timeline initially, the onEnter/onEnterBack events will play/restart it
        timeline.pause();
      });

      // Debug mode
      if (this.getOption('debug') || parent.hasAttribute('data-inview-debug')) {
        this.debugMode(parent, animatedElementsList, animationFromPropertiesArray, animationToPropertiesArray, index);
      }
    }

    // Function for debug mode logging
    ;
    _proto.debugMode = function debugMode(parent, animatedElementsList, animationFromProperties, animationToProperties, index) {
      console.group("InviewDetection() debug instance (#" + (index + 1) + ")");
      console.log({
        parent: parent,
        elements: animatedElementsList,
        screen: this.getOption('screen'),
        animationFrom: animationFromProperties,
        animationTo: animationToProperties,
        duration: this.getOption('duration'),
        delay: this.getOption('delay'),
        start: this.getOption('start'),
        ease: this.getOption('ease'),
        stagger: this.getOption('stagger')
      });
      console.groupEnd();
    }

    // Function to refresh ScrollTrigger instances
    ;
    _proto.refresh = function refresh() {
      this._ScrollTrigger.refresh();
      if (this.eventListeners['refresh']) {
        this.emit('refresh', parent);
      }
    }

    // Function to stop the animations and ScrollTrigger instances
    ;
    _proto.stop = function stop() {
      var _this5 = this;
      // Kill ScrollTrigger instances created in this script
      this.triggers.forEach(function (st) {
        return st.kill();
      });

      // Kill all animations
      var allElements = this._gsap.utils.toArray(this.getOption('elements')).concat(this.animatedElementsList);
      allElements.forEach(function (element) {
        _this5._gsap.killTweensOf(element);
      });
      if (this.eventListeners['stop']) {
        this.emit('stop', parent);
      }
    }

    // Function to restart the animations and reinitialise everything
    ;
    _proto.restart = function restart() {
      var _this6 = this;
      // Kill all GSAP animations of the elements
      this._gsap.utils.toArray(this.getOption('elements')).forEach(function (element) {
        _this6._gsap.killTweensOf(element);
      });

      // Reinitialise everything
      this.init();
      if (this.eventListeners['restart']) {
        this.emit('restart', parent);
      }
    };
    return InviewDetection;
  }();

  return InviewDetection;

}));
