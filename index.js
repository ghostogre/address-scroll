import LetterScroll from './src/index.vue'

let plugin = {
  install(Vue, options) {
    Vue.component("ying-letter-scroll", LetterScroll)
  }
}

// Vue全局变量的时候，自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export {
  LetterScroll
}

export default plugin
