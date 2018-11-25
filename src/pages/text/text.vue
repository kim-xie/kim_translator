<template>
  <div class="text">
    <div class="lang animated pulse">
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

    <div class="time animated fadeIn"> {{nowTime}} </div>

    <div class="content animated bounce">
      <div class="content_wrap">
        <div class="source_content">
          <textarea class="textarea" v-model="source_text" maxlength="140" @input="getTextLength($event)" @blur="textareaBlur($event)" @confirm="textareaConfirm($event)" placeholder="请输入需要翻译的文本内容..."/>
          <p class="tip">您还可以输入 <span class="textLength">{{textLength}}</span>/140 个字符 <i class="iconfont icon-Delete" @tap="clearTextArea"></i> </p>
        </div>
        <div class="line"></div>
        <div class="dist_content">
          <p class="content_text">{{dist_text}}</p>
          <p v-if="dist_text" class="content_play"><i :class="playIcon" @tap="audioPlay"></i></p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {formatTime} from '@/utils/index.js'
export default {
  data () {
    return {
      langs: [
        {value:'zh', label:'中文'},
        {value:'en', label:'英文'},
        {value:'yue', label:'粤语'},
        {value:'jp', label:'日语'},
        {value:'kor', label:'韩语'},
        {value:'fra', label:'法语'},
        {value:'th', label:'泰语'},
        {value:'ru', label:'俄语'}
      ],
      source_index: 0,
      dist_index: 1,
      source_text: '',
      dist_text: '',
      audioSrc: '',
      textLength: 0,
      playIcon: 'iconfont icon-audio-low',
      nowTime: ''
    }
  },
  beforeMount(){
    this.getTime()
  },
  watch: {
    //this.getTime()
  },
  methods: {
    // 获取当前时间
    getTime(){
      const _this = this
      let timer = setInterval(() => {
        _this.nowTime = formatTime(new Date())
      }, 1000)
    },
    // 监听输入框事件
    getTextLength(ev){
      this.textLength = ev.mp.detail.value.length
    },
    // 清除textarea
    clearTextArea(){
      const _this = this
      this.textareaBlur('', function(){
        _this.textLength = 0
        _this.dist_text = ''
        _this.source_text = ''
      })
    },
    // 失去焦点翻译
    textareaBlur(e, callback) {
      let text_val = ''
      if(e){
        text_val = e.mp.detail.value
      }else{
        text_val = this.source_text
      }
      if(text_val){
        let params = {
          'from': this.langs[this.source_index].value,
          'to': this.langs[this.dist_index].value,
          'text': text_val
        }
        this.$fly.post('https://www.kimshare.club:18081/text_translation', params).then((res) => {
          console.log(res)
          let now = new Date().getTime()
          this.dist_text = res.data.dst
          let filename = res.data.fileName
          this.audioSrc = 'https://www.kimshare.club' + filename.split('/nginx')[1]+'?'+now
          if(callback){
            callback()
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 完成
    textareaConfirm(e){
      console.log(e)
      this.textareaBlur(e)
    },
    // 选择语言
    bindPickerChange(lang, data) {
      let langIndex = lang+"_index"
      this[langIndex] = data.mp.detail.value
      if(lang === 'dist'){
        this.dist_text = ''
        this.audioSrc = ''
        this.textareaBlur()
      }else{
        this.clearTextArea()
      }
    },
    // 语言切换
    langReserve(){
      const temp = this.source_index
      this.source_index = this.dist_index
      this.dist_index = temp
      this.clearTextArea()
    },
    // 播放语音
    audioPlay() {
      const _this = this
      let timer = null
      let timer2 = null
      // 播放
      wx.playBackgroundAudio({
        dataUrl: this.audioSrc
      })
      // 监听播放
      wx.onBackgroundAudioPlay(function () {
        // 当wx.playBackgroundAudio()执行时触发
        timer = setInterval(() => {
          _this.playIcon = 'iconfont icon-audiomid'
        }, 100)
        timer2 = setInterval(() => {
          _this.playIcon = 'iconfont icon-audio-high'
        }, 200)
      })
      // 播放结束
      wx.onBackgroundAudioStop(function () {
        // 当音乐自行播放结束时触发
        clearInterval(timer)
        clearInterval(timer2)
        _this.playIcon = 'iconfont icon-audio-low'
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
  .tip{
    text-align: right;
    font-size: 28rpx;
    color: #ccc
  }
  .tip i{
    display: inline-block;
    font-size: 34rpx;
    color: #f0d9da
  }
  .tip i:hover{
    transform: scale(1.2);
  }
  .textLength{
    color: #f0d9da;
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
  .dist_content .content_play{
    margin-top: 30rpx;
  }
  .dist_content .content_play i.icon-audio-low{
    color: #ccc
  }
  .dist_content .content_play i.icon-audiomid{
    color: #f0d9da
  }
  .dist_content .content_play i.icon-audio-high{
    color: #f0d9da
  }
</style>
