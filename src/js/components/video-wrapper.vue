<template>
  <div class="video-wrapper relative w-full h-full flex justify-center align-center">
    <youtube
      v-if="videoType === 'youtube'"
      ref="youtube"
      :class="classes"
      :video-id="videoId"
      :player-vars="options"
      class="video-wrapper__video w-full h-full"
      controls="0"
      @ready="onReady"
      @playing="onPlaying"
      @paused="onPaused"
    />
    <vimeo
      v-else-if="videoType === 'vimeo'"
      ref="vimeo"
      :class="classes"
      :options="options"
      :video-id="videoId"
      :controls="false"
      class="video-wrapper__video w-full h-full"
      @ready="onReady"
      @play="onPlaying"
      @pause="onPaused"
    />
    <video
      v-else
      ref="htmlVideo"
      :class="[{lozad : isLazyLoaded}, classes ]"
      class="video-wrapper__video object-contain"
      disableremoteplayback
      nodownload
      muted
      playsinline
      controlsList="nodownload"
      disablePictureInPicture
      :autoplay="isAutoplay"
      :loop="isLoop"
      :data-poster="thumbnail"
      @play="onPlaying"
      @pause="onPaused"
      @canplay="onReady"
    >
      <source
        v-for="videoUrl in sources"
        ref="htmlVideoSource"
        :key="videoUrl"
        type="video/mp4"
      >
      <img
        ref="htmlVideoThumbnail"
        :alt="thumbnailAlt"
      >
    </video>

    <div
      class="mask absolute flex items-center justify-center cursor-pointer"
      @click="togglePlay()"
    >
      <svg
        v-if="!isPlaying && !isLoading"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 32 32"
      >
        <path
          fill="#fff"
          fill-rule="evenodd"
          d="M16 2c7.732 0 13.999 6.268 13.999 14s-6.267 14-14 14C8.269 30 2 23.732 2 16S8.268 2 16 2zm-1.547 9.819c-.833-.51-1.917.069-1.917 1.022v6.318c0 .943 1.063 1.523 1.895 1.035l5.273-3.09c.794-.466.805-1.578.02-2.058z"
        />
      </svg>
    </div>

    <div
      v-if="isLoading"
      class="mask mask--loading"
    >
      <span class="spinner">Loading</span>
    </div>
  </div>
</template>

<script>
/*
* VideoWrapper Vue component
* ---
* Wrapper for videos, currently supports:
* - Youtube
* - Vimeo
*
* Example usage:
* <video-wrapper
*   video-type="youtube"
*   video-id="12345"
*   aspect-ratio="56.25%"
*   :is-visible="false"
*   :is-autoplay="true"
*   :is-mute="true"
*   :is-loop="true"
* ></video-wrapper>
*
* Known issue:
* - vue-youtube postMessage console error (only in Chrome), but video appears to work - https://github.com/anteriovieira/vue-youtube/issues/38
*   - Have tried adding 'origin: window.location.origin' to video options, but no luck
*/
import { Youtube } from 'vue-youtube'
import { vueVimeoPlayer } from 'vue-vimeo-player'
import lozad from 'lozad'

export default {
  name: 'VideoWrapper',
  components: {
    Youtube,
    vimeo: vueVimeoPlayer
  },
  props: {
    classes: {
      type: String,
      default: ''
    },
    videoType: {
      type: String,
      default: ''
    },
    videoId: {
      type: String,
      default: ''
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    aspectRatio: {
      type: String,
      default: '56.25%'
    },
    isAutoplay: {
      type: Boolean,
      default: false
    },
    isMute: {
      type: Boolean,
      default: true
    },
    isLoop: {
      type: Boolean,
      default: true
    },
    sources: {
      type: Array,
      default: () => []
    },
    thumbnail: {
      type: String,
      default: ''
    },
    thumbnailAlt: {
      type: String,
      default: ''
    },
    isLazyLoaded: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isReady: false,
    isLoading: false,
    isPlaying: false,
    options: {}
  }),
  computed: {
    ytPlayer () {
      return this.$refs.youtube.player
    },
    vimPlayer () {
      return this.$refs.vimeo
    },
    htmlVideoPlayer () {
      return this.$refs.htmlVideo
    },
    isVisibleAndDesktop () {
      return this.isVisible && window.matchMedia('(min-width: 992px)').matches
    },
    isAutoplaying () {
      return this.isReady && this.isVisibleAndDesktop && this.isAutoplay
    }
  },
  watch: {
    isAutoplaying (value) {
      if (value) {
        this.playVideo()
      } else {
        this.pauseVideo()
      }
    }
  },
  created () {
    if (this.videoType === 'youtube') {
      // Youtube options - https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5
      this.options = {
        mute: this.isMute,
        rel: 0,
        controls: 0
      }
      if (this.isLoop) {
        this.options.loop = 1
        this.options.playlist = this.videoId
      }
    } else if (this.videoType === 'vimeo') {
      // Vimeo options - https://github.com/vimeo/player.js/#embed-options
      this.options = {
        muted: this.isMute,
        loop: this.isLoop,
        controls: false
      }
    }
  },
  mounted () {
    // Only HTML5 videos can be lazy loaded. Vimeo and Youtube embeds have no lazyload support yet
    if (this.isLazyLoaded) {
      this.$refs.htmlVideo?.setAttribute('data-poster', this.thumbnail)
      this.$refs.htmlVideoSource?.forEach(source => {
        source.setAttribute('data-src', this.sources[0])
      })
      this.$refs.htmlVideoThumbnail?.setAttribute('data-src', this.thumbnail)
      const observer = lozad()
      observer.observe()
    } else {
      this.$refs.htmlVideo?.setAttribute('poster', this.thumbnail)
      this.$refs.htmlVideoSource?.forEach(source => {
        source.setAttribute('src', this.sources[0])
      })
      this.$refs.htmlVideoThumbnail?.setAttribute('src', this.thumbnail)
    }
  },
  methods: {
    togglePlay () {
      if (this.isPlaying) {
        this.pauseVideo()
      } else {
        this.playVideo()
      }
    },

    async playVideo () {
      if (!this.isReady) return
      this.isLoading = true
      if (this.videoType === 'youtube') {
        await this.ytPlayer.playVideo()
      } else if (this.videoType === 'vimeo') {
        await this.vimPlayer.play()
      } else {
        await this.htmlVideoPlayer.play()
      }
      this.isLoading = false
    },

    pauseVideo () {
      if (!this.isReady) return
      if (this.videoType === 'youtube') {
        this.ytPlayer.pauseVideo()
      } else if (this.videoType === 'vimeo') {
        this.vimPlayer.pause()
      } else {
        this.htmlVideoPlayer.pause()
      }
    },

    onReady () {
      this.isReady = true
    },

    onPlaying () {
      this.isPlaying = true
    },

    onPaused () {
      this.isPlaying = false
    }
  }
}
</script>

<style>
.video-wrapper iframe {
  width: 100% !important;
  height: 100% !important;
  aspect-ratio: 16 / 9;
}
</style>
