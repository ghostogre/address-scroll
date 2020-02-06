import Scroll from '@/index.vue'
import { shallowMount } from '@vue/test-utils'

describe('测试 通讯录组件', () => {
  it('测试能否自定义显示字段', () => {
    const wrapper = shallowMount(Scroll, {
      propsData: {
        data: [
          {
            name: '曹丕'
          },
          {
            name: '吕布'
          },
          {
            name: '貂蝉'
          }
        ],
        label: 'name'
      }
    })
    expect(wrapper.find('.addressBook__itemContent span').text()).toEqual('曹丕')
  })

  it('测试是否能设置取消侧滑删除', () => {
    const wrapper = shallowMount(Scroll, {
      propsData: {
        data: [
          '曹丕',
          '吕布',
          '貂蝉'
        ]
      }
    })
    expect(wrapper.find('.addressBook__itemDelete').isVueInstance()).toBe(false)
  })
})
