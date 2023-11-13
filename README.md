<h1 align="center">InviewDetection.js</h1>

A powerful javascript library to create sequential animations based on in-view detection. Powered by GSAP.

## Features

-   Standalone elements
-   Scoping, bind elements to parent
-   Custom queuing and animations
-   Trigger callbacks
-   Staggered text animations with SplitText
-   Repeatable
-   Target specific screen sizes
-   Debugging mode
-   Lightweight (>3Kb gzipped)

## Dependencies

The following <u>must</u> be instantiated before:

-   GSAP v3 (https://greensock.com/gsap/)
-   GSAP ScrollTrigger (https://greensock.com/scrolltrigger/)
-   GSAP SplitText (https://greensock.com/splittext/)

## Quick start

### Installation

InviewDetection.js requires the GSAP library, as well as ScrollTrigger and SplitText (Club GreenSock) to work. You need to include all of them before InviewDetection.js.

#### Boilerplate

We have already included the file in our [Boilerplate](https://github.com/coderesolution/boilerplate).

#### Use from CDN

```html
<!-- Include GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/ScrollTrigger.min.js"></script>
<script src="/path-to/SplitText.min.js"></script>

<!-- Include InviewDetection -->
<script src="https://cdn.jsdelivr.net/gh/coderesolution/InviewDetection.js/bundled/InviewDetection.min.js"></script>

<script>
	// Register GSAP
	gsap.registerPlugin(ScrollTrigger, SplitText)

	// Initialise InviewDetection
	const inview = new InviewDetection(/*options*/)
</script>

<!-- For better results, hide SplitText by default -->
<style>
	[data-inview-split] {
		visibility: hidden;
	}
</style>
```

Alternatively, you can register GSAP inside the inview initialisation:

```html
<script>
	// Initialise InviewDetection and register GSAP ScrollTrigger and SplitText plugins
	const inview = new InviewDetection({
		registerGsapPlugins: true,
	})
</script>
```

If you wish to initiate the module but not start it yet, you can do so by setting the `autoStart` to false and running `inview.start()`. This can be helpful if you experience incorrect results when using the `data-inview-split` feature that uses GSAP:

```html
<script>
	// Create instance but do not start automatically
	const inview = new InviewDetection({
		autoStart: false,
	})

	// Start it when you are ready
	document.addEventListener('DOMContentLoaded', (event) => {
		inview.start()
	})
</script>
```

#### Install NPM module

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import InviewDetection from './path-to/InviewDetection'

// Register GSAP
gsap.registerPlugin(ScrollTrigger, SplitText)

// Initialise InviewDetection
const inview = new InviewDetection(/*options*/)
```

## Defaults

You can configure InviewDetection.js default via options (and overwrite them on a per-animation basis using modifiers):

```js
const inview = new InviewDetection({
	elements: '[data-inview]',
	screen: '(min-width: 1025px)',
	duration: 1,
	delay: 1,
	start: 'top 90%',
	ease: 'power4',
	stagger: 0.155,
	animationFrom: {
		opacity: 0,
		'will-change': 'transform',
		y: 20,
	},
	animationTo: {
		opacity: 1,
		y: 0,
	},
	autoStart: true,
	registerGsapPlugins: false,
	inviewClass: 'is-inview',
	viewedClass: 'has-viewed',
})
```

| Name                  |   Type    |          Default          | Description                                                                                          |
| :-------------------- | :-------: | :-----------------------: | :--------------------------------------------------------------------------------------------------- | --- |
| `elements`            | `string`  |       `data-inview`       | Trigger elements, defaults to                                                                        |
| `screen`              | `string`  |  `'(min-width: 1025px)'`  | Set media query conditions via matchMedia to target specific screen sizes. Use 'all' for every size. |
| `duration`            | `number`  |            `1`            | Duration of each animation.                                                                          |
| `delay`               | `number`  |           `.1`            | Delay before animation.                                                                              |
| `start`               | `string`  |         `top 90%`         | ScrollTrigger's starting position.                                                                   |
| `ease`                | `string`  |         `power4`          | Easing of animation ([help](https://greensock.com/docs/Easing)).                                     |
| `stagger`             | `number`  |          `0.08`           | Time between each animation. Defaults to                                                             |
| `animationFrom`       |  `json`   | `{"opacity": 0, "y": 20}` | The beginning of each animation.                                                                     |
| `animationTo`         |  `json`   | `{"opacity": 1, "y": 0}`  | The ending of each animation.                                                                        |
| `autoStart`           | `boolean` |           true            | Initialise straight-away. Useful if a delay is needed to fix SplitText issues.                       |
| `registerGsapPlugins` | `boolean` |           false           | Register ScrollTrigger and SplitText automatically.                                                  |
| `inviewClass`         | `string`  |        `is-inview`        | Class applied to parent elements (not scoped) that are inview.                                       |     |
| `viewedClass`         | `string`  |       `has-viewed`        | Class applied to parent elements (not scoped) that have been viewed.                                 |

## Instructions

### Usage

| Name                |   Type   | Description                                                                                                                                                                                                           |
| :------------------ | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-inview`       |          | Apply attribute to trigger elements that are either standalone or parents of nested items by including a `data-inview-scope`                                                                                          |
| `data-inview-scope` | `string` | Apply to `data-inview` element to specify the scope of nested elements. Use wildcards like `*`, `> *` or selectors `.class, #id`. By default, it will scope only `data-inview-child` and `data-inview-split` elements |
| `data-inview-child` |          | Apply attribute to elements that should animate when parent comes into to view                                                                                                                                        |
| `data-inview-split` | `string` | Same as `data-inview-child`, however, apply SplitText to direct text elements to animate per line. Set a value to target specific elements, i.e. `p, li`                                                              |

### Modifiers

Apply any of the following to `[data-inview]` element to apply custom settings:

| Name                   |   Type   |          Default          | Description                                                                                                                                                                                                                                                                                    |
| :--------------------- | :------: | :-----------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-inview-debug`    |          |                           | Set GSAP markers and output helpful console information.                                                                                                                                                                                                                                       |
| `data-inview-screen`   |          |  `'(min-width: 1025px)'`  | Enable animation only at specific screen sizes. Use 'all' for every size.                                                                                                                                                                                                                      |
| `data-inview-duration` | `number` |            `1`            | Duration of each element transition.                                                                                                                                                                                                                                                           |
| `data-inview-delay`    | `number` |           `.1`            | Delay before entire sequence begins.                                                                                                                                                                                                                                                           |
| `data-inview-stagger`  | `number` |          `0.08`           | Delay between each element in sequence.                                                                                                                                                                                                                                                        |
| `data-inview-ease`     | `string` |         `power4`          | GSAP easing.                                                                                                                                                                                                                                                                                   |
| `data-inview-order`    | `number` |                           | Apply an index to scoped elements, either `[data-inview-child]` or `[data-inview-split]` or elements specified in the respective parent's `[data-inview-scope]`. This will adjust the order of the element within the animation sequence. Negative numbers appear first, then positive numbers |
| `data-inview-start`    | `string` |         `top 90%`         | When animation begins.                                                                                                                                                                                                                                                                         |
| `data-inview-from`     |  `json`  | `{"opacity": 0, "y": 20}` | Apply custom `gsap.from()` properties for every element. Example: `{"opacity": 0, "y": 20, "rotation": 0}`                                                                                                                                                                                     |
| `data-inview-to`       |  `json`  | `{"opacity": 1, "y": 0}`  | Apply custom `gsap.to()` properties for every element. Example: `{"opacity": 1, "y": 0, "rotation": 10}`                                                                                                                                                                                       |
| `data-inview-repeat`   |          |                           | Whether or not to repeat animations when they re-enter the viewport. Disabled by default.                                                                                                                                                                                                      |
| `data-inview-call`     | `string` |                           | Fire custom events when elements enter, re-enter. Example: `data-inview-call="scrollEvent"`.                                                                                                                                                                                                   |

### Methods

#### Start

Start the initialisation if `autoStart` is set to false.

```js
inview.start()
```

Tip: This is useful if you want to start after the page has loaded, like so:

```js
document.addEventListener('DOMContentLoaded', (event) => {
	inview.start()
})
```

#### Refresh

Update ScrollTrigger calculations.

```js
inview.refresh()
```

#### Stop

Stop all animations so anything not yet visible does not load in.

```js
inview.stop()
```

#### Restart

Stop and restart all animations.

```js
inview.restart()
```

### Classes

| Class        | Application                                        |
| :----------- | :------------------------------------------------- |
| `is-inview`  | Once the element has came into view at least once. |
| `has-viewed` | Toggles when the element is in view.               |

The application remains the same even if the classes have been changed from their default setting.

### Events

#### Element enter/leave the viewport

Detect when a animation (re)fires from a particular direction.

```js
inview.on('onEnter', (element) => {
	console.log('Entering top of view:', element)
})
inview.on('onLeave', (element) => {
	console.log('Leaving bottom of view:', element)
})
inview.on('onEnterBack', (element) => {
	console.log('Entering bottom of view:', element)
})
inview.on('onLeaveBack', (element) => {
	console.log('Leaving top of view:', element)
})
```

#### Refresh

Detect when the `inview.refresh()` method is fired.

```js
inview.on('refresh', () => {
	console.log('Refreshed')
})
```

#### Stop

Detect when the `inview.stop()` method is fired.

```js
inview.on('stop', (target) => {
	console.log('Stopped', target)
})
```

#### Restart

Detect when the `inview.restart()` method is fired.

```js
inview.on('restart', () => {
	console.log('Restarted')
})
```

### Custom Callbacks

#### Events

Fire custom events when elements enter or leave the viewport.

```html
<div data-inview data-inview-call="inviewEvent">Trigger</div>
```

```js
window.addEventListener('inviewEvent', (e) => {
	console.log('target', e.detail.target)
})
```

## FAQ

<details>
<summary>1. The elements appear for a second before hiding and subsequently animating in</summary>

#### Reason

This is because Javascript has to load before it can hide the elements.

#### Solution

Here are recommended solutions:

-   Use critical CSS to apply essential styles on load, such as hiding above-the-fold elements that you wish to animate.
-   Add a page transition.
-   Add a pre-loader.

</details>

<details>

<summary>2. My `data-inview-split` lines are splitting incorrectly</summary>

#### Reason

This may happen is the text or its' container is modified by Javascript.

#### Solution

As a result, it is best to try disabling autoStart by setting it false and running `inview.start()` when everything else has ran.

#### Example

```html
<script>
	// Create instance but do not start automatically
	const inview = new InviewDetection({
		autoStart: false,
	})

	// Start it when you are ready
	document.addEventListener('DOMContentLoaded', (event) => {
		inview.start()
	})
</script>

<!-- Hide split elements on load -->
<style>
	[data-inview-split] {
		visibility: hidden;
	}
</style>
```

</details>

<details>

<summary>3. Using `data-inview-from` and `data-inview-to` attributes with PHP+HTML</summary>

#### Reason

This is purely frustrating having so many speech-marks and apostrophes, so here are some easy work-arounds that beat opening/closing PHP.

#### Solution

As a result, it is best to try disabling autoStart by setting it false and running `inview.start()` when everything else has ran.

#### Example

a. Concatenate strings:
```php
<?php
$attr = '{"opacity": 0, "scale": 20}';
echo '" data-inview data-inview-from=' . $attr . '">';
?>
```

b. Use an array and json_encode:
```php
<?php
$attr = ['opacity' => 0, 'scale' => 20];
echo '" data-inview data-inview-from=' . json_encode($attr) . '">';
?>
```

c. Use heredoc or nowdoc syntax:
```php
<?php echo <<<EOF
" data-inview data-inview-from={"opacity": 0, "scale": 20}">
EOF;
?>
```

</details>

## Examples of use

-   [Code Resolution](https://coderesolution.com/): Digital agency partner.
-   [Enumera Molecular](#): Coming soon.
-   [Stairwell](#): Coming soon.
-   [US Foot & Ankle Specialists](#): Coming soon.

## License

[The MIT License (MIT)](LICENSE)
