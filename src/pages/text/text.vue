<template>
  <div class="text">
    <div class="lang">
      <div class="item source">
        <picker @change="bindPickerChange('source', $event)" :value="langs[source_index].value" range-key="label" :range="langs">
          <view class="picker">
            {{langs[source_index].label}}
          </view>
        </picker>
      </div>
      <div class="item arrow">
        <icon class="iconfont icon-Group-" @tap="langReserve"></icon>
      </div>
      <div class="item dist">
        <picker @change="bindPickerChange('dist', $event)" :value="langs[dist_index].value" range-key="label" :range="langs">
          <view class="picker">
            {{langs[dist_index].label}}
          </view>
        </picker>
      </div>
    </div>

    <div class="time">
      2018/11/16 12:00:00
    </div>

    <div class="content">
      <div class="content_wrap">
        <div class="source_content">
          <textarea class="textarea" @blur="textareaBlur($event)" placeholder="请输入需要翻译的文本内容..."/>
        </div>
        <div class="line"></div>
        <div class="dist_content">
          <p class="content_text">{{text}}</p>
        </div>
      </div>
    </div>

    <button type="primary" @tap="audioPlay">播放</button>

  </div>
</template>

<script>
export default {
  data () {
    return {
      langs: [
        {value:'zh', label:'中文'},
        {value:'en', label:'英文'},
        {value:'jp', label:'日语'}],
      source_index: 0,
      dist_index: 1,
      text: '',
      audioSrc: ''
    }
  },
  beforeMount(){
    
  },
  computed: {
    
  },
  methods: {
    // 失去焦点翻译
    textareaBlur(e) {
      const text_val = e.mp.detail.value
      if(text_val){
        let params = {
          'from': this.langs[this.source_index].value,
          'to': this.langs[this.dist_index].value,
          'text': text_val,
          'fileName': 'src/temp/tts.mp3'
        }
        this.$fly.post('http://localhost:8888/translation', params).then((res) => {
          console.log(res)
          this.text = res.data.dst
          this.audioSrc = res.data.fileName
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 选择语言
    bindPickerChange(lang,data) {
      let langIndex = lang+"_index"
      this[langIndex] = data.mp.detail.value
    },
    // 语言切换
    langReserve(){
      const temp = this.source_index
      this.source_index = this.dist_index
      this.dist_index = temp
    },
    // 播放语音
    audioPlay() {
      wx.playBackgroundAudio({
        dataUrl: this.audioSrc
      })
    }
  }
}
</script>

<style scoped>
  .text{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .lang{
    width: 90%;
    padding: 30rpx 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    text-align: center;
    justify-content: space-around;
  }
  .item{
    width: 120rpx;
    height: 120rpx;
    line-height: 120rpx;
    cursor: pointer;
    border: 1px solid #f0d9da;
    background: #f0d9da;
    border-radius: 50%;
  }
  .item:hover{
    transform: scale(1.2);
  }
  .textarea{
    width: 100%;
    height: 280rpx;
    word-break: break-all;
　　word-wrap: break-word;
  }
  .line{
    width: 100%;
    height: 2rpx;
    background: #ccc;
    margin: 10rpx auto;
    margin-bottom: 20rpx;
    box-shadow: 0 0 10px #ccc;
  }
  .time{
    width: 80%;
    padding: 0 20rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 32rpx;
    color: #c8d9eb
  }
  .content{
    width: 80%;
    padding: 30rpx;
    background: #ecf2f9;
    border-radius: 20rpx;
    box-shadow: 0 1px 10px #ccc;
  }
  .dist_content{
    width: 100%;
    height: auto;
  }
  .dist_content .content_text{
    width: 100%;
    height: auto;
    word-break: break-all; /*支持IE，chrome，FF不支持*/
　　word-wrap: break-word; /*支持IE，chrome，FF*/

  }
</style>
