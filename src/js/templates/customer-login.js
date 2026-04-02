const RECOVER_HASH = '#recover'

export default {
  data () {
    return {
      isRecoverPasswordShown: false,
      isRecoverSuccessShown: false
    }
  },

  mounted () {
    if (this.$refs.isRecoverSuccess) {
      this.isRecoverSuccessShown = true
    }

    if (window.location.hash === RECOVER_HASH) {
      this.isRecoverPasswordShown = true
    }
  },

  methods: {
    toggleRecoverPassword () {
      this.isRecoverPasswordShown = !this.isRecoverPasswordShown

      if (this.isRecoverPasswordShown) {
        history.replaceState(null, null, RECOVER_HASH)
      } else {
        history.replaceState(null, null, ' ')
      }
    }
  }
}
