# handleShow(Object object)

## 参数说明

| 属性         | 说明                         | 类型     | 默认值  |
| ------------ | ---------------------------- | -------- | ------- |
| modalID      | 组件标识                     | String   | modal   |
| title        | 标题                         | String   | -       |
| content      | 内容                         | String   | -       |
| showCancel   | 是否显示取消按钮             | Boolean  | true    |
| cancelColor  | 取消按钮的文字颜色           | String   | #1c2438 |
| cancelText   | 取消按钮的文案               | String   | 取消    |
| confirmColor | 确认按钮的文字颜色           | String   | #007aff |
| confirmText  | 确定按钮的文案               | String   | 确定    |
| actionMode   | 按钮的排列方向               | Boolean  | true    |
| maskClose    | 点击遮罩层是否可以关闭组件   | Boolean  | false   |
| actions      | 按钮组，具体项参照后面的表格 | Array    | []      |
| success      | 组件调用成功的回调函数       | function | -       |
| slot         | slot插槽内容对应content属性  | slot     | -       |

## actions说明

| 属性    | 说明                                       | 类型   |      |
| ------- | ------------------------------------------ | ------ | ---- |
| name    | 按钮文案                                   | String | -    |
| icon    | 按钮图标                                   | String | -    |
| image   | 按钮图片                                   | String | -    |
| color   | 按钮文字的颜色                             | String | -    |
| loading | 按钮是否显示为加载中（开启loading必须为0） | Number | -    |

## success返回值

| 属性       | 说明                                   | 类型     |
| ---------- | -------------------------------------- | -------- |
| modalID    | 组件标识                               | String   |
| id         | 按钮标识                               | Number   |
| handleHide | 回调函数关闭组件(loading必须为0才会有) | function |

## 示例代码

```
<template>
  <view class="app">
    <button @click="testModal1">一般用法</button>
    <button @click="testModal2">异步用法</button>
    <min-modal ref="modal">
      <view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
        <view>hello world</view>
      </view>
    </min-modal>
  </view>
</template>

<script>
import minModal from '@/components/min-modal/min-modal'
export default {
  components: {
    minModal
  },
  methods: {
    testModal1 () {
      this.$refs.modal.handleShow({
        title: 'hello',
        // 有content选项时solt插槽将失效
        content: 'hello world',
        success: (res) => {
          console.log(res)
        }
      })
    },
    testModal2 () {
      this.$refs.modal.handleShow({
        title: '温馨提示',
        actions: [{
          name: '选项一',
          color: '#f30',
          icon: 'iconfont active'
        }, {
          name: '选项二',
          image: 'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
        }, 
        {
          name: '异步',
          loading: 0,
          image: 'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
        }],
        success: (res) => {
          switch (res.id) {
            // 代表选项一按钮
            case 0:
              console.log(res)
              break
            // 代表选项二按钮
            case 1:
              console.log(res)
              break
            // 代表异步按钮
            case 2:
              setTimeout(() => {
                // 异步特有的回调方法函数
                // 主要：loading必须为数字0
                res.handleHide()
              }, 3000)
              break
          }
        }
      })
    }
  }
}
</script>
```

