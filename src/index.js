/**
 * Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
 * made@coderesolution.com
 */
export default class InviewDetection {
	constructor(options = {}, gsap = null, ScrollTrigger = null) {
		// Set dependencies
		this._gsap = gsap
		this._ScrollTrigger = ScrollTrigger

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
				y: 20,
			},
			animationTo: {
				opacity: 1,
				y: 0,
			},
			screen: '(min-width: 1025px)',
			autoStart: true,
			inviewClass: 'is-inview',
			viewedClass: 'has-viewed',
			debug: false,
		}

		// Merge default options with provided options
		this.options = { ...this.defaultOptions, ...options }

		// Store ScrollTrigger instances
		this.triggers = []

		// Store all animated elements
		this.animatedElementsList = []

		// Store event listeners
		this.eventListeners = {}

		// Start by default if set
		if (this.getOption('autoStart')) {
			this.init()
		}
	}

	// Register GSAP and plugins
	register(gsap, ScrollTrigger) {
		this._gsap = gsap
		this._ScrollTrigger = ScrollTrigger
	}

	// Function to get a specific option
	getOption(optionName) {
		return this.options[optionName]
	}

	// Initialisation function
	init() {
		// Check if gsap is registered
		if (this._gsap === null || this._gsap === undefined) {
			console.log('GSAP is not registered. Exiting')
			return
		}

		// Check if ScrollTrigger is registered
		if (this._ScrollTrigger === null || this._ScrollTrigger === undefined) {
			console.log('ScrollTrigger is not registered. Exiting')
			return
		}

		try {
			// Convert elements to an array and loop through each
			this._gsap.utils.toArray(this.getOption('elements')).forEach((parent, index) => {
				// Define array to hold animated elements
				let animatedElementsList = []

				// If the parent doesn't have 'data-inview-scope' attribute,
				// add it to the animated elements
				// Otherwise, add scoped and child elements
				if (!parent.hasAttribute('data-inview-scope')) {
					animatedElementsList.push({ el: parent, order: parent.dataset.inviewOrder })
				} else {
					this.addScopedElements(parent, animatedElementsList)
					this.addChildElements(parent, animatedElementsList)
				}

				// Order the animated elements based on their 'order' property
				this.sortAnimatedElements(animatedElementsList)

				// Animate the elements
				this.animateElements(parent, animatedElementsList, index)
			})
		} catch (error) {
			// Catch and log any errors
			console.error('Error initialising InviewDetection:', error)
		}
	}

	// Function to register event listeners
	on(eventName, listener) {
		if (!this.eventListeners[eventName]) {
			this.eventListeners[eventName] = []
		}
		this.eventListeners[eventName].push(listener)
	}

	// Function to emit events
	emit(eventName, element) {
		const eventListeners = this.eventListeners[eventName]
		if (eventListeners) {
			eventListeners.forEach((listener) => {
				listener(element)
			})
		}
	}

	// Function to load and initialize the class
	start() {
		// Initialize the class
		this.init()
	}

	// Function to add scoped elements to the animatedElementsList array
	addScopedElements(parent, animatedElementsList) {
		try {
			// If the parent has 'data-inview-scope' attribute,
			// add all elements defined in this attribute to the animatedElementsList array
			if (parent.dataset.inviewScope) {
				parent.querySelectorAll(':scope ' + parent.dataset.inviewScope).forEach((element) => {
					const order = parseFloat(element.dataset.inviewOrder)
					animatedElementsList.push({ el: element, order: order })
					this.animatedElementsList.push(element)
				})
			}
		} catch (error) {
			// Catch and log any errors
			console.error('Error adding scoped elements:', error)
		}
	}

	// Function to add child elements to the animatedElementsList array
	addChildElements(parent, animatedElementsList) {
		try {
			// Add all elements with 'data-inview-child' attribute to the animatedElementsList array
			parent.querySelectorAll(':scope [data-inview-child]').forEach((element) => {
				const order = parseFloat(element.dataset.inviewOrder)
				animatedElementsList.push({ el: element, order: order })
				this.animatedElementsList.push(element)
			})
		} catch (error) {
			// Catch and log any errors
			console.error('Error adding child elements:', error)
		}
	}

	// Function to find the closest parent with 'data-inview-order' attribute
	findClosestParentOrderAttr(element) {
		let parent = element.parentElement
		let ancestorsIndexed = 0
		let ancestorsLimit = 5

		// Iterate through parent elements up to ancestorsLimit
		while (parent && ancestorsIndexed <= ancestorsLimit) {
			if (parent.hasAttribute('data-inview-order')) {
				return parseFloat(parent.getAttribute('data-inview-order'))
			}
			parent = parent.parentElement
			ancestorsIndexed++
		}

		if (element.hasAttribute('data-inview-order')) {
			const value = element.getAttribute('data-inview-order')
			return isNaN(+value) ? false : +value
		}

		return false
	}

	// Function to order animated elements based on their 'order' property
	sortAnimatedElements(animatedElementsList) {
		animatedElementsList.sort((a, b) => {
			return (a['order'] ?? 1) - (b['order'] ?? -1)
		})

		// Replace each animatedElement object with its corresponding element
		for (let i = 0; i < animatedElementsList.length; i++) {
			animatedElementsList[i] = animatedElementsList[i].el
		}
	}

	// Function to animate the elements
	animateElements(parent, animatedElementsList, index) {
		// Initialise animation property arrays
		let animationFromPropertiesArray = []
		let animationToPropertiesArray = []

		// Create a matchMedia instance
		const matchMedia = this._gsap.matchMedia()

		// Get the screen media query
		const screen = parent.dataset.inviewScreen || this.getOption('screen')

		// Initialise a new gsap timeline
		matchMedia.add(screen, () => {
			let timeline = this._gsap.timeline({
				scrollTrigger: {
					trigger: parent,
					start: parent.dataset.inviewStart || this.getOption('start'),
					invalidateOnRefresh: true,
					onEnter: async () => {
						timeline.play()
						timeline.hasPlayed = true

						parent.classList.add(this.getOption('viewedClass'))

						// Check if the parent has the 'data-inview-call' attribute and, if so, dispatch a custom event with the attribute's value as the event name
						if (parent.hasAttribute('data-inview-call')) {
							const customEventName = parent.getAttribute('data-inview-call')
							window.dispatchEvent(
								new CustomEvent(customEventName, {
									detail: {
										target: parent,
									},
								}),
							)
						}

						if (this.eventListeners['onEnter']) {
							this.emit('onEnter', parent)
						}
					},
					onLeave: () => {
						if (parent.hasAttribute('data-inview-repeat')) {
							timeline.restart().pause()
						}
						if (this.eventListeners['onLeave']) {
							this.emit('onLeave', parent)
						}
					},
					onEnterBack: async () => {
						if (parent.hasAttribute('data-inview-repeat')) {
							timeline.restart()
							timeline.hasPlayed = true
						} else if (!timeline.hasPlayed) {
							timeline.play()
							timeline.hasPlayed = true
						}
						if (this.eventListeners['onEnterBack']) {
							this.emit('onEnterBack', parent)
						}
					},
					onLeaveBack: () => {
						if (parent.hasAttribute('data-inview-repeat')) {
							timeline.restart().pause()
						}
						if (this.eventListeners['onLeaveBack']) {
							this.emit('onLeaveBack', parent)
						}
					},
					markers: this.getOption('debug') || parent.hasAttribute('data-inview-debug') ? true : false, // Modified line to include global debug option
					toggleClass: {
						targets: parent,
						className: this.getOption('inviewClass'),
					},
				},
			})

			timeline.hasPlayed = false

			// Initialise a variable to hold the current time position on the timeline
			let currentTime = 0

			animatedElementsList.forEach((element) => {
				try {
					let animationFromProperties = this.getOption('animationFrom')
					let animationToProperties = this.getOption('animationTo')

					// Check if the element has custom animation properties defined in 'data-inview-from' and 'data-inview-to'
					if (element.dataset.inviewFrom) {
						animationFromProperties = JSON.parse(element.dataset.inviewFrom)
					} else if (parent.dataset.inviewFrom) {
						animationFromProperties = JSON.parse(parent.dataset.inviewFrom)
					}

					if (element.dataset.inviewTo) {
						animationToProperties = JSON.parse(element.dataset.inviewTo)
					} else if (parent.dataset.inviewTo) {
						animationToProperties = JSON.parse(parent.dataset.inviewTo)
					}

					// Push the properties for this element to the arrays
					animationFromPropertiesArray.push(animationFromProperties)
					animationToPropertiesArray.push(animationToProperties)

					// Set initial animation properties for the animated elements
					this._gsap.set(element, animationFromProperties)

					// Get the stagger time
					let staggerTime = parent.dataset.inviewStagger || this.getOption('stagger')

					// Add the animation to the timeline
					timeline.to(
						element,
						{
							...animationToProperties,
							duration: parent.dataset.inviewDuration || this.getOption('duration'),
							delay: parent.dataset.inviewDelay || this.getOption('delay'),
							ease: parent.dataset.inviewEase || this.getOption('ease'),
						},
						currentTime,
					)

					// Increase the current time position by the stagger time for the next animation
					currentTime += parseFloat(staggerTime)
				} catch (e) {
					console.error(`An error occurred while animating the element: ${e}`)
				}
			})

			// Pause the timeline initially, the onEnter/onEnterBack events will play/restart it
			timeline.pause()
		})

		// Debug mode
		if (this.getOption('debug') || parent.hasAttribute('data-inview-debug')) {
			this.debugMode(
				parent,
				animatedElementsList,
				animationFromPropertiesArray,
				animationToPropertiesArray,
				index,
			)
		}
	}

	// Function for debug mode logging
	debugMode(parent, animatedElementsList, animationFromProperties, animationToProperties, index) {
		console.group(`InviewDetection() debug instance (#${index + 1})`)
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
			stagger: this.getOption('stagger'),
		})
		console.groupEnd()
	}

	// Function to refresh ScrollTrigger instances
	refresh() {
		this._ScrollTrigger.refresh()

		if (this.eventListeners['refresh']) {
			this.emit('refresh', parent)
		}
	}

	// Function to stop the animations and ScrollTrigger instances
	stop() {
		// Kill ScrollTrigger instances created in this script
		this.triggers.forEach((st) => st.kill())

		// Kill all animations
		const allElements = this._gsap.utils.toArray(this.getOption('elements')).concat(this.animatedElementsList)

		allElements.forEach((element) => {
			this._gsap.killTweensOf(element)
		})

		if (this.eventListeners['stop']) {
			this.emit('stop', parent)
		}
	}

	// Function to restart the animations and reinitialise everything
	restart() {
		// Kill all GSAP animations of the elements
		this._gsap.utils.toArray(this.getOption('elements')).forEach((element) => {
			this._gsap.killTweensOf(element)
		})

		// Reinitialise everything
		this.init()

		if (this.eventListeners['restart']) {
			this.emit('restart', parent)
		}
	}
}

window.InviewDetection = InviewDetection
