<template>
  <div class="main">
    <div class="banner">
      <img src="@/assets/img/gerenzx2.png" alt="">
      <p>
       <span @click="openMy">
          <img class="head-img" :src="avatar" alt=" ">
          <strong class="name">{{username}}</strong>
       </span>
        <span>
          <img class="icon" src="@/assets/icon/set.png" alt="" @click="setting">
          <img class="icon" src="@/assets/icon/service.png" alt="">
        </span>
      </p>
    </div>
    <div class="card">
      <ul class="items">
        <li class="item" v-for="item in typeList" @click="openCategory(item.name)">
          <div style="height: 40px;display: flex;align-items: center;justify-content: center">
            <img :src="item.iconUrl" alt="">
          </div>
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
    </div>
    <button class="apply-btn" @click="apply">
      <img src="@/assets/icon/fangdong.png" alt="">
      {{landlordBut}}
    </button>
    <div class="about-hotel">
      <div class="item" v-for="item in tipList" @click="openDetail(item)">
        {{item.title}}
        <Icon type="ios-arrow-forward" />
      </div>
      <div class="item" @click="$toast('已是最新版本了')">
        <span>
          关于微酒店
        </span>
        <span class="edition">
            已是最新版本
            <Icon type="ios-arrow-forward" style="margin-left: 10px"/>
        </span>
      </div>
    </div>
    <transition name="fade">
      <div class="layout" v-if="isApply" @click.self="isApply=false">
        <div class="content">
          <div class="bg">
            <img src="@/assets/img/fangdong.png" alt="">
          </div>
          <h1> 成为房东</h1>
          <ul>
            <li>
              <i class="spot"></i>
              轻松赚取收入
            </li>
            <li>
              <i class="spot"></i>
              我们为您提供全面保障
            </li>
            <li>
              <i class="spot"></i>
              何时出租、如何出租都由您决定
            </li>
          </ul>
          <button class="apply-now" @click="openLandlord">立即申请</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {getUserDate} from "@/lib/API/login-enroll";
  export default {
    data() {
      return {
        avatar:require('@/assets/img/headimg2.png'),//头像
        username:null,
        isApply:false,
        landlordBut:'成为房东',
        typeList:[
          {
            name:'收藏',
            iconUrl: require('@/assets/icon/collect.png'),
          },
          {
            name:'红包/卡券',
            iconUrl: require('@/assets/icon/coupon.png'),
          },
          {
            name:'评价',
            iconUrl: require('@/assets/icon/evaluate.png'),
          },
          {
            name:'会议',
            iconUrl: require('@/assets/icon/meet.png'),
          }
        ],
        tipList:[
          {
            title:'推荐微酒店给朋友'
          },
          {
            title:'意见反馈'
          },
          {
            title:'便民服务'
          }
        ]
      }
    },
    created(){
      if(localStorage.getItem('MicroHotelUserData').split(',')[2]=='true'){
        this.landlordBut = '切换成房东'
      }
      this.userID = localStorage.getItem('MicroHotelUserData').split(',')[0]
      this.getUserDate({id:this.userID})
    },
    methods: {
      //获取个人信息
      async getUserDate(params){
        let res = await getUserDate(params)
        if(res.code === 200){
          this.myData = res.data.list[0]
          this.username = this.myData.username
          this.avatar = this.myData.avatar
        }
      },
      openMy(){
        this.$router.push({name:'我的',params:{callback:this.callback}})
      },
      callback(){
        this.getUserDate({id:this.userID})
      },
      apply(){
        if(this.landlordBut=='切换成房东'){
          this.$router.push({path:'/landlord'})
        }else{
          this.isApply =true
        }
      },
      openCategory(params) {
        console.log(params);
        if(params==='收藏'){
          this.$router.push({path: '/collect'})
        }else if(params==='红包/卡券') {
          this.$router.push({path: '/coupon'})
        }else if(params==='评价') {
          this.$router.push({path: '/comment'})
        }else {
          this.$toast('功能尚未开通，敬请期待')
        }
      },
      openLandlord(){
        this.isApply = false
        this.$router.push({path:'/landlord'})
      },
      //设置
      setting(){
        this.$router.push({path:'/quit'})
      },
      //关于酒店详情
      openDetail(item){
        if(item.title==='便民服务'){
          this.$router.push({path:'/friendship-links'})
        }else {
          this.$toast('功能开发中...')
        }
      }
    }
  }
</script>

<style scoped>
  .main >>> .ivu-icon{
    font-size: 40px;
    color: #979797FF;
  }
</style>
<style lang="less" scoped>
  .main {
    background-color: #f8f9fb;
    height: 100%;
    position: relative;
    .banner {
      height:340px;
      position: relative;
      overflow: hidden;
      >img{
        display: block;
        position: absolute;
        width: 100%;
        height: auto;
        top: -50px;
        left: 0;
        z-index: 1;
      }
      p{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 50px 40px;
        z-index: 2;
        span{
          display: flex;
          align-items: center;
        }
        .head-img{
          border-radius: 50%;
          margin-right:24px ;
          width:108px;
          height:108px;
          z-index: 2;
	        overflow: hidden;
	        background-color: #cccccc;
        }
        .name{
          height:44px;
          font-size:32px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:44px;
          text-shadow:0px 4px 8px rgba(0,0,0,0.27);
          z-index: 2;
        }
        .icon{
          display: block;
          height:34px;
          width:36px;
          margin-left: 28px;
          z-index: 2;
        }
      }
    }
    .card {
      /*width:670px;*/
      width:90%;
      height:218px;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 16px 0px rgba(0,0,0,0.04);
      border-radius:20px;
      margin: 0 auto;
      position: absolute;
      left:5%;
      top: 256px;
      z-index: 2;
      ul{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;
        height: 100%;
        li{
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          img{
            max-width: 60px;
          }
          .name{
            height:36px;
            font-size:26px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:36px;
            margin-top: 20px;
          }
        }
      }
    }
    .apply-btn{
      /*width:670px;*/
	    width:90%;
      height:96px;
      background:rgba(255,255,255,1);
      box-shadow:0px 10px 16px 0px rgba(0,0,0,0.04);
      border-radius:20px;
      margin: 180px auto 0;
      border: none;
      font-size:26px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(51,51,51,1);
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        margin-right: 20px;
        max-height: 30px;
      }
    }
    .about-hotel{
      /*width:670px;*/
	    width:90%;
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
          font-size:20px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:36px;
          display: flex;
          align-items: center;
        }
      }
    }
    .layout{
      background:rgba(0,0,0,0.26);
      width: 100%;
      height: 100%;
      position: absolute;
      top:0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9;
      display: flex;
      justify-content: center;
      align-items: center;
      .content{
        width:558px;
        height:714px;
        background:rgba(255,255,255,1);
        border-radius:30px;
        overflow: hidden;
        text-align: center;
        .bg{
          width:558px;
          height:322px;
          img{
            width: 100%;
          }
        }
        h1{
          height:44px;
          font-size:32px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(72,72,72,1);
          line-height:44px;
          padding-left: 52px;
          margin: 18px 0 34px;
          text-align: left;
        }
        ul{
          padding-left:52px;
          text-align: left;
          li{
            height:36px;
            font-size:26px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:36px;
            margin-bottom: 16px;
            position: relative;
            .spot{
              width:10px;
              height:10px;
              background:rgba(0,194,254,1);
              position: absolute;
              left: -24px;
              top: 14px;
              border-radius: 50%;
            }
          }
        }
        .apply-now{
          width:458px;
          height:76px;
          background:linear-gradient(180deg,rgba(0,199,254,1) 0%,rgba(98,140,253,1) 100%);
          border-radius:42px;
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:44px;
          border: none;
          margin: 34px auto 0;
        }
      }
    }
  }
</style>
