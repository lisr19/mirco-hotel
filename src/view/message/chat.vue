<template>
  <div >
    <div class="msg-header" id="height">
      <img src="@/assets/icon/back-black.png" id="back" @click="goback"/>
      <span>{{this.$route.query.name}}</span>
      <img src="" id="more"/>
    </div>
    <!--<div class="msg-body" style="padding:0">-->
      <!--<div class="info" id="height2">-->
        <!--<img src=""/>-->
        <!--<div class="content">-->
          <!--<span class="font1">【民宿】森林小屋|北京路…</span>-->
          <!--<span class="font2">5.0分&nbsp;&nbsp;126评价&nbsp;&nbsp; 舒适型&nbsp;&nbsp; ¥299</span>-->
        <!--</div>-->
        <!--<div class="btn">发送房源</div>-->
      <!--</div>-->
      <myChat
        ref="myChat"
        v-if="isShow"
        :data="chatData"
        :showShade="false"
        :getUpperData="getUpperData"
        :getUnderData="getUnderData"
        :ownerAvatarUrl="ownerAvatarUrl"
        :contactAvatarUrl="contactAvatarUrl"
        :height="height"
        :userId="searchOption.userId"
        :otherId="searchOption.otherId"
      >
      </myChat>
    <!--</div>-->
  </div>
</template>

<script>
  import{getChatBySomeone}from '@/lib/API/message'
  import {getUserDate} from "@/lib/API/login-enroll";
  import myChat from "@/components/myChat/myChat"

  export default {
    name: "chat",
    components: {
      myChat
    },
    data() {
      return {
        myData:{},//用户信息
        upperTimes: 0,
        underTimes: 0,
        upperId: 0,
        underId: 6,
        height:0,
        isShow:false,
        searchOption:{
          page:1,
          size:20,
          userId:localStorage.getItem('MicroHotelUserData').split(',')[0],
          otherId:Number(this.$route.query.id)
        },
        ownerAvatarUrl: require('@/assets/img/defaultavatar.png'),
        contactAvatarUrl: this.$route.query.logoUrl,
        chatData: [],
        newData:[],
        hasNextPage:false,//是否又下一页
      }
    },
    created() {
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      this.getUserDate()
      this.initWidth();
      this.getChatBySomeone(this.searchOption)
      setTimeout(()=>{
        this.isShow = true
      },100)
    },
    mounted(){
      this.height = document.getElementById('height').offsetHeight
      let self = this
      if(!self.connect){
        self.socketApi.websocket.onmessage = function (event) {
          // console.log(event)
          self.$refs.myChat.pushMsgIntoArray(JSON.parse(JSON.parse(event.data)))
        }
      }
    },
    methods: {
      async getChatBySomeone(params){
        let res = await getChatBySomeone(params);
        // console.log(res)
        if(res.code===200){
          // this.chatData=[];
          let array = res.data.list.reverse();
          this.hasNextPage = res.data.hasNextPage
          for(let i=0;i<array.length;i++){
            let direction = 1;
            if(array[i].receiverId != this.searchOption.userId)direction = 2
            this.chatData.push({
              direction:direction,
              ctime:array[i].addTime,
              content:array[i].message,
              type:1,
            })
          }
        }
      },

      //获取个人信息
      async getUserDate(){
        let res = await getUserDate({id:this.userID})
        if(res.code === 200){
          this.myData = res.data.list[0]
          this.ownerAvatarUrl = this.myData.avatar
          if(!this.myData.avatar){
            this.ownerAvatarUrl= require('@/assets/img/defaultavatar.png')
          }
        }
      },

      goback() {
        this.$router.go(-1)
      },
      initWidth() {
        let ua = navigator.userAgent;
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
          isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
          isAndroid = ua.match(/(Android)\s+([\d.]+)/),
          isMobile = isIphone || isAndroid;
        //非移动端设置400px宽度，移动端是100%
        // if (!isMobile) {
        //   this.width = 400
        // }
      },
      //向上滚动加载数据
      async getUpperData() {
        let self = this;
        self.newData = []
        if(self.hasNextPage){
          this.searchOption.page++
          let res = await getChatBySomeone(this.searchOption);
          if(res.code===200){
            // this.chatData=[];
            let array = res.data.list.reverse();
            for(let i=0;i<array.length;i++){
              let direction = 1;
              if(array[i].receiverId != this.searchOption.userId)direction = 2
              self.chatData.unshift({
                direction:direction,
                ctime:array[i].addTime,
                content:array[i].message,
                type:1,
              })
              self.newData.unshift({
                direction:direction,
                ctime:array[i].addTime,
                content:array[i].message,
                type:1,
              })
            }
          }
        }
        return new Promise(function (resolve) {
          setTimeout(function () {
            //模拟加载完毕
            if (self.upperTimes > 3) {
              return resolve([]);
            }
            //加载数据
            resolve(self.newData)
          }, 1000);
          self.upperId = self.upperId + 2;
          self.upperTimes++;
        })
      },

      getUnderData() {}
    }
  }
</script>

<style lang="less" scoped>
  @import "message";
</style>
