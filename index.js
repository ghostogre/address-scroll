import AddressScroll from './src/index.vue'

let plugin = {
  install(Vue, options) {
    Vue.component("ying-address-scroll", AddressScroll)
  }
}

// Vue全局变量的时候，自动安装
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export {
  AddressScroll
}

export default plugin
