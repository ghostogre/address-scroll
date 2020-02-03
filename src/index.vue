<template>
  <div
    class="addressBook"
    ref="addressBook"
    @touchend.passive="handleTouchEnd"
    @touchmove.passive="handleTouchMove">
    <dl
      class="addressBook__item"
      v-for="(letter, idx) in letters"
      :key="letter.key"
      data-wrap="true"
      >
      <dt class="addressBook__itemTitle" :style="titleStyle">{{letter.key}}</dt>
      <dd
        v-for="(address, idx1) in dataList[letter.key]"
        :key="`${letter}-${idx1}`"
        class="addressBook__itemPerson"
        :data-target="`${idx}-${idx1}`"
        :style="`${idx}-${idx1}` == slideTarget ? slideStyle: { transform: 'translateX(0)' }"
        >
        <div
          class="addressBook__itemContent"
          @touchstart="slideStart">
          <slot name="address" :address="address">
            <span>{{address}}</span>
          </slot>
        </div>
        <div v-if="!disableDelete" class="addressBook__itemDelete" @click="handleDelete(dataList[letter.key])">
          删除
        </div>
      </dd>
    </dl>

    <ul
      class="addressBook__letter"
      @touchmove.prevent="handleLetterScroll"
      @touchstart.passive="handleLetterStart"
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
    },
    disableDelete: {
      type: Boolean,
      default: false
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
    },
    // 滑动样式
    slideStyle () {
      return {
        transform: `translateX(-${this.dx}px)`
      }
    }
  },
  data () {
    return {
      letters: [],
      prevOffset: -9999, // 记录上次的scroll
      selectLetter: false,
      indexPosX: -9999,
      startX: 0,
      dx: 0, // 水平位移
      slideTarget: null
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
    handleLetterScroll (e) {
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
    handleLetterStart (e) {
      if (!this.selectLetter) {
        this.indexPosX = e.touches[0].clientX
      } // 固定x为第一次滑动的x坐标
      this.selectLetter = true
    },
    handleTouchMove (e) {
      if (this.disableDelete) {
        return
      }
      const { clientX, clientY } = e.touches[0]
      let targetElement = this.getTarget(document.elementFromPoint(clientX, clientY))
      if (targetElement) {
        this.slideTarget = targetElement.dataset.target
        const dx = this.startX - clientX
        if (dx < 0) {
          this.dx = 0
        } else if (dx > 75) {
          this.dx = 75
        } else {
          this.dx = dx
        }
      }
    },
    slideStart (e) {
      if (this.disableDelete) {
        return
      }
      const { clientX, clientY } = e.touches[0]
      this.startX = clientX
    },
    go(top) {
      this.$refs.addressBook.scrollTop = top
    },
    handleDelete (item) {
      this.$emit('delete', item)
    },
    // 查找父节点
    getTarget(ele) {
      if (!ele || (ele.dataset && ele.dataset.wrap)) {
        return null
      } else if (ele.dataset && ele.dataset.target) {
        return ele
      } else {
        return this.getTarget(ele.parentElement)
      }
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
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    .addressBook__item {
      margin: 0;
      width: 100%;
      flex-wrap: nowrap;
      box-sizing: border-box;
      background-color: white;
      .addressBook__itemTitle {
        font-size: 24px;
        font-weight: bold;
      }

      .addressBook__itemPerson {
        margin: 0;
        height: 45px;
        padding: 5px 0;
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;
        transition: all .2s ease;
      }

      .addressBook__itemDelete {
        position: absolute;
        width: 75px;
        height: 45px;
        text-align: center;
        right: -76px;
        color: white;
        line-height: 45px;
        background-color: #D92E2E!important;
      }

      .addressBook__itemContent {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
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
        user-select: none;
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
