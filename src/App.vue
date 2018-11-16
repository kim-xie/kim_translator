<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
@font-face {
  font-family: 'iconfont';  /* project id 829348 */
  src: url('//at.alicdn.com/t/font_829348_l8j5ekn6eko.eot');
  src: url('//at.alicdn.com/t/font_829348_l8j5ekn6eko.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_829348_l8j5ekn6eko.woff') format('woff'),
  url('//at.alicdn.com/t/font_829348_l8j5ekn6eko.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_829348_l8j5ekn6eko.svg#iconfont') format('svg');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 56rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-Group-:before { content: "\e6a3"; }

</style>
