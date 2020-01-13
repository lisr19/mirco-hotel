<template>
  <div class="main">
    <div class="back-bar">
      <Icon type="ios-arrow-back" @click="$router.back()"/>
      设置</div>
    <div class="about-hotel">
      <div class="item" v-for="item in tipList">
        {{item.title}}
        <Icon type="ios-arrow-forward" />
      </div>
      <div class="item">
        <span>
          版本
        </span>
        <span class="edition">
            V2.2.0
            <Icon type="ios-arrow-forward" style="margin-left: 10px"/>
        </span>
      </div>
    </div>
    <button class="btn" @click="quitUser">退出账号</button>
  </div>
</template>

<script>
  import {getUserDate} from "@/lib/API/login-enroll";
  import { MessageBox  } from 'mint-ui';
  export default {
    data() {
      return {
        tipList:[
          {
            title:'帮助与反馈'
          },
          {
            title:'信息提醒'
          }
        ]
      }
    },
    created(){
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
    },
    methods: {
      quitUser(){
        // localStorage.clear()
        // this.socketApi.closeWebSocket()
        // this.$toast('退出成功')
        // this.$router.push({name:'登录注册'})
        MessageBox.confirm('您确定退出账户吗?').then(action => {
         if(action==='confirm'){
           localStorage.clear()
           this.socketApi.closeWebSocket()
           this.$toast('退出成功')
           // this.$router.push({name:'登录注册'})
           this.$router.push({name:'首页',params:{isLogin:true}})
         }
        }).catch(() => {
          console.log('取消');
        })
      }
    }
  }
</script>

<style scoped>
  .back-bar >>>.ivu-icon{
    font-size: 48px;
    font-weight: 500;
    margin-right: 10px;
  }
  .about-hotel >>>.ivu-icon{
    font-size: 36px;
    color: #979797;
  }
</style>

<style lang="less" scoped>
  .main {
    background-color: #f8f9fb;
    height: 100%;
    .back-bar{
      text-align: left;
      height:92px;
      background:rgba(255,255,255,1);
      font-size:26px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:92px;
      padding-left: 40px;
      display: flex;
      align-items: center;
    }
    .about-hotel{
      width:670px;
      height:280px;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 16px 0px rgba(0,0,0,0.04);
      border-radius:20px;
      margin: 42px auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .item{
        height: 78px;
        line-height: 78px;
        font-size:26px;
        font-weight:400;
        color:rgba(51,51,51,1);
        text-align: left;
        padding: 0 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .edition{
          height:36px;
          font-size:26px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:36px;
          display: flex;
          align-items: center;
        }
      }
    }
    .btn{
      width:670px;
      height:96px;
      line-height: 96px;
      background:rgba(255,255,255,1);
      border-radius:20px;
      border: none;
      font-size:26px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,145,255,1);
    }
  }
</style>
