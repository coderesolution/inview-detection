!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e||self).inviewDetection=t()}(this,function(){function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e},e.apply(this,arguments)}/*#__PURE__*/
return function(){function t(t,i,n){void 0===t&&(t={}),void 0===i&&(i=null),void 0===n&&(n=null),this._gsap=i,this._ScrollTrigger=n,this.defaultOptions={elements:"[data-inview]",duration:1,delay:.1,start:"top 90%",ease:"power4",stagger:.08,animationFrom:{opacity:0,"will-change":"transform",y:20},animationTo:{opacity:1,y:0},screen:"(min-width: 1025px)",autoStart:!0,inviewClass:"is-inview",viewedClass:"has-viewed",debug:!1},this.options=e({},this.defaultOptions,t),this.triggers=[],this.animatedElementsList=[],this.eventListeners={},this.getOption("autoStart")&&this.init()}var i=t.prototype;return i.register=function(e,t){this._gsap=e,this._ScrollTrigger=t},i.getOption=function(e){return this.options[e]},i.init=function(){var e=this;if(null!=this._gsap)if(null!=this._ScrollTrigger)try{this._gsap.utils.toArray(this.getOption("elements")).forEach(function(t,i){var n=[];t.hasAttribute("data-inview-scope")?(e.addScopedElements(t,n),e.addChildElements(t,n)):n.push({el:t,order:t.dataset.inviewOrder}),e.sortAnimatedElements(n),e.animateElements(t,n,i)})}catch(e){console.error("Error initialising InviewDetection:",e)}else console.log("ScrollTrigger is not registered. Exiting");else console.log("GSAP is not registered. Exiting")},i.on=function(e,t){this.eventListeners[e]||(this.eventListeners[e]=[]),this.eventListeners[e].push(t)},i.emit=function(e,t){var i=this.eventListeners[e];i&&i.forEach(function(e){e(t)})},i.start=function(){this.init()},i.addScopedElements=function(e,t){var i=this;try{e.dataset.inviewScope&&e.querySelectorAll(":scope "+e.dataset.inviewScope).forEach(function(e){var n=parseFloat(e.dataset.inviewOrder);t.push({el:e,order:n}),i.animatedElementsList.push(e)})}catch(e){console.error("Error adding scoped elements:",e)}},i.addChildElements=function(e,t){var i=this;try{e.querySelectorAll(":scope [data-inview-child]").forEach(function(e){var n=parseFloat(e.dataset.inviewOrder);t.push({el:e,order:n}),i.animatedElementsList.push(e)})}catch(e){console.error("Error adding child elements:",e)}},i.findClosestParentOrderAttr=function(e){for(var t=e.parentElement,i=0;t&&i<=5;){if(t.hasAttribute("data-inview-order"))return parseFloat(t.getAttribute("data-inview-order"));t=t.parentElement,i++}if(e.hasAttribute("data-inview-order")){var n=e.getAttribute("data-inview-order");return!isNaN(+n)&&+n}return!1},i.sortAnimatedElements=function(e){e.sort(function(e,t){var i,n;return(null!=(i=e.order)?i:1)-(null!=(n=t.order)?n:-1)});for(var t=0;t<e.length;t++)e[t]=e[t].el},i.animateElements=function(t,i,n){var a=this,r=[],s=[],o=this._gsap.matchMedia(),l=t.dataset.inviewScreen||this.getOption("screen");o.add(l,function(){var n=a._gsap.timeline({scrollTrigger:{trigger:t,start:t.dataset.inviewStart||a.getOption("start"),invalidateOnRefresh:!0,onEnter:function(){try{if(n.play(),n.hasPlayed=!0,t.classList.add(a.getOption("viewedClass")),t.hasAttribute("data-inview-call")){var e=t.getAttribute("data-inview-call");window.dispatchEvent(new CustomEvent(e,{detail:{target:t}}))}return a.eventListeners.onEnter&&a.emit("onEnter",t),Promise.resolve()}catch(e){return Promise.reject(e)}},onLeave:function(){t.hasAttribute("data-inview-repeat")&&n.restart().pause(),a.eventListeners.onLeave&&a.emit("onLeave",t)},onEnterBack:function(){try{return t.hasAttribute("data-inview-repeat")?(n.restart(),n.hasPlayed=!0):n.hasPlayed||(n.play(),n.hasPlayed=!0),a.eventListeners.onEnterBack&&a.emit("onEnterBack",t),Promise.resolve()}catch(e){return Promise.reject(e)}},onLeaveBack:function(){t.hasAttribute("data-inview-repeat")&&n.restart().pause(),a.eventListeners.onLeaveBack&&a.emit("onLeaveBack",t)},markers:!(!a.getOption("debug")&&!t.hasAttribute("data-inview-debug")),toggleClass:{targets:t,className:a.getOption("inviewClass")}}});n.hasPlayed=!1;var o=0;i.forEach(function(i){try{var l=a.getOption("animationFrom"),d=a.getOption("animationTo");i.dataset.inviewFrom?l=JSON.parse(i.dataset.inviewFrom):t.dataset.inviewFrom&&(l=JSON.parse(t.dataset.inviewFrom)),i.dataset.inviewTo?d=JSON.parse(i.dataset.inviewTo):t.dataset.inviewTo&&(d=JSON.parse(t.dataset.inviewTo)),r.push(l),s.push(d),a._gsap.set(i,l);var c=t.dataset.inviewStagger||a.getOption("stagger");n.to(i,e({},d,{duration:t.dataset.inviewDuration||a.getOption("duration"),delay:t.dataset.inviewDelay||a.getOption("delay"),ease:t.dataset.inviewEase||a.getOption("ease")}),o),o+=parseFloat(c)}catch(e){console.error("An error occurred while animating the element: "+e)}}),n.pause()}),(this.getOption("debug")||t.hasAttribute("data-inview-debug"))&&this.debugMode(t,i,r,s,n)},i.debugMode=function(e,t,i,n,a){console.group("InviewDetection() debug instance (#"+(a+1)+")"),console.log({parent:e,elements:t,screen:this.getOption("screen"),animationFrom:i,animationTo:n,duration:this.getOption("duration"),delay:this.getOption("delay"),start:this.getOption("start"),ease:this.getOption("ease"),stagger:this.getOption("stagger")}),console.groupEnd()},i.refresh=function(){this._ScrollTrigger.refresh(),this.eventListeners.refresh&&this.emit("refresh",parent)},i.stop=function(){var e=this;this.triggers.forEach(function(e){return e.kill()}),this._gsap.utils.toArray(this.getOption("elements")).concat(this.animatedElementsList).forEach(function(t){e._gsap.killTweensOf(t)}),this.eventListeners.stop&&this.emit("stop",parent)},i.restart=function(){var e=this;this._gsap.utils.toArray(this.getOption("elements")).forEach(function(t){e._gsap.killTweensOf(t)}),this.init(),this.eventListeners.restart&&this.emit("restart",parent)},t}()});
//# sourceMappingURL=inview-detection.umd.js.map
