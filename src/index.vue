<template>
  <div
    class="addressBook"
    ref="addressBook"
    @touchend="handleTouchEnd">
    <dl class="addressBook__item" v-for="(letter) in letters" :key="letter.key">
      <dt class="addressBook__itemTitle" :style="titleStyle">{{letter.key}}</dt>
      <dd class="addressBook__itemPerson" v-for="(address, index) in dataList[letter.key]" :key="`${letter}-${index}`">
        <slot name="address" :address="address">
          {{address}}
        </slot>
      </dd>
    </dl>

    <ul
      class="addressBook__letter"
      @touchmove.prevent="handleTouchMove"
      @touchstart="handleTouchStart"
      ref="letterBlock">
      <li
        v-for="letter in letters"
        :key="letter.key"
        :data-offset="letter.top"
        class="addressBook__letterItem"
        :class="{'selected': letter.top == prevOffset}"
        @click="go(letter.top)">
        {{letter.key}}
        <span v-if="bubble"
          class="selected-bubble"
          :style="bubbleStyle">{{letter.key}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import cnchar from 'cnchar'
import 'cnchar-poly'
export default {
  name: 'ying-address-scroll',
  props: {
    data: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    // 按照什么字段进行首字母排序
    label: {
      type: String
    },
    titleStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    // 是否显示提示气泡
    bubble: {
      type: Boolean,
      default: true
    },
    bubbleColor: {
      type: String,
      default: '#3d7e9a'
    },
    bubbleFontSize: {
      type: String,
      default: '22px'
    },
    bubbleSize: {
      type: String,
      default: '36px'
    }
  },
  computed: {
    dataList () {
      let dataList = Object.create(null)
      this.data.map(item => {
        let name = item[this.label] || item
        let letter = cnchar.spell(name, 'first', 'up')[0]
        if (letter.match(/[0-9]/)) {
          letter = '#'
        }
        if (!dataList[letter]) {
          dataList[letter] = []
        }
        dataList[letter].push(item)
      })
      return dataList
    },
    // 气泡样式
    bubbleStyle () {
      return {
        backgroundColor: this.bubbleColor,
        fontSize: this.bubbleFontSize,
        height: this.bubbleSize,
        width: this.bubbleSize,
        lineHeight: this.bubbleSize
      }
    }
  },
  data () {
    return {
      letters: [],
      prevOffset: -9999, // 记录上次的scroll
      selectLetter: false,
      indexPosX: -9999
    }
  },
  mounted () {
    this.calcLocation()
  },
  methods: {
    calcLocation () {
      this.$nextTick(() => {
        let list = Array.prototype.slice.call(this.$refs.addressBook.getElementsByTagName('dl'), 0)
        // getBoundingClientRect : 用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
        list.forEach((node, index) => {
          if (index !== -1) {
            this.letters[index].top = (index > 0 ?
              this.letters[index - 1].top + this.letters[index - 1].height - document.documentElement.clientTop || 2
              : 0
            ) // ie7和ie7以下HTML从(2,2)开始
            this.letters[index].height = node.getBoundingClientRect().height
          }
        })
      })
    },
    // 滑动索引
    handleTouchMove (e) {
      const x = this.indexPosX
      const y = e.touches[0].clientY
      const target = document.elementFromPoint(x, y)
      const offset = target && target.dataset && target.dataset.offset
      if (offset && offset !== this.prevOffset) {
        this.prevOffset = offset
        this.go(offset)
      }
    },
    // 滑动结束
    handleTouchEnd () {
      this.prevOffset = -9999
      this.selectLetter = false
    },
    // 滑动开始
    handleTouchStart (e) {
      if (!this.selectLetter) {
        this.indexPosX = e.touches[0].clientX
      } // 固定x为第一次滑动的x坐标
      this.selectLetter = true
    },
    go(top) {
      this.$refs.addressBook.scrollTop = top
    }
  },
  watch: {
    dataList: {
      handler: function (val) {
        let keys = Object.keys(val)
        // 简单排序
        keys.sort()
        this.letters = keys.map(key => {
          return {
            key,
            top: 0,
            height: 0
          }
        })
        this.calcLocation()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  .addressBook {
    height: 100%;
    overflow: scroll;
    .addressBook__item {
      padding: 5px 10px;
      margin: 0;
      background-color: white;
      .addressBook__itemTitle {
        font-size: 24px;
        font-weight: bold;
      }
      .addressBook__itemPerson {
        padding: 5px 0px;
        margin: 0;
      }
    }

    .addressBook__letter {
      list-style: none;
      margin: 0;
      padding: 0;
      position: fixed;
      top: 50%;
      right: 0;
      height: 100vh;
      z-index: 999;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      li {
        width: 25px;
        text-align: center;
        font-size: 16px;
        opacity: .9;
        padding: 5px 0;
        position: relative;
        transition: opacity .2s ease-in;
        &:hover, &.selected {
          font-size: 22px;
          font-weight: bold;
        }

        .selected-bubble {
          display: none;
          position: absolute;
          color: white;
          text-align: center;
          border-radius: 50%;
          top: 50%;
          left: 0;
          transition: display .2s ease-in-out;
          transform: translate(-100%, -50%);
        }

        &.selected {
          .selected-bubble {
            display: inline-block;
          }
        }
      }
    }
  }
</style>
