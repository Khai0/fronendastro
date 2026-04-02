import Vue from 'vue'

Vue.filter('replace', (value, searchValue, newValue) => {
  return value.replace(searchValue, newValue)
})
