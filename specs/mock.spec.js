jest.mock('./mock.js')  // 声明下面引入的 getData 方法是 jest 模拟的，如果不需要引入该方法则不需要声明

import { getData } from './mock.js'  // 导入 mock.js，但实际上 jest 会导入 __mocks__ 下的 mock.js

test('mock 方法测试', (done) => {
  getData().then(data => {
    expect(data).toEqual({
      success: true
    })
    done()
  })
})
