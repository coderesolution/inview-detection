// Main script
import InviewDetection from '../src/index'

// Register GSAP and plugins
gsap.registerPlugin(ScrollTrigger)

// Lenis smooth scroll
const lenis = new Lenis({
	lerp: 0.1,
	duration: 1.2,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
	lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

/* Initialise InviewDetection.js */

// const inview = new InviewDetection({
// 	autoStart: false,
// },gsap, ScrollTrigger);

const inview = new InviewDetection({
	autoStart: false,
	debug: false,
})
inview.register(gsap, ScrollTrigger)

/* Buttons */
const oButtons = document.querySelectorAll('.js-button')

oButtons.forEach((oButton) => {
	oButton.addEventListener('click', (e) => {
		e.preventDefault()

		switch (oButton.dataset.method) {
			case 'refresh':
				inview.refresh()
				break

			case 'stop':
				inview.stop()
				break

			case 'restart':
				inview.restart()
				break

			default:
				console.log('No method')
		}
	})
})

document.addEventListener('DOMContentLoaded', (event) => {
	inview.start()
})

window.addEventListener('inviewEvent', (e) => {
	console.log('target', e.detail.target)
})

// inview.on('onEnter', (element) => {
// 	console.log('Entering top of view:', element)
// })
// inview.on('onLeave', (element) => {
// 	console.log('Leaving bottom of view:', element)
// })
// inview.on('onEnterBack', (element) => {
// 	console.log('Entering bottom of view:', element)
// })
// inview.on('onLeaveBack', (element) => {
// 	console.log('Leaving top of view:', element)
// })
// inview.on('restart', () => {
// 	console.log('Restarted')
// })
// inview.on('stop', (target) => {
// 	console.log('Stopped', target)
// })
// inview.on('refresh', () => {
// 	console.log('Refreshed')
// })
