<template>
  <div>
    <div class="msg-header">
      <img src="" id="back" @click="goback"/>
      <span>会议记录</span>
      <img src="" id="more"/>
    </div>
    <div class="msg-body"  :style="'minHeight:'+(minHeight-128)+'px'">
      <div v-for="(item,index) in messageList" :class="item.status === 0?'msg-card':'msg-card2'">
        <div class="card-title">{{item.name}}</div>
        <div class="card-item">时间：<span class="time">{{item.time}}</span><span class="tip">（准时召开）</span></div>
        <div class="card-item">地址：<span class="content">{{item.address}}</span></div>
        <div class="card-item">备注：<span class="content2">{{item.desc}}</span></div>
        <div class="btn" v-if="item.status === 0">提醒设置</div>
        <div class="btn" v-if="item.status === 1">已结束</div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "notice",
    data() {
      return {
        minHeight:window.screen.height,
        messageList: [
          {
            name:'工程中心',
            time:'2019年3月28日 14:00',
            address:'中山大学广州东校区实验中心C栋四楼C-403会议室',
            desc:'请携带好项目相关文件',
            status:0,
          },
          {
            name:'工程中心',
            time:'2019年3月28日 14:00',
            address:'中山大学广州东校区实验中心C栋四楼C-403会议室',
            desc:'请携带好项目相关文件',
            status:1,
          },
        ]
      }
    },
    methods:{
      goback(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "message";
</style>
