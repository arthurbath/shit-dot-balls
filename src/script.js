import './index.html'
import './style.scss'
import './favicon.png'
import './app-icon.png'

// Set up YouTube player
let firstLoad = true
let youTubeReady = false
window.onYouTubeIframeAPIReady = () => {
	let videoPlayer = new window.YT.Player('videoPortal', { // eslint-disable-line no-unused-vars
		height: '300',
		width: '400',
		playerVars: {
			color: 'white',
			controls: 2,
			enablejsapi: 1,
			iv_load_policy: 3,
			modestbranding: 1,
			playsinline: 0,
			rel: 0,
			showinfo: 0,
		},
		events: {
			onReady: event => {
				event.target.cuePlaylist({
					listType: 'playlist',
					list: 'PLq3AXW8g_v5N1sZ5_LoNYGqjtSCrOs5YY',
				})
			},
			onStateChange: event => {
				// On playlist initially queued
				if (firstLoad && event.data === window.YT.PlayerState.CUED) {
					event.target.setVolume(100) // User should control volume from their device
					event.target.setShuffle(true)
					event.target.setLoop(true)
					event.target.playVideoAt(0) // Play first video in shuffled list
					youTubeReady = true // Set
				}
			},
			onError: event => {
				console.warn('Error playing video', event)
				event.target.nextVideo()
			},
		},
	})
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
	let curtain = document.querySelector('.curtain')
	let logo = document.querySelector('.curtain__logo')

	// When the logo fades out (final transition), hide the curtain, preventing its edges from reappearing on window resize
	logo.addEventListener('transitionend', () => {
		curtain.classList.add('display--none')
	}, { once: true })

	// Check that YouTube is ready, then dismiss the curtain
	let checkYouTubeReady = setInterval(() => {
		if (!youTubeReady) { return }
		curtain.classList.add('curtain--drawn')
		clearInterval(checkYouTubeReady)
	}, 500)
})