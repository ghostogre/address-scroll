<template>
  <div id="app">
    <address-scroll :data="data"></address-scroll>
  </div>
</template>

<script>
import AddressScroll from './index.vue'
export default {
  components: {
    AddressScroll
  },
  data () {
    return {
      data: [
        "许褚",
        "于禁",
        "典韦",
        "曹操",
        "曹仁",
        "曹真",
        "曹爽",
        "吕布",
        "貂蝉",
        "伽罗",
        "甄姬",
        "蔡文姬",
        "刘邦",
        "项羽",
        "墨子",
        "鲁邦七号",
        "荆轲",
        "盘古",
        "女娲"
      ]
    }
  }
}
</script>

<style lang="css">
  html, body {
    margin: 0;
    padding: 0;
  }
  #app {
    height: 100vh;
    padding: 0 10px;
  }
</style>