# Inview Detection

Inview Detection enables the creation of sequential animations based on in-view detection. Powered by GSAP.

<a href="https://www.npmjs.com/package/inview-detection"><img src="https://img.shields.io/npm/v/inview-detection?color=red" alt="NPM Version"></a>
<a href="LICENSE"><img src="https://img.shields.io/github/license/coderesolution/inview-detection?color=orange" alt="Licence"></a>
<img src="https://img.shields.io/bundlephobia/min/inview-detection?color=green" alt="Bundle file size">
<img src="https://img.shields.io/bundlephobia/minzip/inview-detection?color=yellow&label=gzip%20size" alt="Bundle file size (gzip)">

## Features

-   Standalone elements
-   Scoping, bind elements to parent
-   Custom queuing and animations
-   Trigger callbacks
-   Repeatable
-   Target specific screen sizes
-   Debugging mode
-   Lightweight (1.63 kB gzipped)

## Dependencies

Ensure the following dependencies are installed and properly registered:

-   [GSAP v3](https://greensock.com/gsap/)
-   [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)

## Quick start

Inview Detection requires the GSAP library as well as ScrollTrigger to function correctly. Ensure both are included **before** Inview Detection and registered within the instantiation.

### Install from NPM

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InviewDetection from 'inview-detection'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Initialise InviewDetection and pass in gsap and ScrollTrigger
const inview = new InviewDetection(
	{
		/* options */
	},
	gsap,
	ScrollTrigger
)
```

### Delayed start (recommended)

To initialise the module without starting it immediately, set `autoStart` option to `false`.

```js
// Create instance but do not start automatically
const inview = new InviewDetection(
	{
		autoStart: false,
	},
	gsap,
	ScrollTrigger
)

// Start it when you are ready
document.addEventListener('DOMContentLoaded', () => {
	inview.start()
})
```

With `autoStart` disabled, for extra clarity `inview.register` can be used to register `gsap` and `ScrollTrigger` outside of the instantiation.

```js
// Standard
const inview = new InviewDetection(
	{
		autoStart: false,
	},
	gsap,
	ScrollTrigger
)
```

Optionally may be replaced with:

```js
const inview = new InviewDetection({
	autoStart: false,
})

// Register gsap and ScrollTrigger separately
inview.register(gsap, ScrollTrigger)
```

### Install from CDN

If you prefer to use a CDN, here is an example:

```html
<!-- Include GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/ScrollTrigger.min.js"></script>

<!-- Include InviewDetection -->
<script src="https://cdn.jsdelivr.net/npm/inview-detection/bundled/index.min.js"></script>

<script>
	// Register ScrollTrigger plugin
	gsap.registerPlugin(ScrollTrigger)

	// Initialise InviewDetection and pass in gsap and ScrollTrigger
	const inview = new InviewDetection(
		{
			/* options */
		},
		gsap,
		ScrollTrigger
	)
</script>
```

## Options

You can configure Inview Detection via options:

```js
const inview = new InviewDetection(
	{
		elements: '[data-inview]',
		autoStart: true,
		screen: '(min-width: 1025px)',
		duration: 1,
		delay: 0.1,
		start: 'top 90%',
		ease: 'power4',
		stagger: 0.08,
		animationFrom: {
			opacity: 0,
			'will-change': 'transform',
			y: 20,
		},
		animationTo: {
			opacity: 1,
			y: 0,
		},
		inviewClass: 'is-inview',
		viewedClass: 'has-viewed',
		debug: false,
	},
	gsap,
	ScrollTrigger
)
```

All options:

| Name            |  Type  |          Default          | Description                                                                                                                          |
| :-------------- | :----: | :-----------------------: | :----------------------------------------------------------------------------------------------------------------------------------- |
| `elements`      | `str`  |      `[data-inview]`      | What elements to apply inview animations to.                                                                                         |
| `autoStart`     | `bool` |          `true`           | Whether to start immediately. Set to `false` for a delayed start (recommended).                                                      |
| `screen`        | `str`  |  `'(min-width: 1025px)'`  | Specify media query rules for animations. This can be overwritten on a per animation-basis. Set to `all` to remove queries entirely. |
| `duration`      | `num`  |            `1`            | Duration of each animation.                                                                                                          |
| `delay`         | `num`  |           `.1`            | Delay before animation starts.                                                                                                       |
| `start`         | `str`  |         `top 90%`         | ScrollTrigger's starting position for the animation.                                                                                 |
| `ease`          | `str`  |         `power4`          | Easing of animation ([help](https://greensock.com/docs/Easing)).                                                                     |
| `stagger`       | `num`  |          `0.08`           | Time between each animation in the sequence.                                                                                         |
| `animationFrom` | `json` | `{"opacity": 0, "y": 20}` | The initial state of each animation.                                                                                                 |
| `animationTo`   | `json` | `{"opacity": 1, "y": 0}`  | The final state of each animation.                                                                                                   |
| `inviewClass`   | `str`  |       `'is-inview'`       | The class that is temporarily assigned to elements when they are within the viewport.                                                |
| `viewedClass`   | `str`  |      `'has-viewed'`       | The class that is permanently assigned to elements when they have been within the viewport.                                          |
| `debug`         | `bool` |          `false`          | Set debug mode to all instances. Enables markers and console logs.                                                                   |

## Attributes

Apply any of the following data attributes in conjunction with `[data-inview]` to enable custom animations.

-   `scope` for scoped elements within parent
-   `child` for child elements that should animate with parent
-   `debug` for enabling debugging markers and logs
-   `order` for specifying the order of animation
-   `repeat` for allowing repeat animations
-   `from` for setting animation from properties
-   `to` for setting animation to properties

### Scope

Attribute: `data-inview-scope`
Type: `string`

Specify the scope of nested elements using wildcards like `*`, `> *` or selectors `.class, #id`.

```html
<div data-inview data-inview-scope="> *">
	<!-- All direct children will be considered for animation -->
</div>
```

### Child

Attribute: `data-inview-child`

Apply attribute to elements that should animate when parent comes into view.

```html
<div data-inview>
	<div data-inview-child>Child 1</div>
	<div data-inview-child>Child 2</div>
</div>
```

### Debug

Attribute: `data-inview-debug`

Enable debugging markers and logs for animations.

```html
<div data-inview data-inview-debug></div>
```

### Order

Attribute: `data-inview-order`
Type: `number`

Specify the order of animation for elements within a scope.

```html
<div data-inview>
	<div data-inview-child data-inview-order="1">First</div>
	<div data-inview-child data-inview-order="2">Second</div>
</div>
```

### Repeat

Attribute: `data-inview-repeat`

Allow animations to re-trigger when elements re-enter the viewport.

```html
<div data-inview data-inview-repeat></div>
```

### From / To

Attributes: `data-inview-from`, `data-inview-to`
Type: `json`

Specify custom `gsap.from()` and `gsap.to()` properties for animations.

```html
<div data-inview data-inview-from='{"opacity": 0, "y": 20}' data-inview-to='{"opacity": 1, "y": 0}'>
	Custom Animation
</div>
```

## Methods

### Start

Start Inview Detection to initialize animations, useful when `autoStart` is set to `false`.

```js
inview.start()
```

### Register GSAP

Register `gsap` and `ScrollTrigger` dependencies with InviewDetection.

```js
inview.register(gsap, ScrollTrigger)
```

### Refresh

Update ScrollTrigger calculations, useful if the page height changes.

```js
inview.refresh()
```

### Stop

Stop all animations and remove the ScrollTrigger instances.

```js
/* Stop all animations */
inview.stop()

/* Stop a specific animation */
// Fetch the element
const element = document.querySelector('#myElement')
const trigger = inview.fetch(element)
inview.stop(trigger)
```

### Restart

Stop and restart animations.

```js
inview.restart()
```

## Classes

| Class        | Application                                                  |
| :----------- | :----------------------------------------------------------- |
| `is-inview`  | Temporarily assigned to elements when they are in view.      |
| `has-viewed` | Permanently assigned to element when they have been in view. |

## Events

### Enter/Leave the viewport

Detect when elements enter or leave the viewport.

```js
inview.on('onEnter', (element) => {
	console.log('Entering view:', element)
})
inview.on('onLeave', (element) => {
	console.log('Leaving view:', element)
})
inview.on('onEnterBack', (element) => {
	console.log('Re-entering view:', element)
})
inview.on('onLeaveBack', (element) => {
	console.log('Leaving view again:', element)
})
```

### Refresh

Detect when the `inview.refresh()` method is fired.

```js
inview.on('refresh', () => {
	console.log('Refreshed')
})
```

### Stop

Detect when the `inview.stop()` method is fired.

```js
inview.on('stop', (target) => {
	console.log('Stopped', target)
})
```

### Restart

Detect when the `inview.restart()` method is fired.

```js
inview.on('restart', () => {
	console.log('Restarted')
})
```

## Examples of use

-   [Code Resolution](https://coderesolution.com)
-   [Bay Harbor Towers](https://bayharbortowers.com)
-   [Enumera Molecular](https://enumeramolecular.com)
-   [Stairwell](https://stairwell.com)
-   [Divino](https://divinoharrogate.co.uk)
-   [US Foot & Ankle Specialists](https://us-fas.com)

## License

[The MIT License (MIT)](LICENSE)
