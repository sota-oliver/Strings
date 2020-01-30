<template>
    <main class="audioPlayer" id="app">
		<a class="nav-icon" v-on:click="isPlaylistActive=!isPlaylistActive" :class="{'isActive': isPlaylistActive}" title="Music List">
			<span></span>
			<span></span>
			<span></span>
			</a>
			<!-- ------------------------------------------------------------------List songs-->
		<div class="audioPlayerList" :class="{'isActive': isPlaylistActive}">
			<div class="item" :key="index" v-for="(item,index) in musicPlaylist" v-bind:class="{ 'isActive':isCurrentSong(index) }" v-on:click="changeSong(index),isPlaylistActive=!isPlaylistActive">
				<p class="title">{{ item.title }}</p>
				<p class="artist">{{ item.artist }}</p>
			</div>

		</div>
		<div class="audioPlayerUI" :class="{'isDisabled': isPlaylistActive}">
			<div class="albumImage">
				<transition name="ballmove" enter-active-class="animated zoomIn" leave-active-class="animated fadeOutDown" mode="out-in">
				</transition>
			</div>
			<div class="albumDetails">
				<transition name="slide-fade" mode="out-in">
					<p class="title" :key="currentSong">{{ musicPlaylist[currentSong].title }}</p>
				</transition>
				<transition name="slide-fade" mode="out-in">
					<p class="artist" :key="currentSong">{{ musicPlaylist[currentSong].artist }}</p>
				</transition>
			</div>
			<div class="playerButtons">
				<!-- ------------------------------------------------------------------Previous, Stop, Play, Next-->
				<a class="button" :class="{'isDisabled':(currentSong==0)}" v-on:click="prevSong()" title="Previous Song"><i class="fa fa-backward"></i></a>
				<a class="button play" v-on:click="playAudio()" title="Play/Pause Song">
					<transition name="slide-fade" mode="out-in">
						<i class="zmdi" :class="[currentlyStopped ? 'fa fa-stop' : (currentlyPlaying ? 'fa fa-pause' : 'fa fa-play')]" :key="1"></i>
					</transition>
				</a>
				<a class="button" :class="{'isDisabled':(currentSong==musicPlaylist.length-1)}" v-on:click="nextSong()" title="Next Song"><i class="fa fa-forward"></i></a>
			</div>

			<div class="currentTimeContainer" style="text-align:center">
				<!-- ------------------------------------------------------------------Current song time passed-->
				<span class="currentTime">{{ currentTime | fancyTimeFormat }}</span>
				<span class="totalTime"> {{ trackDuration | fancyTimeFormat }}</span>
			</div>

			<div class="currentProgressBar">
				<div class="currentProgress" :style="{ width: currentProgressBar + '%' }"></div>
			</div>
		</div>
</main>
</template>
<script>

import store from '@/store.js'

export default {
	name:'Player',
	props: [ "player" ],
    data() {
        return store
	},
	mounted: function() {
		this.changeSong();
		this.audio.loop = false;
		// -----------------------------------------------------------------Get song data
		db.collection("users").doc(this.userEmail).collection("playlist").get()
                                .then((querySnapshot)=> {
                                    querySnapshot.forEach((doc)=> {
                                        this.musicPlaylist.unshift({
                                            title:doc.data().title,
                                            artist:doc.data().artist,
                                            url:doc.data().songUrl
										});
										
									});
									this.musicPlaylist.pop();
                                })
                                .catch(function(error) {
                                    console.log("Error getting documents: ", error);
                                });
	},
	filters: {
		fancyTimeFormat: function(s) {
			return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
		}
	},
	methods: {
		// -----------------------------------------------------------------Toggle playlist
		togglePlaylist: function() {
			this.isPlaylistActive = !this.isPlaylistActive;
		},
		// -----------------------------------------------------------------Next Song
		nextSong: function() {
			if (this.currentSong < this.musicPlaylist.length - 1)
				this.changeSong(this.currentSong + 1);
		},
		// -----------------------------------------------------------------Previous Song
		prevSong: function() {
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},
		// -----------------------------------------------------------------Change Song
		changeSong: function(index) {
			var wasPlaying = this.currentlyPlaying;
			this.imageLoaded = false;
			if (index !== undefined) {
				this.stopAudio();
				this.currentSong = index;
			}
			this.audioFile = this.musicPlaylist[this.currentSong].url;
			this.audio = new Audio(this.audioFile);
			var localThis = this;
			this.audio.addEventListener("loadedmetadata", function() {
				localThis.trackDuration = Math.round(this.duration);
			});
			this.audio.addEventListener("ended", this.handleEnded);
			if (wasPlaying) {
				this.playAudio();
			}
		},
		// -----------------------------------------------------------------Get current song
		isCurrentSong: function(index) {
			if (this.currentSong == index) {
				return true;
			}
			return false;
		},
		getCurrentSong: function(currentSong) {
			return this.musicPlaylist[currentSong].url;
		},
		// -----------------------------------------------------------------Play Song
		playAudio: function() {
			if (
				this.currentlyStopped == true &&
				this.currentSong + 1 == this.musicPlaylist.length
			) {
				this.currentSong = 0;
				this.changeSong();
				
			}
			if (!this.currentlyPlaying) {
				this.getCurrentTimeEverySecond(true);
				this.currentlyPlaying = true;
				this.audio.play();
			} else {
				this.stopAudio();
			}
			this.currentlyStopped = false;
		},
		// -----------------------------------------------------------------Stop Song
		stopAudio: function() {
			this.audio.pause();
			this.currentlyPlaying = false;
			this.pausedMusic();
		},
		handleEnded: function() {
			if (this.currentSong + 1 == this.musicPlaylist.length) {
				this.stopAudio();
				this.currentlyPlaying = false;
				this.currentlyStopped = true;
			} else {
				this.currentlyPlaying = false;
				this.currentSong++;
				this.changeSong();
				this.playAudio();
			}
		},
		onImageLoaded: function() {
			this.imgLoaded = true;
		},
		// -----------------------------------------------------------------Get get current song time
		getCurrentTimeEverySecond: function(startStop) {
			var localThis = this;
			this.checkingCurrentPositionInTrack = setTimeout(
				function() {
					localThis.currentTime = localThis.audio.currentTime;
					localThis.currentProgressBar =
						localThis.audio.currentTime / localThis.trackDuration * 100;
					localThis.getCurrentTimeEverySecond(true);
				}.bind(this),
				1000
			);
		},
		pausedMusic: function() {
			clearTimeout(this.checkingCurrentPositionInTrack);
		},
		toggleDebug: function(){
			this.debug=!this.debug;
			document.body.classList.toggle('debug');
		}
	},
	watch: {
		currentTime: function() {
			this.currentTime = Math.round(this.currentTime);
		}
	},
	beforeDestroy: function() {
		this.audio.removeEventListener("ended", this.handleEnded);
		this.audio.removeEventListener("loadedmetadata", this.handleEnded);

		clearTimeout(this.checkingCurrentPositionInTrack);
	}
}
</script>
<style lang="scss">
    @import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700");
@import url("https://fonts.googleapis.com/css?family=Raleway:400,400i,700");

$primary_color: rgba(0, 0, 0, 0.75);
$player_width: 20rem;
$player_padding: 1.5rem;
$player_border_radius: 0.5rem;

$button_size: 2rem;

$anim_duration: 0.5s;

/* Debugging */
.debug{
	main * { outline: solid 0.25rem rgba(255,0,0,0.25); }
}

* {
	box-sizing: border-box;
}
.animated {
	animation-duration: $anim_duration;
}
.audioPlayer {
	position: relative;
	background-color: #ac9179;;
    height: 100%;

	overflow: hidden;
	margin: 0 auto;

	user-select: none;

    ::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f5ed94; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #362f2d;
}
	.nav-icon {
		width: 15px;
		height: 12px;
        z-index: 10;
		position: absolute;
		top: ($player_padding)-($player_padding/4);
		left: $player_padding;

		transform: rotate(0deg);
		transition: 0.25s ease-in-out;
		cursor: pointer;

		span {
			display: block;
			position: absolute;
			height: 2px;
			width: 100%;
			background: $primary_color;
			border-radius: 6px;
			opacity: 1;
			left: 0;
			transform: rotate(0deg);
			transition: 0.5s ease-in-out;
		}
		span:nth-child(1) {
			top: 0px;
		}

		span:nth-child(2) {
			top: 5px;
		}

		span:nth-child(3) {
			top: 10px;
		}

		&.isActive span:nth-child(1) {
			top: 5px;
			transform: rotate(135deg);
		}

		&.isActive span:nth-child(2) {
			opacity: 0;
			left: -60px;
		}

		&.isActive span:nth-child(3) {
			top: 5px;
			transform: rotate(-135deg);
		}
	}
	.audioPlayerList {
		color: $primary_color;
        height: 100%;
		width: ($player_width)-(2*$player_padding);
		transition: $anim_duration;
		transform: translateX(-200%);
		position: absolute;
		margin-top: 5px;
		overflow: auto;
		z-index: 10;
		will-change: transform;
    	
        
		&.isActive {
			transform: translateX(0);
            left: 60px;
		}
		.item {
			margin-bottom: 1.5rem;
			border-left: 0.1rem solid transparent;
			transition: 0.2s;
            height: 30px;
            line-height: .95rem;

			&:hover {
				padding-left: 0.5rem;
				cursor: pointer;
			}
			.title {
				color: rgba(0, 0, 0, 1);
				font-size: .8rem;
				margin-bottom: 0;
			}
			.artist {
				color: rgba(0, 0, 0, 0.5);
				font-size: 0.6rem;
			}
			&.isActive {
				border-left-color: black;
				padding-left: 1rem;
			}
		}
		.debugToggle{
			cursor:pointer;
			color:red;
		}
	}
	.audioPlayerUI {
		font-family: 'Work Sans', sans-serif;
		will-change: transform, filter;
		transition: $anim_duration;
		&.isDisabled {
			transform: scale(0.75) translateX(100%);
			filter: blur(5px) grayscale(100%);
		}
		.albumDetails {
			text-align: center;
			padding-top: 9px;
			p {
				margin: 0px;
				&.title {
					font-size: 1rem;
					color: rgba(0, 0, 0, 1);
				}
				&.artist {
					margin-top: 0.5rem;
					font-size: 0.75rem;
					font-weight: none;
					color: $primary_color;
					transition-delay: 100ms;
				}
			}
		}
		.playerButtons {
			position: relative;
			margin: 0 auto;
			//margin-bottom: 1.5rem;
			text-align: center;
			
			.button {
				font-size: $button_size;
				display: inline-block;
				vertical-align: middle;
				color: #362f2d;
				border-radius: 50%;

				outline: 0;
				text-decoration: none;
				cursor: pointer;
				transition: $anim_duration;

				&.play {
					font-size: 1.5*$button_size;
					padding: 0 50px;
				}
				&:active {
					opacity: 0.75;
					transform: scale(0.75);
				}
				&.isDisabled {
					color: rgb(68, 68, 68); 
					cursor: initial;
				}
				&.isDisabled:active {
					transform: none;
				}
			}
		}
		.currentTimeContainer {
			width: 100%;
			height: 1rem;
			line-height: .8rem;
			display: flex;
			justify-content: space-between;

			.currentTime,
			.totalTime {
				padding:2px;
				font-size: .8rem;
				color: $primary_color;
			}
		}

		.currentProgressBar {
			width: 100%;
			background-color: rgba(0, 0, 0, 0.1);
			.currentProgress {
				background-color: $primary_color;
				width: 0px;
				height: 3px;
				transition: 100ms;
			}
		}
	}
}
/* OLD CODE
.loader,
.loader:after {
	border-radius: 50%;
	width: 10em;
	height: 10em;
}
.loader {
	margin: 60px auto;
	font-size: 10px;
	position: relative;
	text-indent: -9999em;
	border-top: 0.1em solid rgba(0, 0, 0, 0.2);
	border-right: 0.1em solid rgba(0, 0, 0, 0.2);
	border-bottom: 0.1em solid rgba(0, 0, 0, 0.2);
	border-left: 0.1em solid $primary_color;
	transform: translateZ(0);
	animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
*/
/* data change transitions */
.slide-fade-enter-active {
	transition: all 0.3s ease;
}
.slide-fade-leave-active {
	transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateY(10px);
	opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity $anim_duration;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

/* pen specific formatting */
.heading {
	text-align: center;
	margin: 0;
	margin: 2rem 0;
	font-family: Inconsolata, monospace;

	h1 {
		color: #ECEFF1;
		margin: 0;
		margin-bottom: 1rem;
		font-size: 1.75rem;
	}
	p {
		margin: 0;
		font-size: 0.85rem;
	}
	a {
		color: rgba(255, 255, 255, 0.8);
		transition: 0.3s;
		text-decoration-style: dotted;
		&:hover {
			color: rgba(255, 255, 255, 1) !important;
		}
		&:visited {
			color: rgba(255, 255, 255, 0.5);
		}
	}
}
</style>