<template>
  <div class="voice">
    <div class="lang animated pulse">
      <div class="item source">
        <picker @change="bindPickerChange('source', $event)" :value="sourcelangs[source_index].value" range-key="label" :range="sourcelangs">
          <view class="picker">
            {{sourcelangs[source_index].label}}
          </view>
        </picker>
      </div>
      <div class="item arrow">
        <!-- <icon class="iconfont icon-Group-"></icon> -->
        <view v-if="sourcelangs[source_index].value==='zh'" @tap="clear">
          清空
        </view>
        <view v-if="sourcelangs[source_index].value==='en'" @tap="clear">
          clear
        </view>
        <view v-if="sourcelangs[source_index].value==='yue'" @tap="clear">
          清空
        </view>
        <view v-if="sourcelangs[source_index].value==='si'" @tap="clear">
          清空
        </view>
      </div>
      <div class="item dist">
        <picker @change="bindPickerChange('dist', $event)" :value="distlangs[dist_index].value" range-key="label" :range="distlangs">
          <view class="picker">
            {{distlangs[dist_index].label}}
          </view>
        </picker>
      </div>
    </div>

    <scroll-view scroll-y class="record_wrap" v-if="translateDatas.length>0">
      <div class="record animated bounce" v-for="(item,index) in translateDatas" :key="index">
        <div class="time animated fadeIn"> {{item.time}} </div>
        <div class="source">
          <div class="source_text">{{item.source_text}}</div>
          <div class="source_icon">
            <img src="/static/img/listen.png" @tap="play(item.playSrc)">
          </div>
        </div>
        <div class="dist">
          <div class="dist_text">{{item.dist_text}}</div>
          <div class="dist_icon">
            <i class="iconfont" :class="{'icon-audio-low': isLow == index?false:true, 'icon-audiomid': isMid == index,  'icon-audio-high': isHigh == index}" @tap="audioPlay(index,item.audioSrc)"></i>
          </div>
        </div>
      </div>
    </scroll-view>

    <div class="speek">
      <div class="hold" @longpress="speek" @touchend="stop">
        <img src="/static/img/speek.png" alt="">
        <span v-if="sourcelangs[source_index].value==='zh'">按住说话</span>
        <span v-if="sourcelangs[source_index].value==='en'">Hold and Talk</span>
        <span v-if="sourcelangs[source_index].value==='yue'">按住說話</span>
        <span v-if="sourcelangs[source_index].value==='si'">按住说话</span>
      </div>
    </div>
  </div>
</template>

<script>
import { recordTime } from '@/utils/index'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  data () {
    return {
      sourcelangs: [
        {value:'zh', label:'中文'},
        {value:'en', label:'英文'},
        {value:'yue', label:'粤语'},
        {value:'si', label:'四川话'}
      ],
      distlangs: [
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
      isLow: -1,
      isMid: -1,
      isHigh: -1,
      nowTime: '',
      isStart: false,
      isHold: true,
      translateDatas: [],
      tempFilePath: '',
      options: {
        duration: 600000,//指定录音的时长，单位 ms
        sampleRate: 16000,//采样率
        numberOfChannels: 1,//录音通道数
        encodeBitRate: 96000,//编码码率
        format: 'mp3',//音频格式，有效值 aac/mp3
        frameSize: 50,//指定帧大小，单位 KB
      },
      recorderManager: wx.getRecorderManager(),
      innerAudioContext: wx.createInnerAudioContext()
    }
  },
  beforeMount(){
    const that = this
    this.translateDatas = wx.getStorageSync('translates') || []
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 选择语言
    bindPickerChange(lang, data) {
      let langIndex = lang+"_index"
      this[langIndex] = data.mp.detail.value
    },
    // 清空
    clear(){
      const that = this
      wx.showModal({
        title: '温馨提示',
        content: that.sourcelangs[that.source_index].value==='zh'?'确定要清空历史数据吗？':'Are you sure you want to clear historical data?',
        success (res) {
          if (res.confirm) {
            wx.removeStorageSync('translates')
            that.translateDatas = wx.getStorageSync('translates') || []
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
    },
    // 检查录音权限
    checkAuth(){
      const that = this
      return new Promise((resolve,reject) => {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.record']) {
              resolve()
            } else {
              wx.authorize({
                scope: 'scope.record',
                success() {
                  // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                  //resolve()
                }
              })
            }
          }
        })
      })
    },
    // 按住说话
    speek(){
      const that = this
      that.isHold = true
      this.checkAuth().then(() => {
        //console.log(that.isHold)
        if(that.isHold){
          that.isStart = true
          that.start()
          wx.showToast({
            mask: true,
            title: that.sourcelangs[that.source_index].value==='en'?'talking...':'说话中...',
            icon: 'loading',
            duration: 60000,
            // complete: function(){
            //   that.stop()
            // }
          })
        }
      })
    },
    play (playSrc) {
      //播放声音文件
      this.innerAudioContext.src = playSrc
      //innerAudioContext.seek(this.data.playRecord)
      this.innerAudioContext.play()
    },
    start () {
      //开始录音
      this.recorderManager.start(this.options)
      this.recorderManager.onStart(() => {
        //console.log('recorder start')
      })
    },
    stop () {
      const that = this
      if(this.isStart){
        that.isHold = true
        this.checkAuth().then(() => {
          //结束录音
          that.recorderManager.stop();
          that.recorderManager.onStop((res) => {
            that.tempFilePath = res.tempFilePath
            //console.log('停止录音', res.tempFilePath)
            wx.hideToast({})
            wx.uploadFile({
              url: 'https://www.kimshare.club:18081/upload_voice',      //此处换上你的接口地址
              filePath: that.tempFilePath,
              name: 'voice',
              header: {
                "Content-Type": "multipart/form-data"
              },
              formData:{
                'user':'test'  //其他额外的formdata，可不写
              },
              success(res){
                var data = JSON.parse(res.data)
                that.translateApi(data.path)
              },
              fail(res){
                console.log('fail')
              }
            })
          })
        })
      }else{
        this.isHold = false
      }
    },
    translateApi(fileName){
      const that = this
      let params = {
        'user': this.userInfo,
        'from': this.sourcelangs[this.source_index].value,
        'to': this.distlangs[this.dist_index].value,
        'fileName': fileName
      }
      this.$fly.post('https://www.kimshare.club:18081/voice_translation', params).then((res) => {
        //console.log(res)
        let now = new Date().getTime()
        this.dist_text = res.data.dst
        this.source_text = res.data.src
        let filename = res.data.fileName
        this.audioSrc = 'https://www.kimshare.club' + filename.split('/nginx')[1]+'?'+now
        const transObj = {
          dist_text: this.dist_text,
          source_text: this.source_text,
          playSrc: this.tempFilePath,
          audioSrc: this.audioSrc,
          time: recordTime(new Date())
        }
        const translates = wx.getStorageSync('translates') || []
        translates.unshift(transObj)
        wx.setStorageSync('translates', translates)
        this.translateDatas = wx.getStorageSync('translates') || []
      }).catch((err) => {
        console.log(err)
        wx.showModal({
          title: '温馨提示',
          content: '网络连接中断，请稍后重试!',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      })
    },
    // 播放语音
    audioPlay(index,audioSrc) {
      const _this = this
      let timer = null
      let timer2 = null
      // 播放
      wx.playBackgroundAudio({
        dataUrl: audioSrc
      })
      // 监听播放
      wx.onBackgroundAudioPlay(function () {
        // 当wx.playBackgroundAudio()执行时触发
        timer = setInterval(() => {
          _this.isLow = index
          _this.isMid = index
          _this.isHigh = -1
        }, 100)
        timer2 = setInterval(() => {
          _this.isLow = index
          _this.isMid = -1
          _this.isHigh = index
        }, 200)
      })
      // 播放结束
      wx.onBackgroundAudioStop(function () {
        // 当音乐自行播放结束时触发
        clearInterval(timer2)
        clearInterval(timer)
        _this.isLow = -1
        _this.isMid = -1
        _this.isHigh = -1
      })
    }
  }
}
</script>

<style scoped>
  .voice{
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
  .record_wrap{
    height: calc(100vh - 180rpx - 120rpx);
    width: 100%;
    margin: 0px auto;
    padding-bottom: 20px;
  }
  .record{
    width: 85%;
    margin: 0px auto;
    overflow: hidden;
    border-radius: 8px;
    /* box-shadow: 0 4px 16px 2px #ccc; */
    /* box-shadow: 0 0px 1px 2px #ccc; */
    border: 1px solid #f1f1f1;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .time{
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #ccc
  }
  .record .source{
    position: relative;
    overflow: hidden;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
  }
  .record .source .source_text{
    height: 100%;
    display: inline-block;
    width: 90%;
    padding: 6px 20px 6px 0;
  }
  .record .source .source_icon{
    position: absolute;
    overflow: hidden;
    text-align: center;
    height: 100%;
    display: inline-block;
    right: 8px;
    top: 6px;
  }
  .record .source .source_icon img{
    height: 20px;
    width: 20px;

  }
  .record .dist{
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .record .dist .dist_text{
    height: 100%;
    display: inline-block;
    width: 90%;
    padding: 6px 20px 6px 0;
  }
  .record .dist .dist_icon{
    position: absolute;
    overflow: hidden;
    text-align: center;
    height: 100%;
    display: inline-block;
    right: 0px;
    top: 6px;
  }
  .record .dist .dist_icon i{
    font-size: 25px;
    color: #ccc;
  }
  .record .dist i.icon-audiomid{
    color: #f0d9da
  }
  .record .dist i.icon-audio-high{
    color: #f0d9da
  }
  .speek{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #f0d9da;
  }
  .hold{
    height: 100%;
    text-align: center;
  }
  img{
    width: 32px;
    height: 90%;
    vertical-align: middle;
  }
</style>
