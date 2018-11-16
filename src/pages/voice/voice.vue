<template>
  <div class="voice">
    <div class="lang">
      <div class="item source">中文</div>
      <div class="item arrow">
        <i class="iconfont icon-Group-"></i>
      </div>
      <div class="item dist">
        英文
      </div>
    </div>

    <div class="time">
      2018/11/16 12:00:00
    </div>

    <div class="content">
      <div class="content_wrap">
        <div class="source_content"></div>
        <div class="dist_content">
          <text>{{text}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  data () {
    return {
      text: '123132331'
    }
  },
  beforeMount(){
    
  },
  computed: {
    //...mapState(['userInfo']),
    //...mapGetters(['userInfo'])
  },
  methods: {
    
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
    display: flex;
    flex-direction: column;
    align-items: center;
    background: red
  }
  .item{
    -webkit-flex: 1;
          flex: 1;
  }
  .time{
    width: 90%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: green
  }
  .content{
    width: 90%;
    background: yellow
  }
</style>
