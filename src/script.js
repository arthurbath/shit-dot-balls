import html from './index.html' // eslint-disable-line no-unused-vars
import css from './style.scss' // eslint-disable-line no-unused-vars

let firstLoad = true
let videoPlayer // eslint-disable-line no-unused-vars
window.onYouTubeIframeAPIReady = () => {
	videoPlayer = new window.YT.Player('videoPortal', {
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
				}
			},
			onError: event => {
				console.warn('Error playing video', event)
				event.target.nextVideo()
			},
		},
	})
}